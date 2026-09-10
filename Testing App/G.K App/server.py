from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse, parse_qs
import json
import ast
import os
import tempfile
import base64
import binascii
import re
import threading
import uuid
from datetime import datetime

HOST = "127.0.0.1"
PORT = 8000
SERVER_VERSION = "2026-09-10-static-file-category-storage-v9"
BASE_DIR = Path(__file__).resolve().parent

USER_CURRENT_AFFAIRS_FILE = BASE_DIR / "user-current-affairs.json"
USER_CURRENT_AFFAIRS_LOCK = threading.Lock()
QUESTION_IMAGES_DIR = BASE_DIR / "current-affairs-question-images"

USER_STATIC_GK_FILE = BASE_DIR / "user-static-gk.json"
USER_STATIC_GK_LOCK = threading.Lock()
STATIC_QUESTION_IMAGES_DIR = BASE_DIR / "static-question-images"

STATIC_GK_DATA_DIR = BASE_DIR / "static-gk-data"
STATIC_GK_AGGREGATOR_FILE = BASE_DIR / "static-gk.js"
STATIC_GK_INDEX_FILE = BASE_DIR / "index.html"
STATIC_SOURCE_LOCK = threading.Lock()

DATE_IMAGES_DIR = BASE_DIR / "current-affairs-images"
DATE_IMAGES_INDEX = DATE_IMAGES_DIR / "index.json"
DATE_IMAGE_LOCK = threading.Lock()
MAX_DATE_IMAGE_BYTES = 10 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {
    "png": ".png",
    "jpeg": ".jpg",
    "jpg": ".jpg",
    "webp": ".webp",
}


def is_escaped(text, pos):
    count = 0
    i = pos - 1
    while i >= 0 and text[i] == "\\":
        count += 1
        i -= 1
    return count % 2 == 1


def atomic_write(path: Path, text: str):
    fd, temp_name = tempfile.mkstemp(
        prefix=path.stem + "_",
        suffix=".tmp",
        dir=str(path.parent),
    )
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="") as f:
            f.write(text)
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp_name, path)
    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)


def atomic_write_bytes(path: Path, data: bytes):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(
        prefix=path.stem + "_",
        suffix=".tmp",
        dir=str(path.parent),
    )
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp_name, path)
    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)


def validate_image_date(value: str):
    value = str(value or "").strip()
    try:
        parsed = datetime.strptime(value, "%Y-%m-%d")
    except ValueError as error:
        raise ValueError("Date must be in YYYY-MM-DD format.") from error
    return parsed.strftime("%Y-%m-%d")


def read_date_images_index():
    if not DATE_IMAGES_INDEX.exists():
        return {}
    try:
        data = json.loads(DATE_IMAGES_INDEX.read_text(encoding="utf-8"))
    except Exception:
        return {}
    if not isinstance(data, dict):
        return {}

    cleaned = {}
    for date, images in data.items():
        if not isinstance(images, list):
            continue
        valid = []
        for image in images:
            if not isinstance(image, dict):
                continue
            image_id = str(image.get("id", "")).strip()
            url = str(image.get("url", "")).strip()
            if image_id and url:
                valid.append({
                    "id": image_id,
                    "name": str(image.get("name", "Image")),
                    "url": url,
                    "date": str(date),
                    "questionId": str(image.get("questionId", "") or "").strip(),
                })
        if valid:
            cleaned[str(date)] = valid
    return cleaned


def write_date_images_index(index):
    DATE_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    atomic_write(
        DATE_IMAGES_INDEX,
        json.dumps(index, ensure_ascii=False, indent=2),
    )


def save_date_image(date: str, name: str, data_url: str, question_id: str = ""):
    date = validate_image_date(date)
    name = str(name or "Image").strip() or "Image"
    data_url = str(data_url or "")
    question_id = str(question_id or "").strip()
    if not question_id:
        raise ValueError("questionId is required so the image is linked to one question.")

    match = re.fullmatch(
        r"data:image/(png|jpe?g|webp);base64,(.+)",
        data_url,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not match:
        raise ValueError("Only PNG, JPG/JPEG, or WebP image data is supported.")

    image_type = match.group(1).lower()
    if image_type == "jpeg":
        image_type = "jpeg"
    elif image_type == "jpg":
        image_type = "jpg"

    try:
        raw = base64.b64decode(match.group(2), validate=True)
    except (binascii.Error, ValueError) as error:
        raise ValueError("Invalid image data.") from error

    if not raw:
        raise ValueError("Image is empty.")
    if len(raw) > MAX_DATE_IMAGE_BYTES:
        raise ValueError("Image is too large after compression (max 10 MB).")

    extension = ALLOWED_IMAGE_TYPES.get(image_type)
    if not extension:
        raise ValueError("Unsupported image type.")

    with DATE_IMAGE_LOCK:
        index = read_date_images_index()
        existing = index.get(date, [])

        safe_question_id = re.sub(r"[^A-Za-z0-9_-]", "_", question_id)
        prefix = f"img-{safe_question_id}-"
        max_number = 0
        for image in existing:
            current_id = str(image.get("id", ""))
            match_id = re.fullmatch(re.escape(prefix) + r"(\d{3})", current_id)
            if match_id:
                max_number = max(max_number, int(match_id.group(1)))

        image_id = f"{prefix}{max_number + 1:03d}"
        date_dir = DATE_IMAGES_DIR / date
        date_dir.mkdir(parents=True, exist_ok=True)
        filename = image_id + extension
        target = date_dir / filename
        atomic_write_bytes(target, raw)

        record = {
            "id": image_id,
            "name": name,
            "date": date,
            "questionId": question_id,
            "url": f"/current-affairs-images/{date}/{filename}",
        }

        index.setdefault(date, []).append(record)
        write_date_images_index(index)

    return record


def delete_date_image(date: str, image_id: str):
    date = validate_image_date(date)
    image_id = str(image_id or "").strip()
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,220}", image_id):
        raise ValueError("Invalid image id.")

    with DATE_IMAGE_LOCK:
        index = read_date_images_index()
        images = index.get(date, [])
        target_record = next(
            (image for image in images if image.get("id") == image_id),
            None,
        )
        if not target_record:
            raise FileNotFoundError("Image not found for this date.")

        url = str(target_record.get("url", ""))
        prefix = f"/current-affairs-images/{date}/"
        if not url.startswith(prefix):
            raise ValueError("Invalid stored image path.")

        filename = url[len(prefix):]
        target = DATE_IMAGES_DIR / date / filename
        if target.exists():
            target.unlink()

        remaining = [
            image for image in images
            if image.get("id") != image_id
        ]
        if remaining:
            index[date] = remaining
        else:
            index.pop(date, None)
        write_date_images_index(index)

    return True



