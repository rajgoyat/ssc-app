#!/usr/bin/env python3
"""
Vocab Alert: Learned / Move-back ka naya behaviour.
 1) Learned (check) dabane par word usi waqt current round se hat jata hai
    (agle test round me nahi aata) aur next word turant dikhta hai.
 2) Old word par back-arrow dabane par choice aati hai:
    "Only this word" ya "All words".

Pehle add_categories.py lag chuki honi chahiye.
Usage:  python fix_learned_move.py index.html
Output: index_learned_fix.txt  (rename to index.html)
"""
import sys
from pathlib import Path

if len(sys.argv) < 2:
    sys.exit("Usage: python fix_learned_move.py index.html")

p = Path(sys.argv[1])
s = p.read_text(encoding="utf-8")

if "askMoveBackChoice" in s:
    sys.exit("[STOP] Ye fix pehle se laga hua hai.")
if "matchesCategory" not in s:
    sys.exit("[STOP] Pehle add_categories.py lagao (matchesCategory nahi mila).")


def rep_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        sys.exit(f"[STOP] '{label}': anchor {n} baar mila (1 chahiye). Kuch write nahi kiya.")
    return text.replace(old, new, 1)


CSS = """<style>
/* ===== MOVE BACK CHOICE DIALOG ===== */
.move-choice-overlay{position:fixed;inset:0;z-index:2147483200;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(2,6,11,.72);backdrop-filter:blur(6px)}
.move-choice-card{width:min(420px,100%);padding:18px;border:1px solid var(--line2);border-radius:16px;background:linear-gradient(165deg,#111a27,#090f18);box-shadow:0 30px 90px rgba(0,0,0,.55)}
.move-choice-title{font:800 15px "Segoe UI",sans-serif;color:#f2f5fa;margin-bottom:6px}
.move-choice-text{font:500 12px/1.55 "Segoe UI",sans-serif;color:#9aa8bb;margin-bottom:14px}
.move-choice-actions{display:grid;gap:8px}
.move-choice-actions .small-tool-btn{min-height:42px;width:100%}
</style>
</head>"""
s = rep_once(s, "</head>", CSS, "css")

s = rep_once(s, "async function toggleCurrentWordPool(){",
             "async function __legacyToggleCurrentWordPool(){", "rename old function")

