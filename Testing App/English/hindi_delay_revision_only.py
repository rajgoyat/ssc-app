#!/usr/bin/env python3
"""
Hindi delay ko sirf Revision (Read) me rakhta hai. Test me Hindi turant aayegi.
Usage:  python hindi_delay_revision_only.py index.html
Output: index_revision_only.txt  (rename to index.html)
"""
import sys
from pathlib import Path

if len(sys.argv) < 2:
    sys.exit("Usage: python hindi_delay_revision_only.py index.html")

p = Path(sys.argv[1])
s = p.read_text(encoding="utf-8")

if "hindiDelayInput" not in s:
    sys.exit("[STOP] Pehle add_hindi_delay.py lagao.")
if "currentPhase === PHASE.READ && sec > 0" in s:
    sys.exit("[STOP] Ye fix pehle se laga hua hai.")


def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        sys.exit(f"[STOP] '{label}': anchor {n} baar mila (1 chahiye). Kuch write nahi kiya.")
    return text.replace(old, new, 1)


s = once(s,
         "if(__delayHindiNow && sec > 0 && word && word.hi){",
         "if(__delayHindiNow && currentPhase === PHASE.READ && sec > 0 && word && word.hi){",
         "revision-only condition")
s = once(s,
         "Next dabane ke kitne second baad Hindi meaning dikhe (0 = turant)",
         "Revision me Next dabane ke kitne second baad Hindi meaning dikhe (0 = turant). Test me turant dikhti hai",
         "tooltip")

out = p.with_name(p.stem + "_revision_only.txt")
out.write_text(s, encoding="utf-8")
print("Done ->", out)
print("Is txt ka naam badal kar index.html kar do (backup pehle le lo).")
