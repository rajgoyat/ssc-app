#!/usr/bin/env python3
"""
Vocab Alert: Hindi meaning delay.
Next / Show answer dabane ke baad Hindi meaning N second baad dikhti hai,
baaki saara data (meaning, sentence, synonym, antonym) turant aata hai.
Card ke neeche-left me chhota "Hindi [2] sec" input aata hai (0 = turant).

Usage:  python add_hindi_delay.py index.html
Output: index_hindi_delay.txt  (rename to index.html)
"""
import re
import sys
from pathlib import Path

if len(sys.argv) < 2:
    sys.exit("Usage: python add_hindi_delay.py index.html")

p = Path(sys.argv[1])
s = p.read_text(encoding="utf-8")

if "hindiDelayInput" in s:
    sys.exit("[STOP] Ye fix pehle se laga hua hai.")
if "function showAnswerCard" not in s:
    sys.exit("[STOP] showAnswerCard nahi mila. Ye script is app ki file ke liye hai.")


def once(text, old, new, label, regex=False):
    n = len(re.findall(old, text)) if regex else text.count(old)
    if n != 1:
        sys.exit(f"[STOP] '{label}': anchor {n} baar mila (1 chahiye). Kuch write nahi kiya.")
    if regex:
        return re.sub(old, lambda m: new + m.group(0), text, count=1)
    return text.replace(old, new, 1)


CSS = """<style>
/* ===== HINDI DELAY ===== */
.word-hi{transition:opacity .35s ease}
.hindi-delay-box{position:absolute;left:24px;bottom:28px;z-index:4;display:inline-flex;align-items:center;gap:6px;padding:4px 8px;border:1px solid var(--line);border-radius:10px;background:rgba(10,17,27,.85);color:#8f9bad;font:700 9px "Courier New",monospace}
.hindi-delay-box input{width:40px;height:24px;padding:0 3px;border-radius:7px;border:1px solid var(--line2);background:#0a111b;color:var(--ink);text-align:center;font:700 10px "Courier New",monospace;outline:none}
.hindi-delay-box input:focus{border-color:rgba(106,214,200,.6)}
.alertbox.section-collapsed .hindi-delay-box{display:none}
@media(max-width:640px){.hindi-delay-box{left:12px;bottom:18px}}
</style>
</head>"""
s = once(s, "</head>", CSS, "css")

BOX = """<label class="hindi-delay-box" title="Next dabane ke kitne second baad Hindi meaning dikhe (0 = turant)">
      <span>Hindi</span>
      <input type="number" id="hindiDelayInput" min="0" max="60" step="0.5" value="2" inputmode="decimal" aria-label="Hindi meaning delay in seconds">
      <span>sec</span>
    </label>
    """
s = once(s, r'<button\s+class="btn main-card-next-btn"', BOX, "html box", regex=True)

JS = r'''
// ---------- Hindi meaning delay (Next / Show answer ke baad) ----------
const HINDI_DELAY_KEY = "vocabAlertHindiDelaySeconds";
const hindiDelayInput = document.getElementById("hindiDelayInput");
let __hiTimer = null;
let __delayHindiNow = false;

(function loadHindiDelay(){
  try{
    const saved = localStorage.getItem(HINDI_DELAY_KEY);
    if(saved !== null && hindiDelayInput) hindiDelayInput.value = saved;
  }catch(_e){}
})();

function getHindiDelaySeconds(){
  const n = parseFloat(hindiDelayInput && hindiDelayInput.value);
  return Number.isFinite(n) ? Math.max(0, Math.min(60, n)) : 2;
}

hindiDelayInput?.addEventListener("change", () => {
  const n = getHindiDelaySeconds();
  hindiDelayInput.value = String(n);
  try{ localStorage.setItem(HINDI_DELAY_KEY, String(n)); }catch(_e){}
});

function __setHiOpacity(value, animate){
  if(!animate){
    wordHiEl.style.transition = "none";
    wordHiEl.style.opacity = value;
    void wordHiEl.offsetWidth;
    wordHiEl.style.transition = "";
  }else{
    wordHiEl.style.opacity = value;
  }
}
function __clearHiTimer(){
  if(__hiTimer){ clearTimeout(__hiTimer); __hiTimer = null; }
}

const __showAnswerCardOrig = showAnswerCard;
showAnswerCard = function(word){
  __showAnswerCardOrig.apply(this, arguments);
  __clearHiTimer();
  const sec = getHindiDelaySeconds();
  if(__delayHindiNow && sec > 0 && word && word.hi){
    __setHiOpacity("0", false);   // Hindi chhupao, baaki sab turant dikhta hai
    __hiTimer = setTimeout(() => {
      __hiTimer = null;
      if(currentWord === word) __setHiOpacity("1", true);
    }, sec * 1000);
  }else{
    __setHiOpacity("1", false);
  }
};

const __showQuestionCardOrig = showQuestionCard;
showQuestionCard = function(){
  __showQuestionCardOrig.apply(this, arguments);
  __clearHiTimer();
  __setHiOpacity("1", false);
};

// Sirf Next / Show answer (aur timer se auto-next) par delay lagta hai.
// Search, edit, Auto Play me Hindi turant dikhti hai.
const __nextWordOrig = nextWord;
nextWord = function(){
  const prev = __delayHindiNow;
  __delayHindiNow = true;
  try{ return __nextWordOrig.apply(this, arguments); }
  finally{ __delayHindiNow = prev; }
};

// Intezar nahi karna ho to Hindi wali line par click karo.
wordHiEl.addEventListener("click", () => { __clearHiTimer(); __setHiOpacity("1", true); });

initializeEnglishApp();'''
s = once(s, "\ninitializeEnglishApp();", "\n" + JS.lstrip("\n"), "js")

out = p.with_name(p.stem + "_hindi_delay.txt")
out.write_text(s, encoding="utf-8")
print("Done ->", out)
print("Is txt ka naam badal kar index.html kar do (backup pehle le lo).")
