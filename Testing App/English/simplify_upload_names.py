"""
Vocab Alert - Upload buttons ke naam asaan karne ka patch
(Ye 'fix_upload_both_categories.py' ke baad lagta hai.)
Usage:
    python simplify_upload_names.py            -> index.html patch (backup banega)
    python simplify_upload_names.py my.html
"""
import shutil
import sys
from pathlib import Path

target = Path(sys.argv[1] if len(sys.argv) > 1 else "index.html")
if not target.exists():
    sys.exit(f"File nahi mili: {target}")

raw = target.read_bytes().decode("utf-8")
crlf = "\r\n" in raw
src = raw.replace("\r\n", "\n")

if "Update word too" in src:
    sys.exit("Ye patch pehle se laga hua hai.")

edits = [
    # Button 1 (replace mode)
    ("(__newCats.length ? 'Replace old + add category' : 'Replace old with new')",
     "(__newCats.length ? 'Update word too' : 'Update old word')"),
    # Button 2 (skip mode)
    ("(__newCats.length ? 'Keep old + add category' : 'Skip duplicates')",
     "(__newCats.length ? 'Add to category' : 'Skip')"),
    # Ek line ka help text, buttons ke upar wale message me
    ("""            : '') +
        '</div>' +""",
     """            : '') +
          '<br><span style="color:var(--muted)">' + (__newCats.length
            ? 'Add to category = word waisa hi rahega, bas category judegi. Update word too = meaning / sentence bhi naye se badal jayega.'
            : 'Update old word = purane word ko naye se badlo. Skip = kuch mat karo.') + '</span>' +
        '</div>' +"""),
]

for old, new in edits:
    if src.count(old) != 1:
        sys.exit("Original code nahi mila - pehle fix_upload_both_categories.py lagao.\n" + old[:100])
    src = src.replace(old, new, 1)

backup = target.with_name(target.stem + "_backup_before_names" + target.suffix)
if not backup.exists():
    shutil.copy2(target, backup)

out = src.replace("\n", "\r\n") if crlf else src
target.write_bytes(out.encode("utf-8"))
print("Done \u2713  Buttons ke naam asaan ho gaye:", target)
print("Backup:", backup)
