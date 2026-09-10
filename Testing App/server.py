"""Unified server for English, GK, Math and Reasoning apps.

Run from this folder with: python server.py
Open: http://127.0.0.1:8000
"""

import importlib.util
import json
import sys
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

ROOT = Path(__file__).resolve().parent


def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


MATH = load_module("unified_math_server", ROOT / "Math" / "server.py")
REASONING = load_module("unified_reasoning_server", ROOT / "Reasoning" / "server.py")
GK = load_module("unified_gk_server", ROOT / "G.K App" / "server.py")
SUBJECTS = {
    "english": ROOT / "English",
    "gk": ROOT / "G.K App",
    "math": ROOT / "Math",
    "reasoning": ROOT / "Reasoning",
}
ENGLISH_DIR = ROOT / "English"

# English app has exactly three persistent data files.
ENGLISH_VOCAB_FILE = ENGLISH_DIR / "vocab.json"
ENGLISH_IDIOMS_FILE = ENGLISH_DIR / "idioms.json"
ENGLISH_MISSING_FILE = ENGLISH_DIR / "missing.json"


def _english_array(payload, key):
    value = payload.get(key)
    if not isinstance(value, list):
        raise ValueError(f'English "{key}" must be an array')
    return value


def _read_json_object(path):
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path.name} must contain a JSON object")
    return data


def _word_key(word):
    if not isinstance(word, dict):
        return ""
    return str(word.get("en", "")).strip().casefold()


def _validate_unique_word_pools(new_items, old_items, label):
    seen = set()
    for item in [*new_items, *old_items]:
        key = _word_key(item)
        if not key:
            raise ValueError(f'{label} contains an entry without a valid "en" value')
        if key in seen:
            raise ValueError(
                f'Duplicate {label} entry found across New/Old pools: "{item.get("en", "")}"'
            )
        seen.add(key)


def _validate_unique_missing_words(items):
    seen = set()
    for item in items:
        if not isinstance(item, str):
            raise ValueError("Each missing word must be a string")
        key = item.strip().casefold()
        if not key:
            raise ValueError("Missing words cannot contain an empty value")
        if key in seen:
            raise ValueError(f'Duplicate missing word found: "{item}"')
        seen.add(key)


def _validate_english_data(data):
    for key in ("words", "idioms", "oldWords", "oldIdioms", "missingWords"):
        if not isinstance(data.get(key), list):
            raise ValueError(f'English data "{key}" must be an array')

    _validate_unique_word_pools(data["words"], data["oldWords"], "vocabulary")
    _validate_unique_word_pools(data["idioms"], data["oldIdioms"], "idiom")
    _validate_unique_missing_words(data["missingWords"])
    return data


def _default_english_documents():
    return {
        ENGLISH_VOCAB_FILE: {
            "words": [],
            "oldWords": [],
        },
        ENGLISH_IDIOMS_FILE: {
            "idioms": [],
            "oldIdioms": [],
        },
        ENGLISH_MISSING_FILE: {
            "missingWords": [],
        },
    }


