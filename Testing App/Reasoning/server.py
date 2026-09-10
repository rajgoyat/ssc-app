"""Local server for the Reasoning Bank app.

Run with: python server.py
Then open: http://localhost:8000
"""

import base64
import binascii
import hashlib
import json
import re
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "data" / "questions.json"
TOPICS_DIR = ROOT / "data" / "topics"
UPLOADS_DIR = ROOT / "uploads"
DATA_URL_PATTERN = re.compile(r"^data:(image/(?:png|jpeg|gif|webp));base64,([A-Za-z0-9+/=\r\n]+)$")
EXTENSIONS = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/gif": ".gif",
    "image/webp": ".webp",
}


def topic_slug(category):
    value = str(category or "General").strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "general"


def save_image(value, topic):
    if not isinstance(value, str):
        return value

    match = DATA_URL_PATTERN.match(value)
    if not match:
        return value

    media_type, encoded = match.groups()
    try:
        image_bytes = base64.b64decode("".join(encoded.split()), validate=True)
    except binascii.Error:
        return value

    if not image_bytes:
        return None

    topic_uploads_dir = UPLOADS_DIR / topic
    topic_uploads_dir.mkdir(parents=True, exist_ok=True)
    filename = hashlib.sha256(image_bytes).hexdigest() + EXTENSIONS[media_type]
    image_path = topic_uploads_dir / filename
    if not image_path.exists():
        image_path.write_bytes(image_bytes)
    return f"/uploads/{topic}/{filename}"


def persist_questions(questions):
    if not isinstance(questions, list):
        raise ValueError("Questions must be an array")

    saved = []
    topics = {}
    for question in questions:
        if not isinstance(question, dict):
            continue
        question = dict(question)
        topic = topic_slug(question.get("category"))
        question["questionImage"] = save_image(question.get("questionImage"), topic)
        question["solutionImage"] = save_image(question.get("solutionImage"), topic)
        saved.append(question)
        topics.setdefault(topic, []).append(question)

    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    temporary_file = DATA_FILE.with_suffix(".json.tmp")
    temporary_file.write_text(json.dumps(saved, indent=2, ensure_ascii=False), encoding="utf-8")
    temporary_file.replace(DATA_FILE)

    TOPICS_DIR.mkdir(parents=True, exist_ok=True)
    existing_topic_files = {path.stem for path in TOPICS_DIR.glob("*.json") if path.is_file()}
    for stale_topic in sorted(existing_topic_files - set(topics.keys())):
        stale_file = TOPICS_DIR / f"{stale_topic}.json"
        stale_file.unlink(missing_ok=True)

    for topic, topic_questions in topics.items():
        topic_file = TOPICS_DIR / f"{topic}.json"
        temporary_topic_file = topic_file.with_suffix(".json.tmp")
        temporary_topic_file.write_text(json.dumps(topic_questions, indent=2, ensure_ascii=False), encoding="utf-8")
        temporary_topic_file.replace(topic_file)
    return saved


def get_uploaded_image_paths(question):
    if not isinstance(question, dict):
        return []

    paths = []
    for key in ("questionImage", "solutionImage"):
        value = question.get(key)
        if not isinstance(value, str):
            continue
        cleaned = value.strip()
        if not cleaned:
            continue
        if cleaned.startswith("/uploads/"):
            paths.append((ROOT / cleaned.lstrip("/")).resolve())
    return paths


def cleanup_unused_images(remaining_questions):
    remaining_paths = set()
    for question in remaining_questions:
        for file_path in get_uploaded_image_paths(question):
            remaining_paths.add(file_path)

    if not UPLOADS_DIR.exists():
        return

    for image_file in sorted(UPLOADS_DIR.rglob("*"), key=lambda item: len(item.relative_to(UPLOADS_DIR).parts), reverse=True):
        if not image_file.is_file():
            continue
        if image_file.resolve() not in remaining_paths:
            image_file.unlink(missing_ok=True)

    for directory in sorted(UPLOADS_DIR.rglob("*"), key=lambda item: len(item.relative_to(UPLOADS_DIR).parts), reverse=True):
        if directory.is_dir() and not any(directory.iterdir()):
            directory.rmdir()


def load_questions():
    if not DATA_FILE.exists():
        return []
    try:
        data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (OSError, json.JSONDecodeError):
        return []


def delete_question(question_id):
    questions = load_questions()
    if question_id is None:
        return questions

    remaining = [question for question in questions if str(question.get("id")) != str(question_id)]
    removed = [question for question in questions if str(question.get("id")) == str(question_id)]
    cleaned = persist_questions(remaining)
    cleanup_unused_images(cleaned)
    for question in removed:
        for file_path in get_uploaded_image_paths(question):
            try:
                file_path.unlink(missing_ok=True)
            except OSError:
                pass
    return cleaned


class MathBankHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        
        if path == "/api/questions":
            self.send_json(HTTPStatus.OK, {"questions": load_questions()})
            return
        
        # Handle file serving (including uploads)
        return super().do_GET()

    def do_POST(self):
        if self.path.split("?", 1)[0] != "/api/questions":
            self.send_error(HTTPStatus.NOT_FOUND)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            questions = json.loads(self.rfile.read(length).decode("utf-8"))
            saved = persist_questions(questions)
        except (OSError, ValueError, json.JSONDecodeError, UnicodeDecodeError) as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
            return
        self.send_json(HTTPStatus.OK, {"questions": saved})

    def do_DELETE(self):
        if self.path.split("?", 1)[0] != "/api/questions":
            self.send_error(HTTPStatus.NOT_FOUND)
            return

        query = self.path.split("?", 1)[1] if "?" in self.path else ""
        params = {}
        if query:
            for pair in query.split("&"):
                if "=" in pair:
                    key, value = pair.split("=", 1)
                    params[key] = value

        question_id = params.get("id")
        try:
            remaining = delete_question(question_id)
        except (OSError, ValueError, json.JSONDecodeError, UnicodeDecodeError) as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
            return
        self.send_json(HTTPStatus.OK, {"questions": remaining})


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), MathBankHandler)
    print("Reasoning Bank is running at http://localhost:8000")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
