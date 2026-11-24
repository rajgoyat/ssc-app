# Usage: put this file next to server.py (the main Study App Hub server.py), then run:
#   python patch_server.py
# It makes server.py.bak first, then adds POST /api/english/deleted
# which appends every deleted word/idiom/missing/question into English/deleted_items.json
from pathlib import Path
import shutil, sys

p = Path(__file__).resolve().parent / "server.py"
src = p.read_text(encoding="utf-8")  # universal newlines -> \n
if "ENGLISH_DELETED_FILE" in src:
    print("Already patched."); sys.exit(0)
shutil.copy2(p, p.with_name("server.py.bak"))

def rep(old, new):
    global src
    if src.count(old) != 1:
        sys.exit("Anchor not found exactly once: " + old[:60])
    src = src.replace(old, new, 1)

rep('ENGLISH_ERROR_SENTENCES_FILE = ENGLISH_DIR / "error_sentences.json"\n',
    'ENGLISH_ERROR_SENTENCES_FILE = ENGLISH_DIR / "error_sentences.json"\n'
    '# Every deleted word / idiom / missing word / question is appended here.\n'
    'ENGLISH_DELETED_FILE = ENGLISH_DIR / "deleted_items.json"\n')

func = '''import threading

_ENGLISH_DELETED_LOCK = threading.Lock()


def append_english_deleted(payload):
    """Append deleted English items to English/deleted_items.json (one file)."""
    items = payload.get("items") if isinstance(payload, dict) else None
    if not isinstance(items, list):
        raise ValueError('Deleted-items payload "items" must be an array')
    clean = [
        item for item in items
        if isinstance(item, dict) and item.get("kind") and "item" in item
    ]

    ENGLISH_DIR.mkdir(parents=True, exist_ok=True)
    with _ENGLISH_DELETED_LOCK:
        document = {"deletedItems": []}
        if ENGLISH_DELETED_FILE.exists():
            loaded = json.loads(ENGLISH_DELETED_FILE.read_text(encoding="utf-8"))
            if isinstance(loaded, dict) and isinstance(loaded.get("deletedItems"), list):
                document = loaded
        document["deletedItems"].extend(clean)

        temp = ENGLISH_DELETED_FILE.with_suffix(ENGLISH_DELETED_FILE.suffix + ".tmp")
        try:
            temp.write_text(
                json.dumps(document, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
            temp.replace(ENGLISH_DELETED_FILE)
        finally:
            if temp.exists():
                temp.unlink()
    return len(clean), len(document["deletedItems"])


def load_english_data():'''
rep('def load_english_data():', func)

rep('''            if path == "/api/english/data" and subject == "english":
                saved = persist_english_data(payload)''',
'''            if path == "/api/english/deleted" and subject == "english":
                added, total = append_english_deleted(payload)
                self.send_json(HTTPStatus.OK, {
                    "ok": True,
                    "added": added,
                    "total": total,
                    "file": ENGLISH_DELETED_FILE.name,
                })
                return
            if path == "/api/english/data" and subject == "english":
                saved = persist_english_data(payload)''')

p.write_text(src, encoding="utf-8")
print("Done. Backup: server.py.bak  |  New file will be: English/deleted_items.json")
print("Restart the server: python server.py")