def save_user_question_image(question_id: str, date: str, data_url: str):
    question_id = str(question_id or "").strip()
    date = validate_image_date(date)
    data_url = str(data_url or "").strip()

    if not data_url:
        return ""

    match = re.fullmatch(
        r"data:image/(png|jpe?g|webp);base64,(.+)",
        data_url,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not match:
        raise ValueError("Question image must be PNG, JPG/JPEG, or WebP.")

    image_type = match.group(1).lower()
    try:
        raw = base64.b64decode(match.group(2), validate=True)
    except (binascii.Error, ValueError) as error:
        raise ValueError("Invalid question image data.") from error

    if not raw:
        raise ValueError("Question image is empty.")
    if len(raw) > MAX_DATE_IMAGE_BYTES:
        raise ValueError("Question image is too large after compression (max 10 MB).")

    extension = ALLOWED_IMAGE_TYPES.get(image_type)
    if not extension:
        raise ValueError("Unsupported question image type.")

    safe_id = re.sub(r"[^A-Za-z0-9_-]", "_", question_id)
    date_dir = QUESTION_IMAGES_DIR / date
    date_dir.mkdir(parents=True, exist_ok=True)
    filename = safe_id + extension
    target = date_dir / filename
    atomic_write_bytes(target, raw)

    # Relative URL works both in the unified /gk/ app and when GK runs standalone.
    return f"current-affairs-question-images/{date}/{filename}"


def delete_user_question_image(item):
    image_url = str(item.get("questionImage", "") or "").strip()
    if not image_url or image_url.startswith("data:image/"):
        return

    prefix = "current-affairs-question-images/"
    normalized = image_url.lstrip("/")
    if normalized.startswith("gk/"):
        normalized = normalized[3:]
    if not normalized.startswith(prefix):
        return

    relative = normalized[len(prefix):]
    target = QUESTION_IMAGES_DIR / relative
    try:
        resolved = target.resolve()
        root = QUESTION_IMAGES_DIR.resolve()
        if root not in resolved.parents:
            return
        if resolved.exists() and resolved.is_file():
            resolved.unlink()
    except OSError:
        return


def read_user_current_affairs():
    if not USER_CURRENT_AFFAIRS_FILE.exists():
        return []
    try:
        data = json.loads(USER_CURRENT_AFFAIRS_FILE.read_text(encoding="utf-8"))
    except Exception:
        return []
    if not isinstance(data, list):
        return []
    return [item for item in data if isinstance(item, dict)]


def write_user_current_affairs(items):
    atomic_write(
        USER_CURRENT_AFFAIRS_FILE,
        json.dumps(items, ensure_ascii=False, indent=2),
    )




def read_user_static_gk():
    if not USER_STATIC_GK_FILE.exists():
        return []
    try:
        data = json.loads(USER_STATIC_GK_FILE.read_text(encoding="utf-8"))
    except Exception:
        return []
    if not isinstance(data, list):
        return []
    return [item for item in data if isinstance(item, dict)]


def write_user_static_gk(items):
    atomic_write(
        USER_STATIC_GK_FILE,
        json.dumps(items, ensure_ascii=False, indent=2),
    )


def normalize_static_topic(value):
    topic = str(value or "").strip()
    if not topic:
        raise ValueError("Static GK topic is required.")
    if len(topic) > 120:
        raise ValueError("Static GK topic is too long (max 120 characters).")
    return topic


def static_topic_slug(topic):
    topic = normalize_static_topic(topic)
    slug = re.sub(r"[^A-Za-z0-9]+", "-", topic).strip("-").lower()
    if slug:
        return slug[:60]

    # Deterministic fallback for a topic written only in non-Latin characters.
    number = sum((index + 1) * ord(ch) for index, ch in enumerate(topic)) % 1000000
    return f"topic-{number:06d}"


def save_user_static_question_image(question_id: str, topic: str, data_url: str):
    question_id = str(question_id or "").strip()
    topic = normalize_static_topic(topic)
    data_url = str(data_url or "").strip()

    if not data_url:
        return ""

    match = re.fullmatch(
        r"data:image/(png|jpe?g|webp);base64,(.+)",
        data_url,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not match:
        raise ValueError("Static question image must be PNG, JPG/JPEG, or WebP.")

    image_type = match.group(1).lower()
    try:
        raw = base64.b64decode(match.group(2), validate=True)
    except (binascii.Error, ValueError) as error:
        raise ValueError("Invalid static question image data.") from error

    if not raw:
        raise ValueError("Static question image is empty.")
    if len(raw) > MAX_DATE_IMAGE_BYTES:
        raise ValueError("Static question image is too large after compression (max 10 MB).")

    extension = ALLOWED_IMAGE_TYPES.get(image_type)
    if not extension:
        raise ValueError("Unsupported static question image type.")

    safe_id = re.sub(r"[^A-Za-z0-9_-]", "_", question_id)
    topic_slug = static_topic_slug(topic)
    topic_dir = STATIC_QUESTION_IMAGES_DIR / topic_slug
    topic_dir.mkdir(parents=True, exist_ok=True)
    filename = safe_id + extension
    target = topic_dir / filename
    atomic_write_bytes(target, raw)

    return f"static-question-images/{topic_slug}/{filename}"


def delete_user_static_question_image(item):
    image_url = str(item.get("questionImage", "") or "").strip()
    if not image_url or image_url.startswith("data:image/"):
        return

    normalized = image_url.lstrip("/")
    if normalized.startswith("gk/"):
        normalized = normalized[3:]

    prefix = "static-question-images/"
    if not normalized.startswith(prefix):
        return

    relative = normalized[len(prefix):]
    target = STATIC_QUESTION_IMAGES_DIR / relative
    try:
        resolved = target.resolve()
        root = STATIC_QUESTION_IMAGES_DIR.resolve()
        if root not in resolved.parents:
            return
        if resolved.exists() and resolved.is_file():
            resolved.unlink()
    except OSError:
        return


def normalize_sub_questions(raw_sub_questions):
    """
    A main question keeps its original ID.
    Child questions live inside:
      subQuestions: [
        {
          "question": "...",
          "options": ["A", "B", "C", "D"],
          "answer": 0,
          "explanation": ""
        }
      ]
    """
    if raw_sub_questions is None:
        return []

    if not isinstance(raw_sub_questions, list):
        raise ValueError("subQuestions must be an array.")

    if len(raw_sub_questions) > 50:
        raise ValueError("Maximum 50 sub questions are allowed under one main question.")

    cleaned = []

    for position, raw in enumerate(raw_sub_questions, start=1):
        if not isinstance(raw, dict):
            raise ValueError(f"Sub question {position} must be an object.")

        question = str(raw.get("question", "") or "").strip()
        if not question:
            raise ValueError(f"Sub question {position} cannot be empty.")

        raw_options = raw.get("options", [])
        if not isinstance(raw_options, list):
            raise ValueError(f"Sub question {position} options must be an array.")

        options = [str(value or "").strip() for value in raw_options]

        if any(not value for value in options):
            raise ValueError(f"Sub question {position} has an empty option.")

        if len(options) < 2:
            raise ValueError(f"Sub question {position} needs at least 2 options.")

        if len(options) > 8:
            raise ValueError(f"Sub question {position} can have maximum 8 options.")

        try:
            answer = int(raw.get("answer", 0))
        except (TypeError, ValueError) as error:
            raise ValueError(
                f"Sub question {position} correct answer is invalid."
            ) from error

        if answer < 0 or answer >= len(options):
            raise ValueError(
                f"Sub question {position} correct answer is outside its options."
            )

        explanation = str(raw.get("explanation", "") or "")

        cleaned.append({
            "question": question,
            "options": options,
            "answer": answer,
            "explanation": explanation,
        })

    return cleaned


def normalize_user_question_payload(payload):
    if not isinstance(payload, dict):
        raise ValueError("Question payload must be an object.")

    date = validate_image_date(payload.get("date", ""))
    question = str(payload.get("question", "") or "").strip()
    if not question:
        raise ValueError("Question / Data cannot be empty.")

    category = str(payload.get("category", "General") or "General").strip() or "General"
    explanation = str(payload.get("explanation", "") or "")

    raw_options = payload.get("options", [])
    if raw_options is None:
        raw_options = []
    if not isinstance(raw_options, list):
        raise ValueError("Options must be an array.")

    options = [str(value or "").strip() for value in raw_options]
    if any(not value for value in options):
        raise ValueError("Options cannot contain empty values.")
    if len(options) == 1:
        raise ValueError("Use no options or at least two options.")
    if len(options) > 8:
        raise ValueError("Maximum 8 options are allowed.")

    answer = None
    if options:
        raw_answer = payload.get("answer", 0)
        answer = int(0 if raw_answer is None else raw_answer)
        if answer < 0 or answer >= len(options):
            raise ValueError("Correct answer is outside the options range.")

    question_image_data_url = str(payload.get("questionImageDataUrl", "") or "").strip()
    question_image_name = str(payload.get("questionImageName", "") or "").strip()
    sub_questions = normalize_sub_questions(payload.get("subQuestions", []))

    return {
        "date": date,
        "category": category,
        "question": question,
        "options": options,
        "answer": answer,
        "explanation": explanation,
        "questionImageDataUrl": question_image_data_url,
        "questionImageName": question_image_name,
        "subQuestions": sub_questions,
    }


def next_current_affairs_question_id(date: str):
    """Create IDs like ca-2026-09-009-012 from the selected date and next sequence."""
    date = validate_image_date(date)
    year, month, day = date.split("-")
    prefix = f"ca-{year}-{month}-{int(day):03d}-"
    pattern = re.compile(rf"{re.escape(prefix)}(\d{{3,}})")
    max_number = 0

    # Scan normal month/static JS files so user-created IDs continue the same sequence.
    for path in all_js_files():
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            continue
        for match in pattern.finditer(text):
            max_number = max(max_number, int(match.group(1)))

    # Also scan questions previously created through the upload form.
    for item in read_user_current_affairs():
        current_id = str(item.get("id", ""))
        match = re.fullmatch(re.escape(prefix) + r"(\d{3,})", current_id)
        if match:
            max_number = max(max_number, int(match.group(1)))

    return f"{prefix}{max_number + 1:03d}"





def normalize_static_question_payload(payload, forced_topic=None):
    if not isinstance(payload, dict):
        raise ValueError("Static question payload must be an object.")

    topic = normalize_static_topic(
        forced_topic
        or payload.get("topic")
        or payload.get("mainCategory")
    )

    question = str(payload.get("question", "") or "").strip()
    if not question:
        raise ValueError("Question / Data cannot be empty.")

    subcategory = str(
        payload.get("subcategory", payload.get("subCategory", "")) or ""
    ).strip()

    # In array mode, "category" is accepted as an alias for subcategory.
    if not subcategory:
        candidate_category = str(payload.get("category", "") or "").strip()
        if candidate_category and candidate_category != topic:
            subcategory = candidate_category

    explanation = str(payload.get("explanation", "") or "")

    raw_options = payload.get("options", [])
    if raw_options is None:
        raw_options = []
    if not isinstance(raw_options, list):
        raise ValueError("Options must be an array.")

    options = [str(value or "").strip() for value in raw_options]
    if any(not value for value in options):
        raise ValueError("Options cannot contain empty values.")
    if len(options) == 1:
        raise ValueError("Use no options or at least two options.")
    if len(options) > 8:
        raise ValueError("Maximum 8 options are allowed.")

    answer = None
    if options:
        try:
            answer = int(payload.get("answer", 0))
        except (TypeError, ValueError) as error:
            raise ValueError("Correct answer must be an option index.") from error
        if answer < 0 or answer >= len(options):
            raise ValueError("Correct answer is outside the options range.")

    question_image_data_url = str(payload.get("questionImageDataUrl", "") or "").strip()
    question_image_name = str(payload.get("questionImageName", "") or "").strip()
    sub_questions = normalize_sub_questions(payload.get("subQuestions", []))

    return {
        "topic": topic,
        "mainCategory": topic,
        "category": subcategory or topic,
        "subcategory": subcategory,
        "question": question,
        "options": options,
        "answer": answer,
        "explanation": explanation,
        "questionImageDataUrl": question_image_data_url,
        "questionImageName": question_image_name,
        "subQuestions": sub_questions,
    }


def next_static_question_id(topic: str):
    topic = normalize_static_topic(topic)
    slug = static_topic_slug(topic)
    prefix = f"sgk-{slug}-"
    pattern = re.compile(rf"{re.escape(prefix)}(\d{{3,}})", re.IGNORECASE)
    max_number = 0

    for path in all_js_files():
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            continue
        for match in pattern.finditer(text):
            max_number = max(max_number, int(match.group(1)))

    for item in read_user_static_gk():
        current_id = str(item.get("id", ""))
        match = re.fullmatch(re.escape(prefix) + r"(\d{3,})", current_id, re.IGNORECASE)
        if match:
            max_number = max(max_number, int(match.group(1)))

    return f"{prefix}{max_number + 1:03d}"


def create_user_static_question(payload):
    clean = normalize_static_question_payload(payload)
    question_id = next_static_question_id(clean["topic"])

    image_data_url = clean.pop("questionImageDataUrl", "")
    image_name = clean.pop("questionImageName", "")
    image_url = save_user_static_question_image(
        question_id,
        clean["topic"],
        image_data_url,
    ) if image_data_url else ""

    record = {
        "id": question_id,
        **clean,
        "questionImage": image_url,
        "questionImageId": f"img-{re.sub(r'[^A-Za-z0-9_-]', '_', question_id)}-001" if image_url else "",
        "questionImageName": image_name if image_url else "",
        "source": "user-static",
        "createdAt": datetime.now().isoformat(timespec="seconds"),
    }

    with USER_STATIC_GK_LOCK:
        items = read_user_static_gk()
        items.append(record)
        write_user_static_gk(items)

    return record


def normalize_bulk_static_payload(payload):
    if not isinstance(payload, dict):
        raise ValueError("Bulk Static GK payload must be an object.")

    topic = normalize_static_topic(payload.get("topic", ""))
    raw_questions = payload.get("questions", [])

    if not isinstance(raw_questions, list):
        raise ValueError('"questions" must be an array.')
    if not raw_questions:
        raise ValueError("Question array cannot be empty.")
    if len(raw_questions) > 200:
        raise ValueError("Maximum 200 Static GK questions can be added at once.")

    cleaned = []
    for position, raw_question in enumerate(raw_questions, start=1):
        if not isinstance(raw_question, dict):
            raise ValueError(f"Static question {position} must be an object.")

        item = dict(raw_question)
        if str(item.get("questionImageDataUrl", "") or "").strip():
            raise ValueError(
                f"Static question {position}: images are not supported inside bulk array mode. "
                "Save the questions first, then add/edit the exact question if needed."
            )

        cleaned.append(normalize_static_question_payload(item, forced_topic=topic))

    return topic, cleaned


def create_user_static_questions(payload):
    topic, cleaned_questions = normalize_bulk_static_payload(payload)

    with USER_STATIC_GK_LOCK:
        items = read_user_static_gk()
        first_id = next_static_question_id(topic)
        prefix, sequence_text = first_id.rsplit("-", 1)
        start_sequence = int(sequence_text)
        records = []

        for offset, clean_source in enumerate(cleaned_questions):
            clean = dict(clean_source)
            question_id = f"{prefix}-{start_sequence + offset:03d}"
            clean.pop("questionImageDataUrl", None)
            clean.pop("questionImageName", None)

            record = {
                "id": question_id,
                **clean,
                "questionImage": "",
                "questionImageId": "",
                "questionImageName": "",
                "source": "user-static",
                "createdAt": datetime.now().isoformat(timespec="seconds"),
            }
            records.append(record)

        items.extend(records)
        write_user_static_gk(items)

    return records


def update_user_static_gk_question(question_id: str, action: str, value):
    question_id = str(question_id or "").strip()
    if not question_id:
        raise ValueError("Question id is required.")

    with USER_STATIC_GK_LOCK:
        items = read_user_static_gk()
        index = next(
            (i for i, item in enumerate(items) if str(item.get("id")) == question_id),
            None,
        )
        if index is None:
            raise FileNotFoundError(f'Question ID "{question_id}" not found.')

        item = dict(items[index])

        if action == "delete":
            delete_user_static_question_image(item)
            items.pop(index)
            write_user_static_gk(items)
            return USER_STATIC_GK_FILE.name

        if action == "question":
            text = str(value or "").strip()
            if not text:
                raise ValueError("Question cannot be empty.")
            item["question"] = text

        elif action == "explanation":
            item["explanation"] = str(value or "")

        elif action == "options":
            if not isinstance(value, list):
                raise ValueError("Options must be an array.")
            options = [str(option or "").strip() for option in value]
            if any(not option for option in options):
                raise ValueError("Options cannot contain empty values.")
            if len(options) == 1:
                raise ValueError("Use no options or at least two options.")
            if len(options) > 8:
                raise ValueError("Maximum 8 options are allowed.")
            item["options"] = options
            if not options:
                item["answer"] = None
            elif not isinstance(item.get("answer"), int) or item["answer"] >= len(options):
                item["answer"] = 0

        elif action == "answer":
            options = item.get("options") if isinstance(item.get("options"), list) else []
            if not options:
                raise ValueError("This question has no options.")
            answer = int(value)
            if answer < 0 or answer >= len(options):
                raise ValueError("Correct answer is outside the options range.")
            item["answer"] = answer

        elif action == "subQuestions":
            item["subQuestions"] = normalize_sub_questions(value)

        elif action == "add-note":
            note = str(value or "").strip()
            if not note:
                raise ValueError("Note cannot be empty.")
            notes = item.get("notes") if isinstance(item.get("notes"), list) else []
            notes.append(note)
            item["notes"] = notes

        else:
            raise ValueError(f"Unsupported action: {action}")

        items[index] = item
        write_user_static_gk(items)
        return USER_STATIC_GK_FILE.name


def normalize_bulk_current_affairs_payload(payload):
    """Validate one selected date + an array containing one or many main questions."""
    if not isinstance(payload, dict):
        raise ValueError("Bulk question payload must be an object.")

    date = validate_image_date(payload.get("date", ""))
    raw_questions = payload.get("questions", [])

    if not isinstance(raw_questions, list):
        raise ValueError('"questions" must be an array.')
    if not raw_questions:
        raise ValueError("Question array cannot be empty.")
    if len(raw_questions) > 100:
        raise ValueError("Maximum 100 main questions can be added at once.")

    cleaned = []
    for position, raw_question in enumerate(raw_questions, start=1):
        if not isinstance(raw_question, dict):
            raise ValueError(f"Main question {position} must be an object.")

        item = dict(raw_question)
        # The date selected above the array is authoritative for every item.
        item["date"] = date

        # Bulk mode intentionally does not carry base64 images. Images can be
        # attached later to the exact generated question ID from the quiz UI.
        if str(item.get("questionImageDataUrl", "") or "").strip():
            raise ValueError(
                f"Main question {position}: images are not supported inside bulk array mode. "
                "Save the questions first, then attach an image to the generated question ID."
            )

        cleaned.append(normalize_user_question_payload(item))

    return date, cleaned


def create_user_current_affairs_questions(payload):
    """Atomically create one or many main questions for one selected date."""
    date, cleaned_questions = normalize_bulk_current_affairs_payload(payload)

    with USER_CURRENT_AFFAIRS_LOCK:
        items = read_user_current_affairs()

        first_id = next_current_affairs_question_id(date)
        prefix, sequence_text = first_id.rsplit("-", 1)
        start_sequence = int(sequence_text)

        records = []

        for offset, clean_source in enumerate(cleaned_questions):
            clean = dict(clean_source)
            question_id = f"{prefix}-{start_sequence + offset:03d}"

            # Bulk mode has no image data; remove transport-only fields.
            clean.pop("questionImageDataUrl", None)
            clean.pop("questionImageName", None)

            record = {
                "id": question_id,
                **clean,
                "questionImage": "",
                "questionImageId": "",
                "questionImageName": "",
                "source": "user-upload",
                "createdAt": datetime.now().isoformat(timespec="seconds"),
            }
            records.append(record)

        items.extend(records)
        write_user_current_affairs(items)

    return records

def create_user_current_affairs_question(payload):
    clean = normalize_user_question_payload(payload)
    question_id = next_current_affairs_question_id(clean["date"])

    image_data_url = clean.pop("questionImageDataUrl", "")
    image_name = clean.pop("questionImageName", "")
    image_url = save_user_question_image(
        question_id,
        clean["date"],
        image_data_url,
    ) if image_data_url else ""

    record = {
        "id": question_id,
        **clean,
        "questionImage": image_url,
        "questionImageId": f"img-{re.sub(r'[^A-Za-z0-9_-]', '_', question_id)}-001" if image_url else "",
        "questionImageName": image_name if image_url else "",
        "source": "user-upload",
        "createdAt": datetime.now().isoformat(timespec="seconds"),
    }

    with USER_CURRENT_AFFAIRS_LOCK:
        items = read_user_current_affairs()
        items.append(record)
        write_user_current_affairs(items)

    return record


def update_user_current_affairs_question(question_id: str, action: str, value):
    question_id = str(question_id or "").strip()
    if not question_id:
        raise ValueError("Question id is required.")

    with USER_CURRENT_AFFAIRS_LOCK:
        items = read_user_current_affairs()
        index = next((i for i, item in enumerate(items) if str(item.get("id")) == question_id), None)
        if index is None:
            raise FileNotFoundError(f'Question ID "{question_id}" not found.')

        item = dict(items[index])

        if action == "delete":
            delete_user_question_image(item)
            items.pop(index)
            write_user_current_affairs(items)
            return USER_CURRENT_AFFAIRS_FILE.name

        if action == "question":
            text = str(value or "").strip()
            if not text:
                raise ValueError("Question cannot be empty.")
            item["question"] = text

        elif action == "explanation":
            item["explanation"] = str(value or "")

        elif action == "options":
            if not isinstance(value, list):
                raise ValueError("Options must be an array.")
            options = [str(option or "").strip() for option in value]
            if any(not option for option in options):
                raise ValueError("Options cannot contain empty values.")
            if len(options) == 1:
                raise ValueError("Use no options or at least two options.")
            item["options"] = options
            if not options:
                item["answer"] = None
            elif not isinstance(item.get("answer"), int) or item["answer"] >= len(options):
                item["answer"] = 0

        elif action == "answer":
            options = item.get("options") if isinstance(item.get("options"), list) else []
            if not options:
                raise ValueError("This question has no options.")
            answer = int(value)
            if answer < 0 or answer >= len(options):
                raise ValueError("Correct answer is outside the options range.")
            item["answer"] = answer

        elif action == "subQuestions":
            item["subQuestions"] = normalize_sub_questions(value)

        elif action == "add-note":
            note = str(value or "").strip()
            if not note:
                raise ValueError("Note cannot be empty.")
            notes = item.get("notes") if isinstance(item.get("notes"), list) else []
            notes.append(note)
            item["notes"] = notes

        else:
            raise ValueError(f"Unsupported action: {action}")

        items[index] = item
        write_user_current_affairs(items)
        return USER_CURRENT_AFFAIRS_FILE.name


def all_js_files():
    skip_names = {
        "server.py",
    }

    for path in BASE_DIR.rglob("*.js"):
        if path.name in skip_names:
            continue
        yield path


def find_question_file(question_id: str):
    needles = [
        f'"{question_id}"',
        f"'{question_id}'",
    ]

    matches = []

    for path in all_js_files():
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            continue

        if any(n in text for n in needles):
            score = 0
            lower = path.as_posix().lower()

            if "static-gk-data/" in lower:
                score += 100

            if any(month in path.name.lower() for month in [
                "january", "february", "march", "april",
                "may", "june", "july", "august",
                "september", "october", "november", "december"
            ]):
                score += 80

            if path.name.lower() in {
                "static-gk.js",
                "current-affairs.js",
            }:
                score -= 100

            matches.append((score, path, text))

    if not matches:
        raise FileNotFoundError(
            f'Question ID "{question_id}" not found in any .js file.'
        )

    matches.sort(
        key=lambda x: x[0],
        reverse=True
    )

    return matches[0][1], matches[0][2]


def find_object_bounds(text: str, id_position: int):
    stack = []
    quote = None
    i = 0

    while i <= id_position:
        ch = text[i]

        if quote:
            if ch == quote and not is_escaped(text, i):
                quote = None
        else:
            if ch in ("'", '"', "`"):
                quote = ch
            elif ch == "{":
                stack.append(i)
            elif ch == "}" and stack:
                stack.pop()

        i += 1

    if not stack:
        raise ValueError("Could not locate question object start.")

    start = stack[-1]

    depth = 0
    quote = None
    i = start

    while i < len(text):
        ch = text[i]

        if quote:
            if ch == quote and not is_escaped(text, i):
                quote = None
        else:
            if ch in ("'", '"', "`"):
                quote = ch
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    return start, i + 1

        i += 1

    raise ValueError("Could not locate question object end.")


def find_field_value_span(obj_text: str, field_name: str):
    i = 1
    n = len(obj_text)

    def skip_ws(pos):
        while pos < n and obj_text[pos].isspace():
            pos += 1
        return pos

    while i < n - 1:
        i = skip_ws(i)

        if i >= n - 1:
            break

        if obj_text[i] == ",":
            i += 1
            continue

        # key
        if obj_text[i] in ("'", '"'):
            q = obj_text[i]
            i += 1
            start_key = i

            while i < n:
                if obj_text[i] == q and not is_escaped(obj_text, i):
                    break
                i += 1

            key = obj_text[start_key:i]
            i += 1
        else:
            start_key = i

            while i < n and (
                obj_text[i].isalnum()
                or obj_text[i] in "_$"
            ):
                i += 1

            key = obj_text[start_key:i]

        i = skip_ws(i)

        if i >= n or obj_text[i] != ":":
            i += 1
            continue

        i += 1
        i = skip_ws(i)

        value_start = i

        curly = 0
        square = 0
        paren = 0
        quote = None

        while i < n:
            ch = obj_text[i]

            if quote:
                if ch == quote and not is_escaped(obj_text, i):
                    quote = None
            else:
                if ch in ("'", '"', "`"):
                    quote = ch
                elif ch == "{":
                    curly += 1
                elif ch == "}":
                    if (
                        curly == 0
                        and square == 0
                        and paren == 0
                    ):
                        break
                    curly -= 1
                elif ch == "[":
                    square += 1
                elif ch == "]":
                    square -= 1
                elif ch == "(":
                    paren += 1
                elif ch == ")":
                    paren -= 1
                elif (
                    ch == ","
                    and curly == 0
                    and square == 0
                    and paren == 0
                ):
                    break

            i += 1

        value_end = i

        if key == field_name:
            return value_start, value_end

        if i < n and obj_text[i] == ",":
            i += 1

    return None


def replace_or_add_field(
    obj_text: str,
    field_name: str,
    new_js_value: str
):
    span = find_field_value_span(
        obj_text,
        field_name
    )

    if span:
        start, end = span
        return (
            obj_text[:start]
            + new_js_value
            + obj_text[end:]
        )

    closing = obj_text.rfind("}")
    if closing == -1:
        raise ValueError("Malformed question object.")

    # Make sure the existing last field is separated from the new field.
    # Many question objects do not have a trailing comma before the closing }.
    before_closing = obj_text[:closing]
    last_non_space = before_closing.rstrip()[-1:]
    needs_separator = bool(last_non_space and last_non_space not in "{,")

    # Same-line objects
    if "\n" not in obj_text:
        insertion = (
            (", " if needs_separator else " ")
            + f'{field_name}: {new_js_value},'
        )
        return (
            obj_text[:closing]
            + insertion
            + obj_text[closing:]
        )

    # Multi-line objects
    id_pos = obj_text.find("id:")
    indent = "  "

    if id_pos != -1:
        line_start = (
            obj_text.rfind(
                "\n",
                0,
                id_pos
            ) + 1
        )
        candidate = obj_text[
            line_start:id_pos
        ]
        if candidate.strip() == "":
            indent = candidate

    insertion = (
        ("," if needs_separator else "")
        + f'\n{indent}{field_name}: {new_js_value},'
    )

    return (
        obj_text[:closing]
        + insertion
        + obj_text[closing:]
    )


def read_notes(obj_text: str):
    span = find_field_value_span(
        obj_text,
        "notes"
    )

    if not span:
        return []

    start, end = span
    raw = obj_text[start:end].strip()

    try:
        data = json.loads(raw)
        if isinstance(data, list):
            return data
    except Exception:
        pass

    return []


def remove_question(text, start, end):
    # remove following whitespace
    right = end
    while right < len(text) and text[right].isspace():
        right += 1

    # Prefer trailing comma
    if right < len(text) and text[right] == ",":
        right += 1
        return text[:start] + text[right:]

    # Otherwise preceding comma
    left = start - 1
    while left >= 0 and text[left].isspace():
        left -= 1

    if left >= 0 and text[left] == ",":
        return text[:left] + text[end:]

    return text[:start] + text[end:]


def update_question(
    question_id: str,
    action: str,
    value
):
    try:
        path, text = find_question_file(
            question_id
        )
    except FileNotFoundError:
        try:
            return update_user_current_affairs_question(
                question_id,
                action,
                value,
            )
        except FileNotFoundError:
            return update_user_static_gk_question(
                question_id,
                action,
                value,
            )

    id_positions = []

    for needle in [
        f'"{question_id}"',
        f"'{question_id}'",
    ]:
        pos = text.find(needle)
        if pos != -1:
            id_positions.append(pos)

    if not id_positions:
        raise FileNotFoundError(
            "Question ID not found."
        )

    id_pos = min(id_positions)

    start, end = find_object_bounds(
        text,
        id_pos
    )

    obj = text[start:end]

    if action == "answer":
        answer = int(value)

        new_obj = replace_or_add_field(
            obj,
            "answer",
            str(answer),
        )

        new_text = (
            text[:start]
            + new_obj
            + text[end:]
        )

    elif action == "question":
        question = str(
            value if value is not None else ""
        ).strip()

        if not question:
            raise ValueError(
                "Question cannot be empty."
            )

        new_obj = replace_or_add_field(
            obj,
            "question",
            json.dumps(
                question,
                ensure_ascii=False
            ),
        )

        new_text = (
            text[:start]
            + new_obj
            + text[end:]
        )

    elif action == "options":
        if not isinstance(value, list):
            raise ValueError(
                "Options must be an array."
            )

        if len(value) < 2:
            raise ValueError(
                "At least two options are required."
            )

        options = []

        for index, option in enumerate(value):
            option_text = str(
                option if option is not None else ""
            ).strip()

            if not option_text:
                raise ValueError(
                    f"Option {index + 1} cannot be empty."
                )

            options.append(option_text)

        new_obj = replace_or_add_field(
            obj,
            "options",
            json.dumps(
                options,
                ensure_ascii=False
            ),
        )

        new_text = (
            text[:start]
            + new_obj
            + text[end:]
        )

    elif action == "subQuestions":
        sub_questions = normalize_sub_questions(value)

        new_obj = replace_or_add_field(
            obj,
            "subQuestions",
            json.dumps(
                sub_questions,
                ensure_ascii=False
            ),
        )

        new_text = (
            text[:start]
            + new_obj
            + text[end:]
        )

    elif action == "explanation":
        explanation = str(
            value if value is not None else ""
        )

        new_obj = replace_or_add_field(
            obj,
            "explanation",
            json.dumps(
                explanation,
                ensure_ascii=False
            ),
        )

        new_text = (
            text[:start]
            + new_obj
            + text[end:]
        )

    elif action == "add-note":
        note = str(
            value if value is not None else ""
        ).strip()

        if not note:
            raise ValueError(
                "Note cannot be empty."
            )

        notes = read_notes(obj)
        notes.append(note)

        new_obj = replace_or_add_field(
            obj,
            "notes",
            json.dumps(
                notes,
                ensure_ascii=False
            ),
        )

        new_text = (
            text[:start]
            + new_obj
            + text[end:]
        )

    elif action == "delete":
        new_text = remove_question(
            text,
            start,
            end
        )

    else:
        raise ValueError(
            f"Unsupported action: {action}"
        )

    if new_text == text:
        raise ValueError(
            "No file change was produced."
        )

    atomic_write(
        path,
        new_text
    )

    # verify real disk write
    verified = path.read_text(
        encoding="utf-8"
    )

    if verified != new_text:
        raise OSError(
            "File verification failed."
        )

    relative = path.relative_to(
        BASE_DIR
    ).as_posix()

    print(
        f"UPDATED: {relative} | "
        f"id={question_id} | "
        f"action={action}",
        flush=True,
    )

    return relative



# ============================================================================
# STATIC GK REAL FILE STORAGE
# Existing structure:
#   static-gk-data/history.js
#   static-gk-data/geography.js
# Each source file owns one question array; static-gk.js groups those arrays.
# ============================================================================

def _static_pretty_name_from_stem(stem: str):
    stem = str(stem or "").strip()
    if not stem:
        return "Static GK"
    value = re.sub(r"[_-]+", " ", stem)
    value = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", " ", value)
    words = [word for word in value.split() if word]
    return " ".join(word[:1].upper() + word[1:] for word in words) or "Static GK"


def normalize_static_source_filename(value: str):
    value = str(value or "").strip()
    if not value:
        raise ValueError("Static GK file is required.")
    value = Path(value).name
    if value.lower().endswith(".js"):
        value = value[:-3]
    if not re.fullmatch(r"[A-Za-z][A-Za-z0-9_-]{0,79}", value):
        raise ValueError(
            "Static file name must start with a letter and use only letters, numbers, - or _."
        )
    return value + ".js"


def static_source_variable_name(file_name: str):
    file_name = normalize_static_source_filename(file_name)
    stem = Path(file_name).stem
    pieces = [piece for piece in re.split(r"[^A-Za-z0-9]+", stem) if piece]
    if not pieces:
        pieces = ["Static"]
    if len(pieces) == 1:
        raw = pieces[0]
        pascal = raw[:1].upper() + raw[1:]
    else:
        pascal = "".join(piece[:1].upper() + piece[1:] for piece in pieces)
    pascal = re.sub(r"[^A-Za-z0-9]", "", pascal) or "Static"
    if pascal[0].isdigit():
        pascal = "File" + pascal
    return f"static{pascal}Questions"


def _decode_js_string_literal(literal: str):
    literal = str(literal or "").strip()
    if not literal:
        return ""
    try:
        value = ast.literal_eval(literal)
        return str(value)
    except Exception:
        if len(literal) >= 2 and literal[0] in ("'", '"') and literal[-1] == literal[0]:
            return literal[1:-1]
        return literal


def _extract_js_string_field(obj_text: str, field_name: str):
    pattern = re.compile(
        r"(?<![A-Za-z0-9_$])[\"']?" + re.escape(field_name) +
        r"[\"']?\s*:\s*(?P<literal>\"(?:\\.|[^\"\\])*\"|'(?:\\.|[^'\\])*')",
        re.DOTALL,
    )
    match = pattern.search(obj_text)
    if not match:
        return ""
    return _decode_js_string_literal(match.group("literal"))


def _static_array_variable_from_text(text: str):
    match = re.search(
        r"\b(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*\[",
        text,
    )
    return match.group(1) if match else ""


def _find_matching_square(text: str, start: int):
    if start < 0 or start >= len(text) or text[start] != "[":
        raise ValueError("Could not locate Static GK array start.")
    depth = 0
    quote = None
    i = start
    while i < len(text):
        ch = text[i]
        if quote:
            if ch == quote and not is_escaped(text, i):
                quote = None
        else:
            if ch in ("'", '"', "`"):
                quote = ch
            elif ch == "[":
                depth += 1
            elif ch == "]":
                depth -= 1
                if depth == 0:
                    return i
        i += 1
    raise ValueError("Could not locate Static GK array end.")


def _static_question_objects_from_text(text: str):
    starts = set()
    objects = []
    id_pattern = re.compile(
        r"(?<![A-Za-z0-9_$])[\"']?id[\"']?\s*:\s*"
        r"(?:\"(?:\\.|[^\"\\])*\"|'(?:\\.|[^'\\])*')",
        re.DOTALL,
    )
    for match in id_pattern.finditer(text):
        try:
            start, end = find_object_bounds(text, match.start())
        except Exception:
            continue
        if start in starts:
            continue
        starts.add(start)
        objects.append(text[start:end])
    return objects


def _static_file_question_records(path: Path):
    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        return []
    records = []
    for obj in _static_question_objects_from_text(text):
        question_id = _extract_js_string_field(obj, "id").strip()
        category = _extract_js_string_field(obj, "category").strip()
        if question_id:
            records.append({"id": question_id, "category": category})
    return records


def _static_topic_map_from_aggregator():
    if not STATIC_GK_AGGREGATOR_FILE.exists():
        return {}
    try:
        text = STATIC_GK_AGGREGATOR_FILE.read_text(encoding="utf-8")
    except OSError:
        return {}

    mapping = {}

    object_pattern = re.compile(
        r"(?P<key>\"(?:\\.|[^\"\\])*\"|'(?:\\.|[^'\\])*'|[A-Za-z_$][A-Za-z0-9_$]*)"
        r"\s*:\s*(?P<var>static[A-Za-z0-9_$]+Questions)\b"
    )
    for match in object_pattern.finditer(text):
        raw_key = match.group("key")
        if raw_key[:1] in ("'", '"'):
            key = _decode_js_string_literal(raw_key)
        else:
            key = _static_pretty_name_from_stem(raw_key)
        mapping[match.group("var")] = key

    assignment_pattern = re.compile(
        r"staticGKCategories\s*\[\s*"
        r"(?P<key>\"(?:\\.|[^\"\\])*\"|'(?:\\.|[^'\\])*')"
        r"\s*\]\s*=\s*(?P<var>static[A-Za-z0-9_$]+Questions)\b"
    )
    for match in assignment_pattern.finditer(text):
        mapping[match.group("var")] = _decode_js_string_literal(match.group("key"))

    return mapping


def list_static_source_files():
    STATIC_GK_DATA_DIR.mkdir(parents=True, exist_ok=True)
    topic_map = _static_topic_map_from_aggregator()
    result = []

    for path in sorted(STATIC_GK_DATA_DIR.glob("*.js"), key=lambda item: item.name.casefold()):
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue

        variable = _static_array_variable_from_text(text)
        if not variable:
            continue

        records = _static_file_question_records(path)
        topic = topic_map.get(variable) or _static_pretty_name_from_stem(path.stem)

        categories = []
        seen = set()
        for record in records:
            category = str(record.get("category", "") or "").strip()
            key = category.casefold()
            if category and key not in seen:
                seen.add(key)
                categories.append(category)
        categories.sort(key=str.casefold)

        result.append({
            "fileName": path.name,
            "variable": variable,
            "topic": topic,
            "categories": categories,
            "questionCount": len(records),
        })
    return result


def _get_static_source_info(file_name: str):
    file_name = normalize_static_source_filename(file_name)
    path = STATIC_GK_DATA_DIR / file_name
    if not path.exists() or not path.is_file():
        raise FileNotFoundError(f'Static GK source file "{file_name}" was not found.')

    text = path.read_text(encoding="utf-8")
    variable = _static_array_variable_from_text(text)
    if not variable:
        raise ValueError(
            f'{file_name} does not contain a recognizable "const/let/var name = [ ... ]" question array.'
        )

    topic_map = _static_topic_map_from_aggregator()
    topic = topic_map.get(variable) or _static_pretty_name_from_stem(path.stem)

    return {
        "fileName": file_name,
        "path": path,
        "text": text,
        "variable": variable,
        "topic": topic,
    }


def _normalize_static_category(value):
    category = str(value or "").strip()
    if not category:
        raise ValueError("Static GK category is required.")
    if len(category) > 140:
        raise ValueError("Static GK category is too long (max 140 characters).")
    return category


def _default_static_id_prefix(category: str):
    category = _normalize_static_category(category)
    slug = re.sub(r"[^A-Za-z0-9]+", "-", category).strip("-").lower()
    if not slug:
        number = sum((index + 1) * ord(ch) for index, ch in enumerate(category)) % 1000000
        slug = f"category-{number:06d}"
    return f"static-{slug[:60]}-"


def _static_id_prefix_and_next(path: Path, category: str):
    category = _normalize_static_category(category)
    records = _static_file_question_records(path) if path.exists() else []
    prefixes = {}

    for record in records:
        if str(record.get("category", "")).strip().casefold() != category.casefold():
            continue
        question_id = str(record.get("id", "") or "").strip()
        match = re.match(r"^(.*?)(\d{3,})$", question_id)
        if not match:
            continue
        prefix = match.group(1)
        number = int(match.group(2))
        entry = prefixes.setdefault(prefix, {"count": 0, "max": 0})
        entry["count"] += 1
        entry["max"] = max(entry["max"], number)

    if prefixes:
        prefix, info = sorted(
            prefixes.items(),
            key=lambda item: (item[1]["count"], item[1]["max"]),
            reverse=True,
        )[0]
    else:
        prefix = _default_static_id_prefix(category)
        info = {"max": 0}

    max_number = int(info.get("max", 0))
    pattern = re.compile(re.escape(prefix) + r"(\d{3,})", re.IGNORECASE)

    for js_path in all_js_files():
        try:
            js_text = js_path.read_text(encoding="utf-8")
        except OSError:
            continue
        for match in pattern.finditer(js_text):
            max_number = max(max_number, int(match.group(1)))

    return prefix, max_number + 1


def _normalize_static_file_question(raw, category: str):
    if not isinstance(raw, dict):
        raise ValueError("Each Static GK question must be an object.")

    category = _normalize_static_category(category)
    question = str(raw.get("question", "") or "").strip()
    if not question:
        raise ValueError("Question / Data cannot be empty.")

    raw_options = raw.get("options", [])
    if raw_options is None:
        raw_options = []
    if not isinstance(raw_options, list):
        raise ValueError("Options must be an array.")

    options = [str(value or "").strip() for value in raw_options]
    if any(not value for value in options):
        raise ValueError("Options cannot contain empty values.")
    if len(options) == 1:
        raise ValueError("Use no options or at least two options.")
    if len(options) > 8:
        raise ValueError("Maximum 8 options are allowed.")

    answer = None
    if options:
        try:
            answer = int(raw.get("answer", 0))
        except (TypeError, ValueError) as error:
            raise ValueError("Correct answer must be an option index.") from error
        if answer < 0 or answer >= len(options):
            raise ValueError("Correct answer is outside the options range.")

    return {
        "category": category,
        "question": question,
        "options": options,
        "answer": answer,
        "explanation": str(raw.get("explanation", "") or ""),
        "subQuestions": normalize_sub_questions(raw.get("subQuestions", [])),
        "questionImageDataUrl": str(raw.get("questionImageDataUrl", "") or "").strip(),
        "questionImageName": str(raw.get("questionImageName", "") or "").strip(),
    }


def _stored_static_js_record(record):
    stored = {
        "id": record["id"],
        "category": record["category"],
        "question": record["question"],
        "options": record.get("options", []),
        "answer": record.get("answer"),
        "explanation": record.get("explanation", ""),
    }
    if record.get("subQuestions"):
        stored["subQuestions"] = record["subQuestions"]
    if record.get("questionImage"):
        stored["questionImage"] = record["questionImage"]
        if record.get("questionImageId"):
            stored["questionImageId"] = record["questionImageId"]
        if record.get("questionImageName"):
            stored["questionImageName"] = record["questionImageName"]
    return stored


def _format_static_js_object(record):
    return json.dumps(
        _stored_static_js_record(record),
        ensure_ascii=False,
        separators=(", ", ": "),
    )


def _append_static_records_to_file(path: Path, variable: str, records):
    text = path.read_text(encoding="utf-8")
    declaration = re.search(
        rf"\b(?:const|let|var)\s+{re.escape(variable)}\s*=\s*\[",
        text,
    )
    if not declaration:
        raise ValueError(f'Could not find question array "{variable}" in {path.name}.')

    array_start = text.find("[", declaration.start())
    array_end = _find_matching_square(text, array_start)
    body = text[array_start + 1:array_end]

    formatted = ",\n".join(
        "  " + _format_static_js_object(record)
        for record in records
    )

    if body.strip():
        separator = "\n" if body.rstrip().endswith(",") else ",\n"
        insertion = separator + formatted + "\n"
    else:
        insertion = "\n" + formatted + "\n"

    new_text = text[:array_end] + insertion + text[array_end:]
    atomic_write(path, new_text)


def _ensure_new_static_file_loaded(file_name: str, variable: str, topic_label: str):
    file_name = normalize_static_source_filename(file_name)
    topic_label = normalize_static_topic(topic_label)

    if STATIC_GK_INDEX_FILE.exists():
        index_text = STATIC_GK_INDEX_FILE.read_text(encoding="utf-8")
        script_tag = f'<script src="static-gk-data/{file_name}"></script>'

        if script_tag not in index_text:
            marker_match = re.search(
                r'(?P<indent>[ \t]*)<script\s+src=["\']static-gk\.js["\']\s*></script>',
                index_text,
                flags=re.IGNORECASE,
            )
            if not marker_match:
                raise ValueError(
                    "Could not register the new Static GK file because static-gk.js script tag was not found in index.html."
                )

            indent = marker_match.group("indent")
            insertion = indent + script_tag + "\n"
            index_text = (
                index_text[:marker_match.start()]
                + insertion
                + index_text[marker_match.start():]
            )
            atomic_write(STATIC_GK_INDEX_FILE, index_text)

    if not STATIC_GK_AGGREGATOR_FILE.exists():
        raise FileNotFoundError(
            "static-gk.js was not found. It is required to register a newly created Static GK file."
        )

    aggregator = STATIC_GK_AGGREGATOR_FILE.read_text(encoding="utf-8")
    safe_marker = re.sub(r"[^A-Za-z0-9_.-]", "_", file_name)
    start_marker = f"/* AUTO STATIC SOURCE START: {safe_marker} */"
    end_marker = f"/* AUTO STATIC SOURCE END: {safe_marker} */"

    block = f'''

{start_marker}
if (typeof {variable} !== "undefined") {{
  if (typeof staticGKQuestions !== "undefined" && Array.isArray(staticGKQuestions)) {{
    {variable}.forEach((item) => {{
      if (!staticGKQuestions.some((question) => question && question.id === item.id)) {{
        staticGKQuestions.push(item);
      }}
    }});
  }}

  if (
    typeof staticGKCategories !== "undefined" &&
    staticGKCategories &&
    typeof staticGKCategories === "object"
  ) {{
    staticGKCategories[{json.dumps(topic_label, ensure_ascii=False)}] = {variable};
  }}
}}
{end_marker}
'''

    marker_pattern = re.compile(
        re.escape(start_marker) + r".*?" + re.escape(end_marker),
        re.DOTALL,
    )

    if marker_pattern.search(aggregator):
        aggregator = marker_pattern.sub(block.strip(), aggregator)
    else:
        aggregator = aggregator.rstrip() + block + "\n"

    atomic_write(STATIC_GK_AGGREGATOR_FILE, aggregator)


def _create_static_source_file(file_name: str, topic_label: str):
    file_name = normalize_static_source_filename(file_name)
    topic_label = normalize_static_topic(topic_label)

    STATIC_GK_DATA_DIR.mkdir(parents=True, exist_ok=True)
    path = STATIC_GK_DATA_DIR / file_name
    if path.exists():
        raise ValueError(f'Static GK source file "{file_name}" already exists.')

    variable = static_source_variable_name(file_name)
    content = f"const {variable} = [\n];\n"
    atomic_write(path, content)

    try:
        _ensure_new_static_file_loaded(file_name, variable, topic_label)
    except Exception:
        if path.exists():
            path.unlink()
        raise

    return {
        "fileName": file_name,
        "path": path,
        "variable": variable,
        "topic": topic_label,
        "text": content,
    }


def _resolve_static_target(payload):
    if not isinstance(payload, dict):
        raise ValueError("Static GK question payload must be an object.")

    create_file = bool(payload.get("createFile"))
    file_name = normalize_static_source_filename(payload.get("fileName", ""))

    if create_file:
        topic_label = str(payload.get("topicLabel", "") or "").strip()
        if not topic_label:
            topic_label = _static_pretty_name_from_stem(Path(file_name).stem)
        source = _create_static_source_file(file_name, topic_label)
    else:
        source = _get_static_source_info(file_name)

    category = _normalize_static_category(payload.get("category", ""))
    return source, category


def _create_static_records_in_source(source, category: str, raw_questions):
    if not isinstance(raw_questions, list) or not raw_questions:
        raise ValueError("Static GK question array cannot be empty.")
    if len(raw_questions) > 200:
        raise ValueError("Maximum 200 Static GK questions can be added at once.")

    path = source["path"]
    variable = source["variable"]
    topic = source["topic"]

    prefix, next_number = _static_id_prefix_and_next(path, category)
    records = []

    for offset, raw in enumerate(raw_questions):
        clean = _normalize_static_file_question(raw, category)
        question_id = f"{prefix}{next_number + offset:03d}"

        image_data_url = clean.pop("questionImageDataUrl", "")
        image_name = clean.pop("questionImageName", "")
        image_url = (
            save_user_static_question_image(question_id, topic, image_data_url)
            if image_data_url
            else ""
        )

        record = {
            "id": question_id,
            "category": clean["category"],
            "question": clean["question"],
            "options": clean["options"],
            "answer": clean["answer"],
            "explanation": clean["explanation"],
            "subQuestions": clean["subQuestions"],
            "questionImage": image_url,
            "questionImageId": (
                f"img-{re.sub(r'[^A-Za-z0-9_-]', '_', question_id)}-001"
                if image_url
                else ""
            ),
            "questionImageName": image_name if image_url else "",
            "topic": topic,
            "mainCategory": topic,
            "sourceFile": source["fileName"],
            "source": "static-gk-data",
        }
        records.append(record)

    _append_static_records_to_file(path, variable, records)
    return records


def create_user_static_question(payload):
    if not isinstance(payload, dict):
        raise ValueError("Static GK question payload must be an object.")

    category = _normalize_static_category(payload.get("category", ""))
    # Validate before creating/registering a brand-new source file.
    _normalize_static_file_question(payload, category)

    with STATIC_SOURCE_LOCK:
        source, category = _resolve_static_target(payload)
        return _create_static_records_in_source(source, category, [payload])[0]


def create_user_static_questions(payload):
    if not isinstance(payload, dict):
        raise ValueError("Bulk Static GK payload must be an object.")

    raw_questions = payload.get("questions", [])
    if not isinstance(raw_questions, list):
        raise ValueError('"questions" must be an array.')
    if not raw_questions:
        raise ValueError("Static GK question array cannot be empty.")
    if len(raw_questions) > 200:
        raise ValueError("Maximum 200 Static GK questions can be added at once.")

    category = _normalize_static_category(payload.get("category", ""))
    # Validate the whole array before creating/registering a new source file.
    for position, raw in enumerate(raw_questions, start=1):
        try:
            _normalize_static_file_question(raw, category)
        except ValueError as error:
            raise ValueError(f"Static question {position}: {error}") from error

    with STATIC_SOURCE_LOCK:
        source, category = _resolve_static_target(payload)
        return _create_static_records_in_source(source, category, raw_questions)


class QuizHandler(
    SimpleHTTPRequestHandler
):
    def __init__(
        self,
        *args,
        **kwargs
    ):
        super().__init__(
            *args,
            directory=str(BASE_DIR),
            **kwargs,
        )

    def send_json(
        self,
        data,
        status=200
    ):
        body = json.dumps(
            data,
            ensure_ascii=False,
            indent=2,
        ).encode("utf-8")

        self.send_response(status)

        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8",
        )

        self.send_header(
            "Content-Length",
            str(len(body)),
        )

        self.send_header(
            "Cache-Control",
            "no-store",
        )

        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        if path == "/api/health":
            self.send_json({
                "ok": True,
                "serverVersion": SERVER_VERSION,
                "questionUpdateEndpoint": True,
                "dateImageEndpoint": True,
                "questionBulkCreateEndpoint": True,
                "staticQuestionCreateEndpoint": True,
                "staticQuestionBulkCreateEndpoint": True,
                "baseDir": str(BASE_DIR),
            })
            return

        if path == "/api/current-user-questions":
            with USER_CURRENT_AFFAIRS_LOCK:
                questions = read_user_current_affairs()
            self.send_json({
                "ok": True,
                "questions": questions,
            })
            return

        if path == "/api/user-static-questions":
            with USER_STATIC_GK_LOCK:
                questions = read_user_static_gk()
            self.send_json({
                "ok": True,
                "questions": questions,
            })
            return

        if path == "/api/static-source-files":
            self.send_json({
                "ok": True,
                "files": list_static_source_files(),
            })
            return

        if path == "/api/date-images":
            query = parse_qs(parsed_url.query)
            requested_date = str(query.get("date", [""])[0]).strip()
            with DATE_IMAGE_LOCK:
                index = read_date_images_index()

            if requested_date:
                requested_date = validate_image_date(requested_date)
                self.send_json({
                    "ok": True,
                    "date": requested_date,
                    "images": index.get(requested_date, []),
                })
            else:
                self.send_json({
                    "ok": True,
                    "dates": index,
                })
            return

        # Compatibility for current frontend init
        if path == "/api/changes":
            self.send_json({
                "version": 1,
                "deletedIds": [],
                "visibility": {},
                "addedExplanations": {},
                "originalExplanations": {},
                "correctedAnswers": {},
            })
            return

        if path == "/":
            self.path = "/index.html"

        return super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path

        print(
            f"POST ROUTE: {path}",
            flush=True,
        )

        allowed_paths = {
            "/api/question-update",
            "/api/date-image-save",
            "/api/date-image-delete",
            "/api/current-question-create",
            "/api/current-question-create-bulk",
            "/api/static-question-create",
            "/api/static-question-create-bulk",
        }
        if path not in allowed_paths:
            self.send_json(
                {
                    "ok": False,
                    "error": (
                        "Unknown POST endpoint: "
                        + path
                    ),
                },
                status=404,
            )
            return

        try:
            length = int(
                self.headers.get(
                    "Content-Length",
                    "0"
                )
            )

            if length <= 0:
                raise ValueError(
                    "Empty request body."
                )

            raw = self.rfile.read(
                length
            )

            data = json.loads(
                raw.decode("utf-8")
            )

            if path == "/api/current-question-create":
                record = create_user_current_affairs_question(data)
                self.send_json({
                    "ok": True,
                    "question": record,
                    "file": USER_CURRENT_AFFAIRS_FILE.name,
                })
                return

            if path == "/api/current-question-create-bulk":
                records = create_user_current_affairs_questions(data)
                self.send_json({
                    "ok": True,
                    "questions": records,
                    "count": len(records),
                    "file": USER_CURRENT_AFFAIRS_FILE.name,
                })
                return

            if path == "/api/static-question-create":
                record = create_user_static_question(data)
                self.send_json({
                    "ok": True,
                    "question": record,
                    "file": record.get("sourceFile", ""),
                })
                return

            if path == "/api/static-question-create-bulk":
                records = create_user_static_questions(data)
                self.send_json({
                    "ok": True,
                    "questions": records,
                    "count": len(records),
                    "file": records[0].get("sourceFile", "") if records else "",
                })
                return

            if path == "/api/date-image-save":
                record = save_date_image(
                    data.get("date", ""),
                    data.get("name", "Image"),
                    data.get("dataUrl", ""),
                    data.get("questionId", ""),
                )
                self.send_json({
                    "ok": True,
                    "image": record,
                })
                return

            if path == "/api/date-image-delete":
                date = data.get("date", "")
                image_id = data.get("id", "")
                delete_date_image(date, image_id)
                self.send_json({
                    "ok": True,
                    "date": validate_image_date(date),
                    "id": str(image_id),
                })
                return

            question_id = str(
                data.get("id", "")
            ).strip()

            action = str(
                data.get("action", "")
            ).strip()

            value = data.get(
                "value"
            )

            if not question_id:
                raise ValueError(
                    "Question id is required."
                )

            print(
                f"REQUEST: id={question_id} "
                f"action={action}",
                flush=True,
            )

            file_name = update_question(
                question_id,
                action,
                value,
            )

            self.send_json({
                "ok": True,
                "file": file_name,
                "id": question_id,
                "action": action,
            })

        except FileNotFoundError as error:
            self.send_json(
                {
                    "ok": False,
                    "error": str(error),
                },
                status=404,
            )

        except (
            ValueError,
            json.JSONDecodeError
        ) as error:
            self.send_json(
                {
                    "ok": False,
                    "error": str(error),
                },
                status=400,
            )

        except Exception as error:
            print(
                "SERVER ERROR:",
                repr(error),
                flush=True,
            )

            self.send_json(
                {
                    "ok": False,
                    "error": str(error),
                },
                status=500,
            )


if __name__ == "__main__":
    server = ThreadingHTTPServer(
        (HOST, PORT),
        QuizHandler,
    )

    print("=" * 66)
    print("GK QUIZ SERVER")
    print(f"Version: {SERVER_VERSION}")
    print(f"Folder: {BASE_DIR}")
    print(f"Open: http://{HOST}:{PORT}")
    print("GET  /api/health              ENABLED")
    print("GET  /api/current-user-questions ENABLED")
    print("GET  /api/user-static-questions ENABLED")
    print("GET  /api/static-source-files ENABLED")
    print("GET  /api/date-images         ENABLED")
    print("POST /api/current-question-create ENABLED")
    print("POST /api/current-question-create-bulk ENABLED")
    print("POST /api/static-question-create ENABLED")
    print("POST /api/static-question-create-bulk ENABLED")
    print("POST /api/date-image-save     ENABLED")
    print("POST /api/date-image-delete   ENABLED")
    print("POST /api/question-update     ENABLED")
    print(
        "Question edits will be written "
        "directly into original .js files."
    )
    print("=" * 66)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        server.server_close()
