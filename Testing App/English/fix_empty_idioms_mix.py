"""
Vocab Alert - Idioms / Mix button fix
Problem: Category (jaise C1/Hard) ya Old pool select ho aur usme idioms na hon, to
Idioms dabane par kuch change nahi hota tha (purana word hi dikhta rahta tha).
Fix: ab card par saaf message aata hai ki kyu kuch nahi dikh raha aur kya karna hai.

Usage:
    python fix_empty_idioms_mix.py            -> index.html patch (backup banega)
    python fix_empty_idioms_mix.py my.html
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

if "function showEmptyPoolCard()" in src:
    sys.exit("Ye patch pehle se laga hua hai.")

old_empty = """  if(!pool.length){
    currentRoundWords = [];
    countEl.textContent = (quizPoolMode === "old" ? "Old" : "New") + " array is empty";
    nextBtn.textContent = "Next →";
    return;
  }"""
new_empty = """  if(!pool.length){
    currentRoundWords = [];
    countEl.textContent = (quizPoolMode === "old" ? "Old" : "New") + " array is empty";
    nextBtn.textContent = "Next →";
    showEmptyPoolCard();
    return;
  }"""

anchor = "function startRound(mode = browseMode){"

helper = """function showEmptyPoolCard(){
  // Selected Vocab/Idioms/Mix + New/Old + Category me kuch nahi mila:
  // purana word screen par chhodne ki jagah saaf message dikhao.
  const modeName = contentMode === "idioms" ? "Idioms" : contentMode === "mix" ? "Mix" : "Vocab";
  const poolName = quizPoolMode === "old" ? "Old" : "New";
  const catNames = getAllCategories().filter(c => activeCats.has(c.toLowerCase()));
  let why;
  if(activeCats.size && __rawCountPool().length){
    why = modeName + " (" + poolName + ") me \\"" + catNames.join(", ") + "\\" category ka koi item nahi hai. " +
          "Upar Cat: se \\"All categories\\" chuno, ya idiom upload karte time category box me category likho.";
  }else if(quizPoolMode === "old"){
    why = modeName + " ki Old list khali hai. Upar \\"New\\" dabao.";
  }else{
    why = modeName + " ki list abhi khali hai. Pehle kuch upload / add karo.";
  }
  currentWord = null;
  wordEnEl.textContent = "Yaha dikhane ko kuch nahi hai";
  wordHiEl.textContent = "";
  meaningEl.textContent = why;
  sentenceEl.textContent = "";
  synEl.textContent = "";
  antEl.textContent = "";
  updateLearnedButton();
}

"""

if src.count(old_empty) != 1 or src.count(anchor) != 1:
    sys.exit("Original startRound code nahi mila (file alag version ki ho sakti hai). Patch nahi laga.")

src = src.replace(old_empty, new_empty, 1)
src = src.replace(anchor, helper + anchor, 1)

backup = target.with_name(target.stem + "_backup_before_emptyfix" + target.suffix)
if not backup.exists():
    shutil.copy2(target, backup)

out = src.replace("\n", "\r\n") if crlf else src
target.write_bytes(out.encode("utf-8"))
print("Done \u2713  Idioms / Mix fix laga diya:", target)
print("Backup:", backup)