def ensure_english_data_files():
    """Create only the three supported English JSON files when missing."""
    ENGLISH_DIR.mkdir(parents=True, exist_ok=True)

    for path, document in _default_english_documents().items():
        if path.exists():
            continue
        path.write_text(
            json.dumps(document, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )


def load_english_data():
    """Load English data only from vocab.json, idioms.json and missing.json."""
    ensure_english_data_files()

    vocab = _read_json_object(ENGLISH_VOCAB_FILE)
    idioms = _read_json_object(ENGLISH_IDIOMS_FILE)
    missing = _read_json_object(ENGLISH_MISSING_FILE)

    data = {
        "words": vocab.get("words", []),
        "oldWords": vocab.get("oldWords", []),
        "idioms": idioms.get("idioms", []),
        "oldIdioms": idioms.get("oldIdioms", []),
        "missingWords": missing.get("missingWords", []),
    }
    return _validate_english_data(data)


def persist_english_data(payload):
    """Persist the complete English state into exactly three JSON files."""
    if not isinstance(payload, dict):
        raise ValueError("English data must be a JSON object")

    data = {
        "words": _english_array(payload, "words"),
        "idioms": _english_array(payload, "idioms"),
        "oldWords": _english_array(payload, "oldWords"),
        "oldIdioms": _english_array(payload, "oldIdioms"),
        "missingWords": _english_array(payload, "missingWords"),
    }
    _validate_english_data(data)

    ensure_english_data_files()

    writes = [
        (
            ENGLISH_VOCAB_FILE,
            {
                "words": data["words"],
                "oldWords": data["oldWords"],
            },
        ),
        (
            ENGLISH_IDIOMS_FILE,
            {
                "idioms": data["idioms"],
                "oldIdioms": data["oldIdioms"],
            },
        ),
        (
            ENGLISH_MISSING_FILE,
            {
                "missingWords": data["missingWords"],
            },
        ),
    ]

    temporary_files = []
    try:
        # Write all temp files first, then replace the real files.
        for target, document in writes:
            temp = target.with_suffix(target.suffix + ".tmp")
            temp.write_text(
                json.dumps(document, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
            temporary_files.append((temp, target))

        for temp, target in temporary_files:
            temp.replace(target)
    finally:
        for temp, _ in temporary_files:
            if temp.exists():
                temp.unlink()

    return data


class UnifiedHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.static_root = ROOT
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def translate_path(self, path):
        if self.static_root != ROOT:
            relative = unquote(urlparse(path).path).lstrip("/")
            return str(self.static_root / relative)
        return super().translate_path(path)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        try:
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except ConnectionError:
            return

    def subject_from_request(self):
        path = urlparse(self.path).path.strip("/")
        if path.startswith("api/english/"):
            return "english"
        first = path.split("/", 1)[0].lower() if path else ""
        if first in SUBJECTS:
            return first
        referer = self.headers.get("Referer", "")
        referer_path = urlparse(referer).path.strip("/")
        first = referer_path.split("/", 1)[0].lower() if referer_path else ""
        return first if first in SUBJECTS else None

    def select_static_root(self):
        subject = self.subject_from_request()
        path = urlparse(self.path).path
        if subject and path.strip("/").split("/", 1)[0].lower() == subject:
            remainder = path.strip("/").split("/", 1)
            default_file = "MathQuizApp.html" if subject in ("math", "reasoning") else "index.html"
            self.path = "/" + (remainder[1] if len(remainder) == 2 else default_file)
            self.static_root = SUBJECTS[subject]
        elif path == "/":
            self.path = "/index.html"
        elif subject and subject in SUBJECTS:
            # Handle /uploads/ and other paths that need subject context from Referer
            self.static_root = SUBJECTS[subject]

    def do_GET(self):
        path = urlparse(self.path).path
        subject = self.subject_from_request()

        if path == "/api/english/data" and subject == "english":
            try:
                self.send_json(HTTPStatus.OK, {"ok": True, "data": load_english_data(), "files": ["vocab.json", "idioms.json", "missing.json"]})
            except (OSError, ValueError, json.JSONDecodeError, UnicodeDecodeError) as error:
                self.send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(error)})
            return
        if path == "/api/questions" and subject in ("math", "reasoning"):
            self.send_json(HTTPStatus.OK, {"questions": subject_module(subject).load_questions()})
            return
        if path == "/api/health" and subject == "gk":
            self.send_json(HTTPStatus.OK, {
                "ok": True,
                "questionUpdateEndpoint": True,
                "dateImageEndpoint": True,
                "questionCreateEndpoint": True,
                "questionBulkCreateEndpoint": True,
                "staticQuestionCreateEndpoint": True,
                "staticQuestionBulkCreateEndpoint": True,
                "staticSourceFilesEndpoint": True,
                "gkServerVersion": getattr(GK, "SERVER_VERSION", "unknown"),
                "baseDir": str(GK.BASE_DIR),
            })
            return

        if path == "/api/current-user-questions" and subject == "gk":
            try:
                with GK.USER_CURRENT_AFFAIRS_LOCK:
                    questions = GK.read_user_current_affairs()
                self.send_json(HTTPStatus.OK, {"ok": True, "questions": questions})
            except (OSError, ValueError, json.JSONDecodeError, UnicodeDecodeError) as error:
                self.send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(error)})
            return

        if path == "/api/user-static-questions" and subject == "gk":
            try:
                with GK.USER_STATIC_GK_LOCK:
                    questions = GK.read_user_static_gk()
                self.send_json(HTTPStatus.OK, {"ok": True, "questions": questions})
            except (OSError, ValueError, json.JSONDecodeError, UnicodeDecodeError) as error:
                self.send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(error)})
            return

        if path == "/api/static-source-files" and subject == "gk":
            try:
                files = GK.list_static_source_files()
                self.send_json(HTTPStatus.OK, {"ok": True, "files": files})
            except (OSError, ValueError, json.JSONDecodeError, UnicodeDecodeError) as error:
                self.send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(error)})
            return

        # GK Current Affairs date images. These routes are handled here because
        # this unified server is the process actually listening on port 8000.
        if path == "/api/date-images":
            try:
                query = parse_qs(urlparse(self.path).query)
                requested_date = str(query.get("date", [""])[0]).strip()
                with GK.DATE_IMAGE_LOCK:
                    index = GK.read_date_images_index()

                if requested_date:
                    requested_date = GK.validate_image_date(requested_date)
                    self.send_json(HTTPStatus.OK, {
                        "ok": True,
                        "date": requested_date,
                        "images": index.get(requested_date, []),
                    })
                else:
                    self.send_json(HTTPStatus.OK, {
                        "ok": True,
                        "dates": index,
                    })
            except (OSError, ValueError, json.JSONDecodeError, UnicodeDecodeError) as error:
                self.send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(error)})
            return
        if path == "/api/changes" and subject == "gk":
            self.send_json(HTTPStatus.OK, {"version": 1, "deletedIds": [], "visibility": {}, "addedExplanations": {}, "originalExplanations": {}, "correctedAnswers": {}})
            return

        self.select_static_root()
        super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        subject = self.subject_from_request()
        length = int(self.headers.get("Content-Length", "0"))
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            if path == "/api/questions" and subject in ("math", "reasoning"):
                saved = subject_module(subject).persist_questions(payload)
                self.send_json(HTTPStatus.OK, {"questions": saved})
                return
            if path == "/api/english/data" and subject == "english":
                saved = persist_english_data(payload)
                self.send_json(HTTPStatus.OK, {"ok": True, "data": saved, "files": ["vocab.json", "idioms.json", "missing.json"]})
                return
            if path == "/api/current-question-create" and subject == "gk":
                record = GK.create_user_current_affairs_question(payload)
                self.send_json(HTTPStatus.OK, {
                    "ok": True,
                    "question": record,
                    "file": GK.USER_CURRENT_AFFAIRS_FILE.name,
                })
                return

            if path == "/api/current-question-create-bulk" and subject == "gk":
                records = GK.create_user_current_affairs_questions(payload)
                self.send_json(HTTPStatus.OK, {
                    "ok": True,
                    "questions": records,
                    "count": len(records),
                    "file": GK.USER_CURRENT_AFFAIRS_FILE.name,
                })
                return

            if path == "/api/static-question-create" and subject == "gk":
                record = GK.create_user_static_question(payload)
                self.send_json(HTTPStatus.OK, {
                    "ok": True,
                    "question": record,
                    "file": record.get("sourceFile", ""),
                })
                return

            if path == "/api/static-question-create-bulk" and subject == "gk":
                records = GK.create_user_static_questions(payload)
                self.send_json(HTTPStatus.OK, {
                    "ok": True,
                    "questions": records,
                    "count": len(records),
                    "file": records[0].get("sourceFile", "") if records else "",
                })
                return

            if path == "/api/date-image-save":
                record = GK.save_date_image(
                    payload.get("date", ""),
                    payload.get("name", "Image"),
                    payload.get("dataUrl", ""),
                    payload.get("questionId", ""),
                )
                self.send_json(HTTPStatus.OK, {"ok": True, "image": record})
                return

            if path == "/api/date-image-delete":
                date = payload.get("date", "")
                image_id = payload.get("id", "")
                GK.delete_date_image(date, image_id)
                self.send_json(HTTPStatus.OK, {
                    "ok": True,
                    "date": GK.validate_image_date(date),
                    "id": str(image_id),
                })
                return

            if path == "/api/question-update" and subject == "gk":
                question_id = str(payload.get("id", "")).strip()
                action = str(payload.get("action", "")).strip()
                if not question_id:
                    raise ValueError("Question id is required.")
                file_name = GK.update_question(question_id, action, payload.get("value"))
                self.send_json(HTTPStatus.OK, {"ok": True, "file": file_name, "id": question_id, "action": action})
                return
        except FileNotFoundError as error:
            self.send_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": str(error)})
            return
        except (OSError, ValueError, json.JSONDecodeError, UnicodeDecodeError) as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(error)})
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def do_DELETE(self):
        path = urlparse(self.path).path
        subject = self.subject_from_request()
        if path == "/api/questions" and subject in ("math", "reasoning"):
            question_id = parse_qs(urlparse(self.path).query).get("id", [None])[0]
            try:
                remaining = subject_module(subject).delete_question(question_id)
            except (OSError, ValueError, json.JSONDecodeError, UnicodeDecodeError) as error:
                self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
                return
            self.send_json(HTTPStatus.OK, {"questions": remaining})
            return
        self.send_error(HTTPStatus.NOT_FOUND)


def subject_module(subject):
    return MATH if subject == "math" else REASONING


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), UnifiedHandler)
    print("Study App Hub is running at http://127.0.0.1:8000")
    print("Apps: /english/ /gk/ /math/ /reasoning/")
    print("GK question API: GET /api/current-user-questions")
    print("GK question API: POST /api/current-question-create")
    print("GK question API: POST /api/current-question-create-bulk")
    print("GK static API: GET /api/user-static-questions")
    print("GK static API: GET /api/static-source-files")
    print("GK static API: POST /api/static-question-create")
    print("GK static API: POST /api/static-question-create-bulk")
    print("GK image API: GET /api/date-images")
    print("GK image API: POST /api/date-image-save")
    print("GK image API: POST /api/date-image-delete")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
