#!/usr/bin/env python3
"""
Vocab Alert: "words per round" box ko live banana.
 1) Word Old me move ho (Learned) to box ki value 1 se kam ho jati hai.
 2) Box ki value manually badhao to usi chalte round (revision ya test) me
    aur words judh jate hain.

Pehle fix_learned_move.py lag chuki honi chahiye.
Usage:  python fix_round_size.py index.html
Output: index_round_size.txt  (rename to index.html)
"""
import sys
from pathlib import Path

if len(sys.argv) < 2:
    sys.exit("Usage: python fix_round_size.py index.html")

p = Path(sys.argv[1])
s = p.read_text(encoding="utf-8")

if "topUpCurrentRound" in s:
    sys.exit("[STOP] Ye fix pehle se laga hua hai.")
if "removeWordFromCurrentRound" not in s:
    sys.exit("[STOP] Pehle fix_learned_move.py lagao (removeWordFromCurrentRound nahi mila).")


def rep_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        sys.exit(f"[STOP] '{label}': anchor {n} baar mila (1 chahiye). Kuch write nahi kiya.")
    return text.replace(old, new, 1)


# 1. word remove hote hi box -1
s = rep_once(
    s,
    "currentRoundWords.splice(idx, 1);",
    "currentRoundWords.splice(idx, 1);\n  __bumpRoundSizeInput(-1);",
    "decrease on remove",
)

# 2. helpers + manual increase listener
JS = r'''
// ---------- Words-per-round box: live decrease / manual increase ----------
function __bumpRoundSizeInput(delta){
  const el = document.getElementById("wordsPerRoundInput");
  if(!el) return;
  el.value = Math.max(1, Math.min(100, getRoundSize() + delta));
  syncWordsPerRoundLabel();
}

function __refreshRoundStatus(){
  if(autoPlayActive) return;
  if(currentPhase === PHASE.TEST){
    countEl.textContent = testStatusText(
      answerVisible ? Math.min(testIndex + 1, currentRoundWords.length) : testIndex
    );
  }else{
    countEl.textContent =
      (quizPoolMode === "old" ? "Old" : "New") + " • " +
      (browseMode === "series" ? "Series" : "Random") +
      " • Round " + roundNumber +
      " • Read " + Math.min(readIndex + 1, currentRoundWords.length) +
      "/" + currentRoundWords.length;
  }
}

function topUpCurrentRound(){
  if(autoPlayActive) return;
  if(!currentRoundWords.length) return;

  const need = getRoundSize() - currentRoundWords.length;
  if(need <= 0) return;   // kam karne par naya size agle round se lagta hai

  const pool = getQuizPool();
  if(!pool.length) return;
  const inRound = new Set(currentRoundWords);
  let picks = [];

  if(browseMode === "series"){
    // Series: round ke baad wale agle words.
    const start = (seriesCursor + currentRoundWords.length) % pool.length;
    for(let k = 0; k < pool.length && picks.length < need; k++){
      const w = pool[(start + k) % pool.length];
      if(!inRound.has(w) && !picks.includes(w)) picks.push(w);
    }
  }else{
    // Random: pehle wo words jo is cycle me abhi nahi aaye.
    const roundKeys = new Set(currentRoundWords.map(randomWordKey));
    const seen = new Set();
    const candidates = [];
    pool.forEach(w => {
      const k = randomWordKey(w);
      if(roundKeys.has(k) || seen.has(k)) return;
      seen.add(k);
      candidates.push(w);
    });
    const fresh = candidates.filter(w => !randomSeenKeys.has(randomWordKey(w)));
    picks = shuffleWords(fresh).slice(0, need);
    if(picks.length < need){
      const pickedKeys = new Set(picks.map(randomWordKey));
      const rest = candidates.filter(w => !pickedKeys.has(randomWordKey(w)));
      picks = picks.concat(shuffleWords(rest).slice(0, need - picks.length));
    }
    picks.forEach(w => randomSeenKeys.add(randomWordKey(w)));
  }

  if(!picks.length) return;
  currentRoundWords.push(...picks);
  __refreshRoundStatus();
}

document.getElementById("wordsPerRoundInput")?.addEventListener("change", () => {
  syncWordsPerRoundLabel();
  topUpCurrentRound();
});

initializeEnglishApp();'''
s = rep_once(s, "\ninitializeEnglishApp();", "\n" + JS.lstrip("\n"), "js")

out = p.with_name(p.stem + "_round_size.txt")
out.write_text(s, encoding="utf-8")
print("Done ->", out)
print("Is txt ka naam badal kar index.html kar do (backup pehle le lo).")