JS = r'''
// ---------- Learned / Move-back: round se turant remove ----------
let __poolMoveBusy = false;

function __sortByEn(arr){
  arr.sort((a,b) => String((a && a.en) || "").localeCompare(String((b && b.en) || ""), "en", {sensitivity:"base"}));
}

function __movePoolArrays(word){
  let from, to;
  if(WORDS.includes(word)){ from = WORDS; to = OLD_WORDS; }
  else if(OLD_WORDS.includes(word)){ from = OLD_WORDS; to = WORDS; }
  else if(IDIOM_WORDS.includes(word)){ from = IDIOM_WORDS; to = OLD_IDIOM_WORDS; }
  else if(OLD_IDIOM_WORDS.includes(word)){ from = OLD_IDIOM_WORDS; to = IDIOM_WORDS; }
  else return null;
  const index = from.indexOf(word);
  from.splice(index, 1);
  if(!to.includes(word)) to.push(word);
  __sortByEn(to);
  return {from, to, index};
}

function __undoMove(word, rec){
  const i = rec.to.indexOf(word);
  if(i >= 0) rec.to.splice(i, 1);
  rec.from.splice(Math.min(rec.index, rec.from.length), 0, word);
}

function oldWordsInScope(){
  const v = OLD_WORDS.filter(matchesCategory);
  const i = OLD_IDIOM_WORDS.filter(matchesCategory);
  if(contentMode === "idioms") return i;
  if(contentMode === "mix") return [...v, ...i];
  return v;
}

function clearCardIfPoolEmpty(){
  if(getQuizPool().length) return;
  currentWord = null;
  wordEnEl.textContent = "";
  wordHiEl.textContent = "";
  meaningEl.textContent = "";
  sentenceEl.textContent = "";
  synEl.textContent = "";
  antEl.textContent = "";
  updateLearnedButton();
}

function removeWordFromCurrentRound(word){
  const idx = currentRoundWords.indexOf(word);
  if(idx < 0) return false;

  const pos = currentPhase === PHASE.TEST ? testIndex : readIndex;
  const isCurrent = (idx === pos && currentWord === word);

  currentRoundWords.splice(idx, 1);

  // Round khatam: naya round shuru.
  if(!currentRoundWords.length){
    roundNumber += 1;
    startRound(browseMode);
    return true;
  }

  // User kisi aur word par hai (search se khola tha): bas indexes theek karo.
  if(!isCurrent){
    if(idx < pos){
      if(currentPhase === PHASE.TEST) testIndex -= 1; else readIndex -= 1;
    }
    return true;
  }

  // Normal case: agla word turant dikhao (nextWord wahi transitions sambhalta hai).
  if(currentPhase === PHASE.TEST){
    testIndex -= 1;
    answerVisible = true;
  }else{
    readIndex -= 1;
  }
  nextWord(true);
  return true;
}

function __removeFromAutoPlay(word){
  const qi = autoPlayQueue.indexOf(word);
  if(qi >= 0){
    autoPlayQueue.splice(qi, 1);
    if(qi < autoPlayQueueIndex) autoPlayQueueIndex -= 1;
  }
  if(currentWord !== word) return false;
  autoPlayRemainingSeconds = autoPlayIntervalSeconds;
  showNextAutoPlayWord();
  updateAutoPlayCountdown();
  return true;
}

function askMoveBackChoice(total){
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.className = "move-choice-overlay";
    overlay.innerHTML =
      '<div class="move-choice-card" role="dialog" aria-modal="true">' +
        '<div class="move-choice-title">Move back to New</div>' +
        '<div class="move-choice-text">Sirf ye ek word New me bhejna hai, ya Old ke saare words?</div>' +
        '<div class="move-choice-actions">' +
          '<button type="button" class="small-tool-btn accent" data-choice="one">Only this word</button>' +
          '<button type="button" class="small-tool-btn" data-choice="all">All words (' + total + ')</button>' +
          '<button type="button" class="small-tool-btn danger" data-choice="cancel">Cancel</button>' +
        '</div>' +
      '</div>';

    function done(choice){
      document.removeEventListener("keydown", onKey, true);
      overlay.remove();
      resolve(choice);
    }
    function onKey(e){
      if(e.key === "Escape"){ e.preventDefault(); done("cancel"); }
    }
    overlay.addEventListener("click", e => {
      if(e.target === overlay){ done("cancel"); return; }
      const btn = e.target.closest ? e.target.closest("[data-choice]") : null;
      if(btn) done(btn.getAttribute("data-choice"));
    });
    document.addEventListener("keydown", onKey, true);
    document.body.appendChild(overlay);
  });
}

function __refreshPoolViews(){
  updatePoolUI();
  fillTopWordSuggestions();
  renderSearchResults(searchInput?.value || "");
}

async function __moveOne(word){
  const rec = __movePoolArrays(word);
  if(!rec) return;
  __refreshPoolViews();

  const saved = await saveServerData();
  if(!saved){
    __undoMove(word, rec);
    __refreshPoolViews();
    updateLearnedButton();
    alert("Save fail hua: " + (lastServerError || "Server error"));
    return;
  }

  const advanced = autoPlayActive ? __removeFromAutoPlay(word) : removeWordFromCurrentRound(word);
  if(advanced) clearCardIfPoolEmpty();
  updateLearnedButton();
}

async function __moveManyBack(list){
  const moved = [];
  list.forEach(w => {
    const rec = __movePoolArrays(w);
    if(rec) moved.push({word:w, rec});
  });
  if(!moved.length) return;
  __refreshPoolViews();

  const saved = await saveServerData();
  if(!saved){
    for(let i = moved.length - 1; i >= 0; i--) __undoMove(moved[i].word, moved[i].rec);
    __refreshPoolViews();
    updateLearnedButton();
    alert("Save fail hua: " + (lastServerError || "Server error"));
    return;
  }

  const movedSet = new Set(moved.map(m => m.word));
  currentRoundWords = currentRoundWords.filter(w => !movedSet.has(w));

  if(quizPoolMode === "old"){
    seriesCursor = 0;
    roundNumber = 1;
    resetRandomCycle();
    if(!restartAutoPlayForCurrentSelection()) startRound(browseMode);
    clearCardIfPoolEmpty();
  }
  updateLearnedButton();
}

async function toggleCurrentWordPool(){
  if(!currentWord || __poolMoveBusy) return;
  const word = currentWord;
  const wasOld = OLD_WORDS.includes(word) || OLD_IDIOM_WORDS.includes(word);
  const managed = wasOld || WORDS.includes(word) || IDIOM_WORDS.includes(word);
  if(!managed) return;

  __poolMoveBusy = true;
  try{
    if(wasOld){
      const scope = oldWordsInScope();
      const list = scope.includes(word) ? scope : [word, ...scope];
      const choice = await askMoveBackChoice(list.length);
      if(choice === "all") await __moveManyBack(list);
      else if(choice === "one") await __moveOne(word);
    }else{
      await __moveOne(word);
    }
  }finally{
    __poolMoveBusy = false;
  }
}

initializeEnglishApp();'''
s = rep_once(s, "\ninitializeEnglishApp();", "\n" + JS.lstrip("\n"), "js")

out = p.with_name(p.stem + "_learned_fix.txt")
out.write_text(s, encoding="utf-8")
print("Done ->", out)
print("Is txt ka naam badal kar index.html kar do (backup pehle le lo).")
