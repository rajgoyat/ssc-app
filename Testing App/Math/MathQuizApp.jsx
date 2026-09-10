const { useState, useEffect, useRef } = React;
function Icon({ symbol, size = 16 }) {
  return React.createElement("span", { style: { display: "inline-block", width: size, textAlign: "center", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, lineHeight: 1 } }, symbol);
}
const iconSymbols = {
  Play: "▶", CheckCircle2: "✓", XCircle: "✕", EyeOff: "◌", Eye: "◉", ListChecks: "☷", Plus: "＋", X: "×",
  Pencil: "✎", Copy: "⧉", Trash2: "⌫", Upload: "↥", ChevronLeft: "‹", ChevronRight: "›", Shuffle: "⤨",
  ListOrdered: "☷", RotateCcw: "↶",
};
const icons = Object.fromEntries(Object.entries(iconSymbols).map(([name, symbol]) => [name, (props) => <Icon {...props} symbol={symbol} />]));
const {
  Play, CheckCircle2, XCircle, EyeOff, Eye, ListChecks, Plus, X, Pencil,
  Copy, Trash2, Upload, ChevronLeft, ChevronRight, Shuffle, ListOrdered, RotateCcw
} = icons;

/* ---------------------------------- helpers ---------------------------------- */

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const SUPERSCRIPTS = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
const SUBSCRIPTS = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" };

function formatMathText(value) {
  return String(value || "")
    .replace(/root-\s*(\d+(?:\.\d+)?)/gi, (_, number) => "√" + number)
    .replace(/\b(\d+)\s*&\s*(\d+)\s*\/\s*(\d+)\b/g, (_, whole, numerator, denominator) =>
      whole +
      [...numerator].map((digit) => SUPERSCRIPTS[digit]).join("") +
      "⁄" +
      [...denominator].map((digit) => SUBSCRIPTS[digit]).join("")
    )
    .replace(/\^([0-9]+)/g, (_, power) => [...power].map((digit) => SUPERSCRIPTS[digit]).join(""));
}
function renderTextWithClickableLinks(value) {
  const parts = String(value || "").split(/(https?:\/\/[^\s]+)/g);

  return parts.map((part, index) => {
    if (/^https?:\/\//i.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }

    return <React.Fragment key={index}>{formatMathText(part)}</React.Fragment>;
  });
}


function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sampleQuestions() {
  const topicData = window.MATH_TOPIC_DATA || {};
  const allQuestions = Object.values(topicData).flatMap((topicQuestions) => Array.isArray(topicQuestions) ? topicQuestions : []);

  if (allQuestions.length > 0) {
    return allQuestions.map((question, index) => ({
      ...question,
      id: question.id || `topic-${index}`,
      order: typeof question.order === "number" ? question.order : index,
      attemptStatus: question.attemptStatus || "unattempted",
      testAllowed: question.testAllowed !== false,
    }));
  }

  return [
    {
      id: "s1", order: 0, category: "Algebra",
      questionText: "If (x + y)^2 = xy + 8 and x^3 - y^3 = 96, then what is the value of x - y?",
      questionImage: null,
      options: ["12", "20", "-12", "16"],
      correctIndex: 0,
      solutionText: "From (x+y)^2 = x^2 + 2xy + y^2 = xy + 8, we get x^2 + xy + y^2 = 8. Using x^3 - y^3 = (x-y)(x^2 + xy + y^2), substitute: x^3 - y^3 = (x-y) \u00d7 8. Since x^3 - y^3 = 96, we get 8(x-y) = 96, so x-y = 12.",
      solutionImage: null,
      attemptStatus: "unattempted",
      testAllowed: true,
    },
    {
      id: "s2", order: 1, category: "Algebra",
      questionText: "Solve for x: 2x + 5 = 15",
      questionImage: null,
      options: ["3", "5", "7", "10"],
      correctIndex: 1,
      solutionText: "Subtract 5 from both sides: 2x = 10. Divide both sides by 2: x = 5.",
      solutionImage: null,
      attemptStatus: "unattempted",
      testAllowed: true,
    },
    {
      id: "s3", order: 2, category: "Geometry",
      questionText: "Find the area of a circle with radius 7 cm. (Use \u03c0 = 22/7)",
      questionImage: null,
      options: ["144 cm\u00b2", "150 cm\u00b2", "154 cm\u00b2", "160 cm\u00b2"],
      correctIndex: 2,
      solutionText: "Area = \u03c0r\u00b2 = (22/7) \u00d7 7 \u00d7 7 = 154 cm\u00b2.",
      solutionImage: null,
      attemptStatus: "unattempted",
      testAllowed: true,
    },
    {
      id: "s4", order: 3, category: "Percentage",
      questionText: "What is 15% of 200?",
      questionImage: null,
      options: ["20", "25", "30", "35"],
      correctIndex: 2,
      solutionText: "15% of 200 = (15/100) \u00d7 200 = 30.",
      solutionImage: null,
      attemptStatus: "unattempted",
      testAllowed: true,
    },
    {
      id: "s5", order: 4, category: "Algebra",
      questionText: "If a = 3 and b = 4, what is a\u00b2 + b\u00b2?",
      questionImage: null,
      options: ["7", "12", "25", "49"],
      correctIndex: 2,
      solutionText: "a\u00b2 + b\u00b2 = 3\u00b2 + 4\u00b2 = 9 + 16 = 25.",
      solutionImage: null,
      attemptStatus: "unattempted",
      testAllowed: true,
    },
    {
      id: "s6", order: 5, category: "Number Theory",
      questionText: "What is the LCM of 4 and 6?",
      questionImage: null,
      options: ["8", "10", "12", "24"],
      correctIndex: 2,
      solutionText: "Multiples of 4: 4, 8, 12, 16\u2026 Multiples of 6: 6, 12, 18\u2026 The smallest common multiple is 12.",
      solutionImage: null,
      attemptStatus: "unattempted",
      testAllowed: true,
    },
  ];
}

function createQuestionStorage() {
  const localStorageAdapter = window.storage || {
    get: async (key) => window.localStorage.getItem(key),
    set: async (key, value) => window.localStorage.setItem(key, value),
    remove: async (key) => window.localStorage.removeItem(key),
  };

  return {
    async get(key) {
      try {
        const response = await fetch("/api/questions", { cache: "no-store" });
        if (!response.ok) throw new Error("Question API is unavailable");
        const payload = await response.json();
        return JSON.stringify(Array.isArray(payload.questions) ? payload.questions : []);
      } catch (error) {
        return localStorageAdapter.get(key);
      }
    },
    async set(key, value) {
      try {
        const response = await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: value,
        });
        if (!response.ok) throw new Error("Could not save questions");
      } catch (error) {
        await localStorageAdapter.set(key, value);
      }
    },
    async delete(key, id) {
      try {
        const response = await fetch(`/api/questions?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Could not delete question");
        const payload = await response.json();
        const questions = Array.isArray(payload.questions) ? payload.questions : [];
        await localStorageAdapter.set(key, JSON.stringify(questions));
        return questions;
      } catch (error) {
        const current = JSON.parse((await localStorageAdapter.get(key)) || "[]");
        const remaining = current.filter((question) => String(question.id) !== String(id));
        await localStorageAdapter.set(key, JSON.stringify(remaining));
        return remaining;
      }
    },
  };
}

function defaultOptions() {
  return ["1", "2", "3", "4"];
}

function emptyDraft() {
  return { category: "", questionText: "", questionImage: null, options: defaultOptions(), correctIndex: 0, solutionText: "", solutionImage: null, special: false };
}

function normalizeQuestion(question) {
  const options = Array.isArray(question.options) && question.options.length ? question.options : defaultOptions();
  const parsedIndex = Number(question.correctIndex);
  const correctIndex = Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < options.length ? parsedIndex : 0;
  return { ...question, options, correctIndex, special: question.special === true };
}

const SECTIONS = [
  { key: "test", label: "Test", icon: Play },
  { key: "correct", label: "Weak", icon: CheckCircle2 },
  { key: "hidden", label: "Hidden", icon: EyeOff },
  { key: "allowed", label: "Allowed", icon: ListChecks },
  { key: "special", label: "Special", icon: ListChecks },
];

/* ---------------------------------- image crop modal ---------------------------------- */

function ImageCropModal({ src, onCancel, onApply }) {
  const imgRef = useRef(null);
  const [disp, setDisp] = useState(null);
  const [crop, setCrop] = useState(null);
  const dragRef = useRef(null);

  function onImgLoad(e) {
    const rect = e.target.getBoundingClientRect();
    const d = { w: rect.width, h: rect.height };
    setDisp(d);
    setCrop({ x: 0, y: 0, w: d.w, h: d.h });
  }

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  function onDragMove(e) {
    if (!dragRef.current || !disp) return;
    e.preventDefault();
    const point = e.touches ? e.touches[0] : e;
    const dx = point.clientX - dragRef.current.startX;
    const dy = point.clientY - dragRef.current.startY;
    const { mode, orig } = dragRef.current;
    if (mode === "move") {
      const nx = clamp(orig.x + dx, 0, disp.w - orig.w);
      const ny = clamp(orig.y + dy, 0, disp.h - orig.h);
      setCrop((c) => ({ ...c, x: nx, y: ny }));
    } else if (mode === "resize") {
      const nw = clamp(orig.w + dx, 30, disp.w - orig.x);
      const nh = clamp(orig.h + dy, 30, disp.h - orig.y);
      setCrop((c) => ({ ...c, w: nw, h: nh }));
    }
  }

  function endDrag() {
    dragRef.current = null;
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", endDrag);
    window.removeEventListener("touchmove", onDragMove);
    window.removeEventListener("touchend", endDrag);
  }

  function startDrag(mode, e) {
    e.preventDefault();
    e.stopPropagation();
    const point = e.touches ? e.touches[0] : e;
    dragRef.current = { mode, startX: point.clientX, startY: point.clientY, orig: { ...crop } };
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchmove", onDragMove, { passive: false });
    window.addEventListener("touchend", endDrag);
  }

  function applyCrop() {
    if (!crop || !disp || !imgRef.current) { onCancel(); return; }
    const img = imgRef.current;
    const scaleX = img.naturalWidth / disp.w;
    const scaleY = img.naturalHeight / disp.h;
    const sx = crop.x * scaleX, sy = crop.y * scaleY, sw = crop.w * scaleX, sh = crop.h * scaleY;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(sw));
    canvas.height = Math.max(1, Math.round(sh));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    onApply(canvas.toDataURL("image/png"));
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal crop-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Crop Image</h2>
          <button className="icon-btn" onClick={onCancel}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="crop-wrap">
            <img ref={imgRef} src={src} onLoad={onImgLoad} alt="to crop" draggable={false} />
            {crop && (
              <div
                className="crop-box"
                style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
                onMouseDown={(e) => startDrag("move", e)}
                onTouchStart={(e) => startDrag("move", e)}
              >
                <div
                  className="crop-handle"
                  onMouseDown={(e) => startDrag("resize", e)}
                  onTouchStart={(e) => startDrag("resize", e)}
                />
              </div>
            )}
          </div>
          <p className="hint">Drag the box to move it, drag the corner handle to resize.</p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={applyCrop}>Apply Crop</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- image field ---------------------------------- */

function ImageField({ label, value, onChange }) {
  const fileRef = useRef(null);
  const [cropSrc, setCropSrc] = useState(null);

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
  }

  function handlePaste(e) {
    const items = (e.clipboardData && e.clipboardData.items) || [];
    for (const item of items) {
      if (item.type && item.type.startsWith("image/")) {
        handleFile(item.getAsFile());
        e.preventDefault();
        break;
      }
    }
  }

  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {value ? (
        <div className="imgpreview">
          <img src={value} alt="" />
          <div className="imgpreview-actions">
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => setCropSrc(value)}><Pencil size={12} /> Edit</button>
            <button type="button" className="btn btn-ghost btn-xs" onClick={() => onChange(null)}><Trash2 size={12} /> Remove</button>
          </div>
        </div>
      ) : (
        <div className="imgdrop" tabIndex={0} onPaste={handlePaste} onClick={(e) => e.currentTarget.focus()}>
          <button type="button" className="btn btn-ghost btn-xs" onClick={() => fileRef.current && fileRef.current.click()}>
            <Upload size={14} /> Choose image
          </button>
          <span>Click here to paste an image (Ctrl/Cmd+V), or choose a file</span>
        </div>
      )}
      <input
        ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => { handleFile(e.target.files[0]); e.target.value = ""; }}
      />
      {cropSrc && (
        <ImageCropModal
          src={cropSrc}
          onCancel={() => setCropSrc(null)}
          onApply={(dataUrl) => { onChange(dataUrl); setCropSrc(null); }}
        />
      )}
    </div>
  );
}

/* ---------------------------------- question editor modal ---------------------------------- */

function QuestionEditorModal({ initial, topics, onCancel, onSave }) {
  const [draft, setDraft] = useState(() => (initial ? JSON.parse(JSON.stringify(initial)) : emptyDraft()));
  const [error, setError] = useState("");
  // Text entered here is appended to the end of every option.
  // Example: options 16, 24, 32, 40 + suffix "%" => 16 %, 24 %, 32 %, 40 %.
  const [optionSuffix, setOptionSuffix] = useState("");

  function applyOptionSuffix(options, suffix) {
    const cleanSuffix = String(suffix ?? "");
    if (!cleanSuffix) return options.map((o) => String(o));

    return options.map((o) => {
      const value = String(o ?? "");
      // Do not duplicate the suffix if it is already present.
      return value.endsWith(cleanSuffix) ? value : value + cleanSuffix;
    });
  }

  function changeOptionSuffix(value) {
    const nextSuffix = String(value ?? "");
    setOptionSuffix(nextSuffix);

    setDraft((d) => {
      const previousSuffix = optionSuffix;
      const options = d.options.map((o) => {
        let value = String(o ?? "");

        // Remove the previously applied suffix before applying the new one.
        if (previousSuffix && value.endsWith(previousSuffix)) {
          value = value.slice(0, -previousSuffix.length);
        }

        return nextSuffix ? value + nextSuffix : value;
      });

      return { ...d, options };
    });
  }

  function updateOption(i, val) {
    setDraft((d) => {
      const options = [...d.options];
      options[i] = val;
      return { ...d, options };
    });
  }

  // Quick option generators:
  // 2 = random integer options
  // . = random decimal options with 2 decimal places
  // a = A, B, C, D
  // 1 = random single-digit options (1-9)
  function generateOptions(type) {
    let options = [];

    if (type === "number") {
      const values = new Set();
      while (values.size < 4) {
        values.add(String(Math.floor(Math.random() * 100) + 1));
      }
      options = [...values];
    } else if (type === "decimal") {
      const values = new Set();
      while (values.size < 4) {
        values.add((Math.floor(Math.random() * 9999) / 100).toFixed(2));
      }
      options = [...values];
    } else if (type === "letter") {
      options = ["A", "B", "C", "D"];
    } else if (type === "digit") {
      const values = new Set();
      while (values.size < 4) {
        values.add(String(Math.floor(Math.random() * 9) + 1));
      }
      options = [...values];
    }

    setDraft((d) => ({ ...d, options: applyOptionSuffix(options, optionSuffix) }));
  }

  function handleSave() {
    const topic = draft.category.trim();
    const hasQ = draft.questionText.trim() || draft.questionImage;
    const optsFilled = draft.options.every((o) => o.trim());
    if (!topic) { setError("Add a topic before saving the question."); return; }
    if (!hasQ) { setError("Add question text or a question image."); return; }
    if (!optsFilled) { setError("Fill in all 4 options."); return; }
    const clean = {
      ...draft,
      category: topic,
      questionText: draft.questionText.trim(),
      options: draft.options.map((o) => o.trim()),
      correctIndex: Number(draft.correctIndex),
      solutionText: draft.solutionText.trim(),
    };
    onSave(clean);
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{initial ? "Edit Question" : "New Question"}</h2>
          <button className="icon-btn" onClick={onCancel}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label className="field-label">Topic</label>
            <input className="input" list="question-topics" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))} placeholder="Select an existing topic or type a new one" />
            <datalist id="question-topics">
              {topics.map((topic) => <option key={topic} value={topic} />)}
            </datalist>
          </div>

          <div className="field">
            <label className="field-label">Question Text</label>
            <textarea className="textarea" rows={3} value={draft.questionText} onChange={(e) => setDraft((d) => ({ ...d, questionText: e.target.value }))} placeholder="Type the question..." />
          </div>
          <ImageField label="Question Image (optional)" value={draft.questionImage} onChange={(img) => setDraft((d) => ({ ...d, questionImage: img }))} />

          <div className="field">
            <label className="field-label">Options</label>

            <div className="quick-option-tools">
              <button
                type="button"
                className="quick-option-btn"
                onClick={() => generateOptions("number")}
                title="Generate 4 random number options"
              >
                2
              </button>
              <button
                type="button"
                className="quick-option-btn"
                onClick={() => generateOptions("decimal")}
                title="Generate 4 random decimal options"
              >
                .
              </button>
              <button
                type="button"
                className="quick-option-btn"
                onClick={() => generateOptions("letter")}
                title="Generate A, B, C, D"
              >
                a
              </button>
              <button
                type="button"
                className="quick-option-btn"
                onClick={() => generateOptions("digit")}
                title="Generate 4 random options from 1 to 9"
              >
                1
              </button>
            </div>

            <div className="option-suffix-row">
              <input
                type="text"
                className="option-suffix-input"
                value={optionSuffix}
                onChange={(e) => changeOptionSuffix(e.target.value)}
                placeholder="%"
                aria-label="Apply text to end of all options"
                title="Whatever you type here will be added after every option"
              />
              <span className="option-suffix-hint">append to all options</span>
            </div>

            {draft.options.map((opt, i) => (
              <div className="option-edit-row" key={i}>
                <button type="button" className={"radio-dot" + (draft.correctIndex === i ? " checked" : "")} onClick={() => setDraft((d) => ({ ...d, correctIndex: i }))} title="Mark as correct answer">
                  {String.fromCharCode(65 + i)}
                </button>
                <input className="input" value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={"Option " + String.fromCharCode(65 + i)} />
              </div>
            ))}
          </div>

          <div className="field">
            <label className="field-label">Solution</label>
            <textarea className="textarea" rows={3} value={draft.solutionText} onChange={(e) => setDraft((d) => ({ ...d, solutionText: e.target.value }))} placeholder="Explain the solution..." />
          </div>
          <ImageField label="Solution Image (optional)" value={draft.solutionImage} onChange={(img) => setDraft((d) => ({ ...d, solutionImage: img }))} />

          <div className="field">
            <label className="topic-check">
              <input
                type="checkbox"
                checked={draft.special === true}
                onChange={(e) => setDraft((d) => ({ ...d, special: e.target.checked }))}
              />
              <span>Special / Important Question</span>
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Question</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- question card ---------------------------------- */

function QuestionCard({ q, onMarkCorrect, onMarkWrong, onToggleAllow, onCopy, onEdit, onDelete, showStatusActions = true, showWrongAction = true }) {
  const [showSolution, setShowSolution] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="card">
      <div className="card-top">
        <span className="badge cat">{q.category || "General"}</span>
        {q.attemptStatus === "correct" && <span className="badge ok">Weak</span>}
        {q.attemptStatus === "wrong" && <span className="badge bad">Wrong</span>}
        {!q.testAllowed && <span className="badge hide">Hidden</span>}
      </div>
      <div
        className="card-q question-toggle"
        onClick={() => setShowOptions((shown) => !shown)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setShowOptions((shown) => !shown); } }}
        role="button"
        tabIndex={0}
        title={showOptions ? "Hide options" : "Show options"}
      >
        {q.questionText && <p>{formatMathText(q.questionText)}</p>}
        {q.questionImage && <img className="card-img" src={q.questionImage} alt="question" />}
        <span className="question-hint">{showOptions ? "Click question to hide options" : "Click question to show options"}</span>
      </div>
      {showOptions && (
        <div className="opt-list">
          {q.options.map((opt, i) => (
            <div key={i} className={"opt-row" + (i === q.correctIndex ? " opt-correct" : "")}>
              <span className="opt-letter">{String.fromCharCode(65 + i)}</span><span>{formatMathText(opt)}</span>
            </div>
          ))}
        </div>
      )}
      <button type="button" className="link-btn" onClick={() => setShowSolution((s) => !s)}>
        {showSolution ? "Hide solution" : "Show solution"}
      </button>
      {showSolution && (
        <div className="solution">
          {q.solutionText && <p>{renderTextWithClickableLinks(q.solutionText)}</p>}
          {q.solutionImage && <img className="card-img" src={q.solutionImage} alt="solution" />}
          {!q.solutionText && !q.solutionImage && <p className="muted">No solution provided.</p>}
        </div>
      )}
      <div className="card-actions">
        {showStatusActions && <>
          <button
            className={"icon-btn" + (q.attemptStatus === "correct" ? " active-ok" : "")}
            onClick={onMarkCorrect}
            title={q.attemptStatus === "correct" ? "Move back to Allowed / New" : "Move to Weak"}
          >
            <CheckCircle2 size={15} />
          </button>
          {showWrongAction && (
            <button className={"icon-btn" + (q.attemptStatus === "wrong" ? " active-bad" : "")} onClick={onMarkWrong} title="Mark Wrong">
              <XCircle size={15} />
            </button>
          )}
        </>}
        <button
          className="visibility-btn"
          onClick={onToggleAllow}
          title={q.testAllowed ? "Move to Hidden / Perfect" : "Move back to Allowed / New"}
        >
          {q.testAllowed ? <EyeOff size={15} /> : <Eye size={15} />}
          <span>{q.testAllowed ? "Hide" : "Allow"}</span>
        </button>
        <button className="icon-btn" onClick={onCopy} title="Copy Question"><Copy size={15} /></button>
        <button className="icon-btn" onClick={onEdit} title="Edit"><Pencil size={15} /></button>
        <button className="icon-btn danger" onClick={onDelete} title="Delete"><Trash2 size={15} /></button>
      </div>
    </div>
  );
}

/* ---------------------------------- section list ---------------------------------- */

function TopicFilter({ topics, value, onChange, searchValue, onSearchChange }) {
  return (
    <div className="topic-filter">
      {topics.length > 0 && (
        <>
          <label className="field-label" htmlFor="topic-filter">Filter by topic</label>
          <select id="topic-filter" className="input topic-select" value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="all">All topics</option>
            {topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
          </select>
        </>
      )}
      <input
        type="search"
        className="input search-input"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search questions..."
        aria-label="Search questions"
      />
    </div>
  );
}

function SectionList({ title, emptyText, items, topics, topicFilter, onTopicChange, searchQuery, onSearchChange, onMarkCorrect, onMarkWrong, onToggleAllow, onCopy, onEdit, onDelete, showStatusActions = true, showWrongAction = true }) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  return (
    <div className="section-wrap">
      <div className="section-head"><h2>{title}</h2><span className="count-pill">{items.length}</span></div>
      <TopicFilter topics={topics} value={topicFilter} onChange={onTopicChange} searchValue={searchQuery} onSearchChange={onSearchChange} />
      {sorted.length === 0 ? (
        <div className="empty-state">{emptyText}</div>
      ) : (
        <div className="card-list">
          {sorted.map((q) => (
            <QuestionCard
              key={q.id} q={q}
              onMarkCorrect={() => onMarkCorrect(q.id)}
              onMarkWrong={() => onMarkWrong(q.id)}
              onToggleAllow={() => onToggleAllow(q.id)}
              onCopy={() => onCopy(q.id)}
              onEdit={() => onEdit(q.id)}
              onDelete={() => onDelete(q.id)}
              showStatusActions={showStatusActions}
              showWrongAction={showWrongAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- test mode ---------------------------------- */

function TestSetup({ testPoolCount, topics, config, setConfig, onStart }) {
  const selectedTopics = Array.isArray(config.topics) ? config.topics : [];
  const allTopicsSelected = selectedTopics.length === topics.length && topics.length > 0;

  function toggleTopic(topic) {
    setConfig((c) => {
      const current = Array.isArray(c.topics) ? c.topics : [];
      const next = current.includes(topic)
        ? current.filter((t) => t !== topic)
        : [...current, topic];
      return { ...c, topics: next };
    });
  }

  function selectAllTopics() {
    setConfig((c) => ({ ...c, topics: [...topics] }));
  }

  function clearTopics() {
    setConfig((c) => ({ ...c, topics: [] }));
  }

  const sourceLabel =
    config.pool === "weak"
      ? "Weak questions"
      : config.pool === "hidden"
        ? "Hidden / Perfect questions"
        : config.pool === "special"
          ? "Special questions"
          : config.pool === "all"
            ? "All questions"
            : "Allowed / New questions";

  const topicLabel =
    selectedTopics.length === 0
      ? "All topics"
      : selectedTopics.length === topics.length
        ? "All topics"
        : selectedTopics.join(", ");

  return (
    <div className="test-setup">
      <div className="setup-card">
        <h2>Start a Test</h2>
        <p className="muted">
          {testPoolCount} question{testPoolCount !== 1 ? "s" : ""} available
          {selectedTopics.length ? ` from ${topicLabel}` : " from all topics"}.
        </p>

        <div className="field">
          <label className="field-label">Question Source</label>
          <div className="test-source-grid">
            <button
              type="button"
              className={"source-choice" + (config.pool === "allowed" ? " selected" : "")}
              onClick={() => setConfig((c) => ({ ...c, pool: "allowed" }))}
            >
              <span className="source-title">Allowed / New</span>
              <span className="source-desc">New or not-yet-classified questions</span>
            </button>

            <button
              type="button"
              className={"source-choice" + (config.pool === "weak" ? " selected" : "")}
              onClick={() => setConfig((c) => ({ ...c, pool: "weak" }))}
            >
              <span className="source-title">Weak</span>
              <span className="source-desc">Questions you need more practice in</span>
            </button>

            <button
              type="button"
              className={"source-choice" + (config.pool === "hidden" ? " selected" : "")}
              onClick={() => setConfig((c) => ({ ...c, pool: "hidden" }))}
            >
              <span className="source-title">Hidden / Perfect</span>
              <span className="source-desc">Questions you already know well</span>
            </button>

            <button
              type="button"
              className={"source-choice" + (config.pool === "special" ? " selected" : "")}
              onClick={() => setConfig((c) => ({ ...c, pool: "special" }))}
            >
              <span className="source-title">Special</span>
              <span className="source-desc">Special / Important questions</span>
            </button>

            <button
              type="button"
              className={"source-choice" + (config.pool === "all" ? " selected" : "")}
              onClick={() => setConfig((c) => ({ ...c, pool: "all" }))}
            >
              <span className="source-title">All</span>
              <span className="source-desc">All questions</span>
            </button>
          </div>
          <p className="hint">Every section can be tested separately.</p>
        </div>

        <div className="field">
          <div className="topic-select-head">
            <label className="field-label">Select Topics</label>
            <div className="topic-actions">
              <button type="button" className="link-btn" onClick={selectAllTopics} disabled={allTopicsSelected}>Select all</button>
              <button type="button" className="link-btn" onClick={clearTopics} disabled={selectedTopics.length === 0}>Clear</button>
            </div>
          </div>

          {topics.length === 0 ? (
            <div className="empty-state">No topics available.</div>
          ) : (
            <div className="topic-check-grid">
              {topics.map((topic) => {
                const checked = selectedTopics.includes(topic);
                return (
                  <label key={topic} className={"topic-check" + (checked ? " checked" : "")}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTopic(topic)}
                    />
                    <span>{topic}</span>
                  </label>
                );
              })}
            </div>
          )}
          <p className="hint">
            {selectedTopics.length === 0
              ? "No topic selected = all topics."
              : `${selectedTopics.length} topic${selectedTopics.length === 1 ? "" : "s"} selected.`}
          </p>
        </div>

        <div className="field">
          <label className="field-label">Number of Questions (max {Math.max(testPoolCount, 1)})</label>
          <input
            type="number"
            min={1}
            max={Math.max(testPoolCount, 1)}
            className="input"
            value={config.count}
            disabled={testPoolCount === 0}
            onChange={(e) => {
              let v = parseInt(e.target.value || "1", 10);
              if (isNaN(v)) v = 1;
              v = Math.max(1, Math.min(v, Math.max(testPoolCount, 1)));
              setConfig((c) => ({ ...c, count: v }));
            }}
            onBlur={(e) => {
              let v = parseInt(e.target.value || "1", 10);
              if (isNaN(v)) v = 1;
              v = Math.max(1, Math.min(v, Math.max(testPoolCount, 1)));
              setConfig((c) => ({ ...c, count: v }));
            }}
          />
        </div>

        <div className="test-selection-summary">
          <span>Source: <b>{sourceLabel}</b></span>
          <span>Topics: <b>{selectedTopics.length === 0 || allTopicsSelected ? "All" : selectedTopics.length}</b></span>
          <span>Pool: <b>{testPoolCount}</b></span>
        </div>

        <button className="btn btn-primary btn-block" disabled={testPoolCount === 0} onClick={onStart}>
          <Play size={14} /> Start Test
        </button>
        {testPoolCount === 0 && (
          <p className="warn-text">
            No questions available for this selection. Try another source or topic.
          </p>
        )}
      </div>
    </div>
  );
}

function TestRunning({ question, index, total, answer, onSelect, onMark, onNext, onBack, onExit, isLast, onHide, ids, answers, allQuestions, onJump }) {
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    const timerId = setInterval(() => setTimerSeconds((seconds) => seconds + 1), 1000);
    return () => clearInterval(timerId);
  }, [timerRunning]);

  const timerText = `${String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:${String(timerSeconds % 60).padStart(2, "0")}`;

  if (!question) {
    return (
      <div className="test-running">
        <div className="empty-state">This question is no longer available.</div>
        <div className="test-nav">
          <button className="btn btn-ghost" disabled={index === 0} onClick={onBack}><ChevronLeft size={14} /> Back</button>
          <button className="btn btn-primary" onClick={onNext}>{isLast ? "Finish" : "Next"} <ChevronRight size={14} /></button>
        </div>
      </div>
    );
  }
  const revealed = answer && answer.revealed;
  return (
    <div className="test-running">
      <div className="test-topbar">
        <button className="link-btn" onClick={onExit}><X size={14} /> Exit</button>
        <span className="progress-label">Question {index + 1} / {total}</span>
        <div className="tiny-timer" aria-label="Test timer">
          <span className="tiny-timer-time">{timerText}</span>
          <button type="button" className="tiny-timer-btn" onClick={() => setTimerRunning(true)} disabled={timerRunning} title="Start timer">▶</button>
          <button type="button" className="tiny-timer-btn" onClick={() => setTimerRunning(false)} disabled={!timerRunning} title="Stop timer">■</button>
          <button type="button" className="tiny-timer-btn" onClick={() => { setTimerRunning(false); setTimerSeconds(0); }} title="Reset timer">↺</button>
        </div>
        <button className="link-btn hide-q-btn" onClick={() => onHide(question.id)} title="Move this question to Hidden / Perfect"><EyeOff size={14} /> Hide / Perfect</button>
      </div>
      <div className="progress-track"><div className="progress-fill" style={{ width: ((index + 1) / total) * 100 + "%" }} /></div>
      {ids && ids.length > 1 && (
        <div className="q-jump-row">
          <span className="q-jump-label">Jump to any question:</span>
          <div className="q-jump-grid">
            {ids.map((qid, i) => {
              const qa = answers ? answers[qid] : null;
              const qq = allQuestions ? allQuestions.find((x) => x.id === qid) : null;
              let cls = "q-jump-btn";
              if (i === index) cls += " current";
              else if (qa && qq) cls += qa.selected === qq.correctIndex ? " ans-correct" : " ans-wrong";
              return (
                <button key={qid} type="button" className={cls} onClick={() => onJump(i)} title={"Go to question " + (i + 1)}>
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="card q-card">
        <span className="badge cat">{question.category || "General"}</span>
        {question.questionText && <p className="q-text">{formatMathText(question.questionText)}</p>}
        {question.questionImage && <img className="card-img" src={question.questionImage} alt="question" />}
        <div className="opt-list test-opts">
          {question.options.map((opt, i) => {
            let cls = "opt-row selectable";
            if (revealed) {
              if (i === question.correctIndex) cls += " opt-correct-answer";
              else if (answer && i === answer.selected) cls += " opt-wrong-answer";
            } else if (answer && answer.selected === i) cls += " opt-picked";
            return (
              <button key={i} type="button" className={cls} disabled={revealed} onClick={() => onSelect(i)}>
                <span className="opt-letter">{String.fromCharCode(65 + i)}</span><span>{formatMathText(opt)}</span>
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className="solution reveal">
            <div className="solution-head">
              {answer.selected === question.correctIndex
                ? <span className="badge ok">Correct!</span>
                : <span className="badge bad">Incorrect</span>}
            </div>
            {question.solutionText && <p>{renderTextWithClickableLinks(question.solutionText)}</p>}
            {question.solutionImage && <img className="card-img" src={question.solutionImage} alt="solution" />}
            <div className="mark-row">
              <button
                className={"btn btn-xs" + (question.attemptStatus === "correct" ? " btn-ok-active" : " btn-ghost")}
                onClick={() => onMark("correct")}
              >
                <CheckCircle2 size={13} /> {question.attemptStatus === "correct" ? "Remove from Weak" : "Move to Weak"}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="test-nav">
        <button className="btn btn-ghost" disabled={index === 0} onClick={onBack}><ChevronLeft size={14} /> Back</button>
        <button className="btn btn-primary" onClick={onNext}>{isLast ? "Finish" : "Next"} <ChevronRight size={14} /></button>
      </div>
    </div>
  );
}

function TestSummary({ ids, questions, onDone }) {
  const qs = ids.map((id) => questions.find((q) => q.id === id)).filter(Boolean);
  const correct = qs.filter((q) => q.attemptStatus === "correct").length;
  const wrong = qs.filter((q) => q.attemptStatus === "wrong").length;
  const unattempted = qs.length - correct - wrong;
  return (
    <div className="summary">
      <h2>Test Complete</h2>
      <div className="summary-grid">
        <div className="summary-stat ok"><b>{correct}</b><span>Correct</span></div>
        <div className="summary-stat bad"><b>{wrong}</b><span>Wrong</span></div>
        <div className="summary-stat neutral"><b>{unattempted}</b><span>Unmarked</span></div>
      </div>
      <div className="summary-actions">
        <button className="btn btn-primary btn-block" onClick={onDone}><RotateCcw size={14} /> Done / New Test</button>
      </div>
    </div>
  );
}

/* ---------------------------------- app ---------------------------------- */

function App() {
  const [questions, setQuestions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [section, setSection] = useState("test");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [testConfig, setTestConfig] = useState({ pool: "allowed", topics: [], count: 5 });
  const [testSession, setTestSession] = useState(null);
  const [toast, setToast] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const STORAGE_KEY = "mathquiz:questions";
      const storage = createQuestionStorage();

      let data = [];

      try {
        const saved = await storage.get(STORAGE_KEY);
        const value = typeof saved === "string" ? saved : saved && saved.value;
        if (value !== null && value !== undefined && value !== "") {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            data = parsed;
          }
        }
      } catch (e) {}

      if (data.length === 0) {
        const topicData = window.MATH_TOPIC_DATA || {};
        const allQuestions = Object.values(topicData).flatMap((topicQuestions) => Array.isArray(topicQuestions) ? topicQuestions : []);
        data = allQuestions.length > 0 ? allQuestions : sampleQuestions();
      }

      data = data.map((question, index) => normalizeQuestion({
        ...question,
        id: question.id || `topic-${index}`,
        order: typeof question.order === "number" ? question.order : index,
        attemptStatus: question.attemptStatus || "unattempted",
        testAllowed: question.testAllowed !== false,
      }));

      try { await storage.set(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
      if (!cancelled) { setQuestions(data); setLoaded(true); }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      const storage = createQuestionStorage();
      storage.set("mathquiz:questions", JSON.stringify(questions)).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [questions, loaded]);

  function notify(msg) { setToast(msg); setTimeout(() => setToast(""), 1800); }

  function addQuestion(draft) {
    setQuestions((prev) => [...prev, { ...draft, id: uid(), order: prev.length, attemptStatus: "unattempted", testAllowed: true }]);
    notify("Question added");
  }
  function editQuestionSave(id, draft) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...draft } : q)));
    notify("Question updated");
  }
  function deleteQuestion(id) {
    const question = questions.find((q) => q.id === id);
    const preview = question && question.questionText
      ? question.questionText.slice(0, 90) + (question.questionText.length > 90 ? "…" : "")
      : "this question";

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${preview}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    const storage = createQuestionStorage();
    setQuestions((prev) => {
      const remaining = prev.filter((q) => q.id !== id);
      storage.delete("mathquiz:questions", id).catch(() => {});
      return remaining;
    });
    notify("Question deleted");
  }
  async function copyQuestion(id) {
    const question = questions.find((q) => q.id === id);
    if (!question) return;

    const textToCopy = String(question.questionText || "").trim();
    if (!textToCopy) {
      notify("No question text to copy");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      notify("Question text copied");
    } catch (error) {
      notify("Could not copy question text");
    }
  }
  function markStatus(id, status) {
    setQuestions((prev) => prev.map((q) => {
      if (q.id !== id) return q;

      // "correct" is now the Weak bucket.
      if (status === "correct") {
        if (q.attemptStatus === "correct") {
          return { ...q, attemptStatus: "unattempted", testAllowed: true };
        }
        return { ...q, attemptStatus: "correct", testAllowed: true };
      }

      // Kept for the existing Special section behavior.
      return { ...q, attemptStatus: q.attemptStatus === status ? "unattempted" : status };
    }));
  }

  function toggleAllow(id) {
    setQuestions((prev) => prev.map((q) => {
      if (q.id !== id) return q;

      if (!q.testAllowed) {
        // Hidden -> Allowed / New
        return { ...q, testAllowed: true, attemptStatus: "unattempted" };
      }

      // Allowed or Weak -> Hidden / Perfect.
      // Reset Weak so the question belongs to only one normal section.
      return { ...q, testAllowed: false, attemptStatus: "unattempted" };
    }));
  }

  function hideFromTest(id) {
    setQuestions((prev) => prev.map((q) =>
      q.id === id
        ? { ...q, testAllowed: false, attemptStatus: "unattempted" }
        : q
    ));
    notify("Moved to Hidden / Perfect");
  }

  function openNew() { setEditingId(null); setEditorOpen(true); }
  function openEdit(id) { setEditingId(id); setEditorOpen(true); }
  function closeEditor() { setEditorOpen(false); setEditingId(null); }
  function saveEditor(draft) {
    if (editingId) editQuestionSave(editingId, draft); else addQuestion(draft);
    closeEditor();
  }
  function exportTrigonometryData() {
    const topicQuestions = questions
      .filter((q) => (q.category || "").trim().toLowerCase() === "trigonometry")
      .sort((a, b) => a.order - b.order)
      .map(({ id, category, questionText, questionImage, options, correctIndex, solutionText, solutionImage }) => ({
        id,
        category,
        questionText,
        questionImage: questionImage || null,
        options,
        correctIndex,
        solutionText,
        solutionImage: solutionImage || null,
      }));

    if (topicQuestions.length === 0) {
      notify("No Trigonometry questions to export");
      return;
    }

    const content = `window.MATH_TOPIC_DATA = window.MATH_TOPIC_DATA || {};\nwindow.MATH_TOPIC_DATA.trigonometry = ${JSON.stringify(topicQuestions, null, 2)};\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/javascript" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "trigonometry.js";
    link.click();
    URL.revokeObjectURL(url);
    notify("Downloaded trigonometry.js");
  }

  const correctList = questions.filter((q) => q.attemptStatus === "correct");
  const hiddenList = questions.filter((q) => !q.testAllowed);
  // Allowed / New = anything visible in tests and not marked Weak.
  // NOTE: "special" is an independent tag, not a bucket state — a special
  // question that is testAllowed and not Weak will show up here too,
  // in addition to showing up in the Special tab.
  const allowedList = questions.filter((q) => q.testAllowed && q.attemptStatus !== "correct");
  const specialList = questions.filter((q) => q.special === true);
  const topics = [...new Set(questions.map((q) => (q.category || "General").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const filterByTopic = (items) => topicFilter === "all" ? items : items.filter((q) => (q.category || "General") === topicFilter);
  const filterBySearch = (items) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;
    return items.filter((q) => {
      const inText = (q.questionText || "").toLowerCase().includes(query);
      const inOptions = (q.options || []).some((o) => (o || "").toLowerCase().includes(query));
      const inSolution = (q.solutionText || "").toLowerCase().includes(query);
      const inCategory = (q.category || "").toLowerCase().includes(query);
      return inText || inOptions || inSolution || inCategory;
    });
  };
  const filterList = (items) => filterBySearch(filterByTopic(items));

  useEffect(() => {
    setTestConfig((c) => {
      const currentTopics = Array.isArray(c.topics) ? c.topics : [];
      const validTopics = currentTopics.filter((topic) => topics.includes(topic));
      const nextTopics = currentTopics.length === 0
        ? []
        : validTopics;
      const sourceList =
        c.pool === "weak"
          ? correctList
          : c.pool === "hidden"
            ? hiddenList
            : c.pool === "special"
              ? specialList
              : c.pool === "all"
                ? questions
                : allowedList;
      const topicPool = nextTopics.length === 0
        ? sourceList
        : sourceList.filter((q) => nextTopics.includes((q.category || "General").trim()));
      const max = Math.max(topicPool.length, 1);
      const count = Math.min(Math.max(Number(c.count) || 1, 1), max);
      const pool = ["allowed", "weak", "hidden", "special", "all"].includes(c.pool) ? c.pool : "allowed";

      const unchanged =
        pool === c.pool &&
        count === c.count &&
        JSON.stringify(nextTopics) === JSON.stringify(currentTopics);

      return unchanged ? c : { ...c, pool, topics: nextTopics, count };
    });
  }, [questions, allowedList.length, correctList.length, hiddenList.length, specialList.length, topics.join("|")]);

  function startTest() {
    const sourceList =
      testConfig.pool === "weak"
        ? correctList
        : testConfig.pool === "hidden"
          ? hiddenList
          : testConfig.pool === "special"
            ? specialList
            : testConfig.pool === "all"
              ? questions
              : allowedList;

    const selectedTopics = Array.isArray(testConfig.topics) ? testConfig.topics : [];

    // STEP 1: Build ONE flat, combined pool of every question that matches
    // the chosen source + selected topics. Newly added questions are simply
    // part of this same flat array — nothing here depends on insertion order.
    const combinedPool = selectedTopics.length === 0
      ? [...sourceList]
      : sourceList.filter((q) => selectedTopics.includes((q.category || "General").trim()));

    if (combinedPool.length === 0) return;

    const count = Math.max(1, Math.min(Number(testConfig.count) || 1, combinedPool.length));

    // STEP 2: Shuffle the WHOLE combined pool first (fresh random order
    // every time a test starts). This guarantees new / old / special
    // questions are all equally likely to land anywhere in the run.
    const shuffledPool = shuffleArr(combinedPool);

    // STEP 3: Only AFTER shuffling do we slice out how many questions
    // this test actually needs.
    const ids = shuffledPool.slice(0, count).map((q) => q.id);
    if (ids.length === 0) return;

    setTestSession({
      ids,
      idx: 0,
      answers: {},
      finished: false,
      pool: testConfig.pool,
      topics: selectedTopics
    });
  }
  function selectOption(i) {
    setTestSession((prev) => {
      if (!prev) return prev;
      const qid = prev.ids[prev.idx];
      return { ...prev, answers: { ...prev.answers, [qid]: { selected: i, revealed: true } } };
    });
  }
  function markFromTest(status) {
    if (!testSession) return;
    const qid = testSession.ids[testSession.idx];
    markStatus(qid, status);
  }
  function nextQuestion() {
    setTestSession((prev) => {
      if (!prev) return prev;
      if (prev.idx < prev.ids.length - 1) return { ...prev, idx: prev.idx + 1 };
      return { ...prev, finished: true };
    });
  }
  function backQuestion() {
    setTestSession((prev) => (prev && prev.idx > 0 ? { ...prev, idx: prev.idx - 1 } : prev));
  }
  function jumpToQuestion(i) {
    setTestSession((prev) => (prev ? { ...prev, idx: i } : prev));
  }
  function exitTest() { setTestSession(null); }

  if (!loaded) {
    return (
      <div className="app loading-screen">
        <style>{CSS}</style>
        <div className="loader">Loading question bank\u2026</div>
      </div>
    );
  }

  const editingQuestion = editingId ? questions.find((q) => q.id === editingId) : null;

  return (
    <div className="app">
      <style>{CSS}</style>
      <div className="header">
        <div className="header-title"><span className="brand">MATH</span><span className="brand-accent">::BANK</span></div>
        <div className="header-actions">
          <button className="icon-btn export-btn" onClick={exportTrigonometryData} title="Download Trigonometry data" aria-label="Download Trigonometry data"><Icon symbol="v" size={16} /></button>
          <button className="add-btn" onClick={openNew} title="New Question"><Plus size={16} /></button>
        </div>
      </div>
      <div className="header-stats">
        <span className="stat"><b>{questions.length}</b>Total</span>
        <span className="stat ok-c"><b>{correctList.length}</b>Weak</span>
        <span className="stat amber-c"><b>{hiddenList.length}</b>Hidden</span>
        <span className="stat cyan-c"><b>{allowedList.length}</b>Allowed</span>
      </div>

      <div className="content">
        {section === "test" && (
          !testSession ? (
            <TestSetup
              testPoolCount={(() => {
                const sourceList =
                  testConfig.pool === "weak"
                    ? correctList
                    : testConfig.pool === "hidden"
                      ? hiddenList
                      : testConfig.pool === "special"
                        ? specialList
                        : testConfig.pool === "all"
                          ? questions
                          : allowedList;
                const selectedTopics = Array.isArray(testConfig.topics) ? testConfig.topics : [];
                return selectedTopics.length === 0
                  ? sourceList.length
                  : sourceList.filter((q) => selectedTopics.includes((q.category || "General").trim())).length;
              })()}
              topics={topics} config={testConfig} setConfig={setTestConfig} onStart={startTest}
            />
          ) : testSession.finished ? (
            <TestSummary ids={testSession.ids} questions={questions} onDone={exitTest} />
          ) : (
            (() => {
              const qid = testSession.ids[testSession.idx];
              const question = questions.find((q) => q.id === qid);
              const answer = testSession.answers[qid];
              return (
                <TestRunning
                  question={question} index={testSession.idx} total={testSession.ids.length} answer={answer}
                  onSelect={selectOption} onMark={markFromTest} onNext={nextQuestion} onBack={backQuestion} onExit={exitTest}
                  isLast={testSession.idx === testSession.ids.length - 1}
                  onHide={hideFromTest}
                  ids={testSession.ids}
                  answers={testSession.answers}
                  allQuestions={questions}
                  onJump={jumpToQuestion}
                />
              );
            })()
          )
        )}
        {section === "correct" && (
          <SectionList title="Weak Questions" emptyText="No weak questions yet." items={filterList(correctList)} topics={topics} topicFilter={topicFilter} onTopicChange={setTopicFilter}
            searchQuery={searchQuery} onSearchChange={setSearchQuery}
            onMarkCorrect={(id) => markStatus(id, "correct")} onMarkWrong={(id) => markStatus(id, "wrong")} onToggleAllow={toggleAllow}
            onCopy={copyQuestion} onEdit={openEdit} onDelete={deleteQuestion} showWrongAction={false} />
        )}
        {section === "hidden" && (
          <SectionList title="Hidden / Perfect Questions" emptyText="No hidden/perfect questions yet." items={filterList(hiddenList)} topics={topics} topicFilter={topicFilter} onTopicChange={setTopicFilter}
            searchQuery={searchQuery} onSearchChange={setSearchQuery}
            onMarkCorrect={(id) => markStatus(id, "correct")} onMarkWrong={(id) => markStatus(id, "wrong")} onToggleAllow={toggleAllow}
            onCopy={copyQuestion} onEdit={openEdit} onDelete={deleteQuestion} showWrongAction={false} />
        )}
        {section === "allowed" && (
          <SectionList title="Allowed / New Questions" emptyText="No new/allowed questions yet." items={filterList(allowedList)} topics={topics} topicFilter={topicFilter} onTopicChange={setTopicFilter}
            searchQuery={searchQuery} onSearchChange={setSearchQuery}
            onMarkCorrect={(id) => markStatus(id, "correct")} onMarkWrong={(id) => markStatus(id, "wrong")} onToggleAllow={toggleAllow}
            onCopy={copyQuestion} onEdit={openEdit} onDelete={deleteQuestion} showStatusActions={false} showWrongAction={false} />
        )}
        {section === "special" && (
          <SectionList title="Special / Important Questions" emptyText="No special questions yet." items={filterList(specialList)} topics={topics} topicFilter={topicFilter} onTopicChange={setTopicFilter}
            searchQuery={searchQuery} onSearchChange={setSearchQuery}
            onMarkCorrect={(id) => markStatus(id, "correct")} onMarkWrong={(id) => markStatus(id, "wrong")} onToggleAllow={toggleAllow}
            onCopy={copyQuestion} onEdit={openEdit} onDelete={deleteQuestion} />
        )}
      </div>

      <div className="navbar">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button key={s.key} className={"nav-btn" + (section === s.key ? " active" : "")} onClick={() => setSection(s.key)}>
              <Icon size={17} />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {editorOpen && <QuestionEditorModal initial={editingQuestion} topics={topics} onCancel={closeEditor} onSave={saveEditor} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ---------------------------------- styles ---------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600&display=swap');

.app {
  --bg: #0B0F17;
  --panel: #121826;
  --panel-2: #171F30;
  --border: #232C40;
  --cyan: #4C8DFF;
  --violet: #4C8DFF;
  --green: #34C77B;
  --rose: #F2555B;
  --amber: #D9A441;
  --text: #E7ECF5;
  --muted: #8592A6;

  width: min(100%, 860px);
  max-width: 860px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  position: relative;
}

.app.loading-screen { align-items: center; justify-content: center; }
.loader { font-family: 'JetBrains Mono', monospace; color: var(--cyan); letter-spacing: 1px; font-size: 12px; }

.header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 14px 8px 14px; position: sticky; top: 0; z-index: 5;
  background: linear-gradient(180deg, rgba(7,10,19,0.98), rgba(7,10,19,0.85));
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--border);
}
.header-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 17px; letter-spacing: 0.5px; }
.brand { color: var(--text); }
.brand-accent { color: var(--cyan); }
.header-actions { display: flex; align-items: center; gap: 8px; }
.export-btn { width: 30px; height: 30px; }
.add-btn {
  width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
  background: var(--cyan); color: #0A0E1A; border: none; cursor: pointer;
}
.add-btn:hover { filter: brightness(1.1); }

.header-stats {
  display: flex; gap: 6px; padding: 8px 14px; overflow-x: auto;
  border-bottom: 1px solid var(--border); background: rgba(14,21,38,0.5);
}
.stat {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted);
  background: var(--panel-2); border: 1px solid var(--border); border-radius: 6px;
  padding: 4px 7px; display: flex; align-items: center; gap: 4px; white-space: nowrap;
}
.stat b { color: var(--text); font-size: 11px; }
.stat.ok-c b { color: var(--green); } .stat.bad-c b { color: var(--rose); }
.stat.amber-c b { color: var(--amber); } .stat.cyan-c b { color: var(--cyan); }

.content { flex: 1 1 auto; overflow-y: auto; padding: 12px 12px 20px 12px; }

.section-wrap {}
.section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.section-head h2 { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; margin: 0; }
.count-pill {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; background: var(--panel-2);
  border: 1px solid var(--border); color: var(--cyan); border-radius: 20px; padding: 2px 8px;
}
.empty-state {
  border: 1px dashed var(--border); border-radius: 10px; padding: 24px 14px; text-align: center;
  color: var(--muted); font-size: 12px;
}
.card-list { display: flex; flex-direction: column; gap: 10px; }

.card {
  background: var(--panel);
  border: 1px solid var(--border); border-radius: 10px; padding: 12px;
  position: relative;
}
.card-top { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.badge {
  font-family: 'JetBrains Mono', monospace; font-size: 9px; padding: 3px 7px; border-radius: 5px;
  border: 1px solid var(--border); color: var(--muted); text-transform: uppercase; letter-spacing: 0.4px;
}
.badge.cat { color: var(--cyan); border-color: var(--border); background: var(--panel-2); }
.badge.ok { color: var(--green); border-color: var(--border); background: var(--panel-2); }
.badge.bad { color: var(--rose); border-color: var(--border); background: var(--panel-2); }
.badge.hide { color: var(--amber); border-color: var(--border); background: var(--panel-2); }

.card-q p { margin: 0 0 6px 0; font-size: 13px; line-height: 1.45; }
.card-img { max-width: 100%; border-radius: 8px; border: 1px solid var(--border); display: block; margin: 6px 0; }
.question-toggle { cursor: pointer; border-radius: 7px; padding: 4px; margin: -4px; }
.question-toggle:hover, .question-toggle:focus { background: rgba(76,141,255,0.08); outline: none; }
.question-hint { display: block; color: var(--muted); font-family: 'JetBrains Mono', monospace; font-size: 9px; margin-top: 5px; }

.opt-list { display: flex; flex-direction: column; gap: 5px; margin: 6px 0; }
.opt-row {
  display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 7px;
  background: rgba(32,51,49,0.035); border: 1px solid var(--border); font-size: 12px;
}
.opt-row.opt-correct { border-color: var(--green); background: var(--panel-2); }
.opt-letter {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; width: 18px; height: 18px; flex: 0 0 auto;
  border-radius: 5px; background: var(--panel-2); display: flex; align-items: center; justify-content: center;
  color: var(--cyan); border: 1px solid var(--border);
}

.link-btn {
  background: none; border: none; color: var(--cyan); font-size: 11px; cursor: pointer; padding: 2px 0;
  font-family: 'JetBrains Mono', monospace;
}
.solution {
  margin-top: 6px; padding: 8px; border-radius: 8px; background: var(--panel-2);
  border: 1px solid var(--border); font-size: 12px; line-height: 1.4;
}
.solution p { margin: 0 0 6px 0; }
.muted { color: var(--muted); }

.card-actions { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
.icon-btn {
  width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--border); background: var(--panel-2);
  color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.visibility-btn {
  min-height: 28px; border-radius: 7px; border: 1px solid var(--border); background: var(--panel-2);
  color: var(--muted); display: inline-flex; align-items: center; justify-content: center; gap: 5px;
  padding: 0 8px; cursor: pointer; font-size: 10px; font-family: 'JetBrains Mono', monospace;
}
.visibility-btn:hover { color: var(--text); border-color: var(--cyan); }
.icon-btn:hover { color: var(--text); border-color: var(--cyan); }
.icon-btn.active-ok { color: var(--green); border-color: var(--green); background: var(--panel-2); }
.icon-btn.active-bad { color: var(--rose); border-color: var(--rose); background: var(--panel-2); }
.icon-btn.danger:hover { color: var(--rose); border-color: var(--rose); }

.navbar {
  display: flex; position: sticky; bottom: 0; z-index: 5;
  background: linear-gradient(0deg, rgba(7,10,19,0.98), rgba(7,10,19,0.85));
  border-top: 1px solid var(--border); backdrop-filter: blur(6px);
}
.nav-btn {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 9px 2px 8px 2px;
  background: none; border: none; color: var(--muted); cursor: pointer; font-size: 9px;
  font-family: 'JetBrains Mono', monospace; letter-spacing: 0.3px; position: relative;
}
.nav-btn.active { color: var(--cyan); }
.nav-btn.active::before {
  content: ''; position: absolute; top: 0; left: 25%; right: 25%; height: 2px; background: var(--cyan);
  border-radius: 2px;
}

.toast {
  position: fixed; bottom: 68px; left: 50%; transform: translateX(-50%); z-index: 50;
  background: var(--panel-2); border: 1px solid var(--border); color: var(--text); font-size: 11px;
  padding: 8px 14px; border-radius: 20px;
  font-family: 'JetBrains Mono', monospace;
}

.field { margin-bottom: 14px; }
.field-label {
  display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; color: var(--muted);
  margin-bottom: 6px; font-family: 'JetBrains Mono', monospace;
}
.input, .textarea {
  width: 100%; background: var(--panel-2); border: 1px solid var(--border); border-radius: 8px;
  color: var(--text); padding: 8px 10px; font-size: 13px; font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}
.input:focus, .textarea:focus { outline: none; border-color: var(--cyan); }
.textarea { resize: vertical; }
.hint { font-size: 10px; color: var(--muted); margin: 4px 0 0 0; }
.error-text { color: var(--rose); font-size: 11px; margin: 4px 0; }
.warn-text { color: var(--amber); font-size: 11px; margin-top: 8px; text-align: center; }

.quick-option-tools {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
}

.option-suffix-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: -2px 0 8px 0;
}

.option-suffix-input {
  width: 38px;
  height: 22px;
  padding: 0 4px;
  border-radius: 5px;
  border: 1px solid var(--border);
  background: var(--panel-2);
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  text-align: center;
  box-sizing: border-box;
}

.option-suffix-input:focus {
  outline: none;
  border-color: var(--cyan);
}

.option-suffix-hint {
  color: var(--muted);
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
}

.quick-option-btn {
  width: 22px;
  height: 22px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--panel-2);
  color: var(--cyan);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
}

.quick-option-btn:hover {
  border-color: var(--cyan);
  color: var(--text);
  background: rgba(76,141,255,0.10);
}

.quick-option-btn:active {
  transform: scale(0.94);
}

.option-edit-row { display: flex; gap: 8px; align-items: center; margin-bottom: 6px; }
.radio-dot {
  width: 26px; height: 26px; border-radius: 7px; flex: 0 0 auto; border: 1px solid var(--border);
  background: var(--panel-2); color: var(--muted); font-family: 'JetBrains Mono', monospace; font-size: 11px;
  cursor: pointer;
}
.radio-dot.checked { background: var(--green); color: #06110C; border-color: var(--green); }

.imgdrop {
  border: 1px dashed var(--border); border-radius: 8px; padding: 16px 10px; text-align: center;
  color: var(--muted); font-size: 11px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.imgdrop:hover { border-color: var(--cyan); color: var(--cyan); }
.imgpreview { position: relative; }
.imgpreview img { max-width: 100%; border-radius: 8px; border: 1px solid var(--border); display: block; }
.imgpreview-actions { display: flex; gap: 6px; margin-top: 6px; }

.btn {
  font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12px; border-radius: 8px; padding: 9px 14px;
  border: 1px solid var(--border); background: var(--panel-2); color: var(--text); cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
}
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary { background: var(--cyan); color: #0A0E1A; border-color: var(--cyan); }
.btn-primary:hover:not(:disabled) { filter: brightness(1.08); }
.btn-ghost { background: transparent; }
.btn-block { width: 100%; }
.btn-xs { font-size: 11px; padding: 6px 9px; }
.btn-ok-active { background: var(--panel-2); color: var(--green); border-color: var(--green); }
.btn-bad-active { background: var(--panel-2); color: var(--rose); border-color: var(--rose); }

.toggle-row { display: flex; gap: 6px; }
.toggle-btn {
  flex: 1; padding: 8px; border-radius: 8px; border: 1px solid var(--border); background: var(--panel-2);
  color: var(--muted); font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;
}
.toggle-btn.active { color: var(--cyan); border-color: var(--cyan); background: var(--panel-2); }

.test-setup, .test-running, .summary { display: flex; flex-direction: column; }
.setup-card {
  background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-top: 10px;
}
.setup-card h2 { font-family: 'Space Grotesk', sans-serif; font-size: 15px; margin: 0 0 6px 0; }
.setup-card p.muted { font-size: 11px; margin: 0 0 14px 0; }

.test-topbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
.progress-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); }
.tiny-timer { display: inline-flex; align-items: center; gap: 3px; padding: 3px 5px; border: 1px solid var(--border); border-radius: 5px; background: var(--panel-2); }
.tiny-timer-time { min-width: 42px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; line-height: 1; color: var(--text); text-align: center; }
.tiny-timer-btn { width: 20px; height: 20px; padding: 0; border: 0; border-radius: 3px; background: transparent; color: var(--muted); font-size: 10px; line-height: 20px; text-align: center; cursor: pointer; }
.tiny-timer-btn:hover:not(:disabled) { background: var(--border); color: var(--text); }
.tiny-timer-btn:disabled { opacity: 0.3; cursor: default; }
.hide-q-btn { color: var(--amber); }
.progress-track { height: 4px; border-radius: 3px; background: var(--panel-2); overflow: hidden; margin-bottom: 12px; }
.progress-fill { height: 100%; background: var(--cyan); }

.q-jump-row { margin-bottom: 12px; }
.q-jump-label {
  display: block; font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono', monospace;
  margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.4px;
}
.q-jump-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.q-jump-btn {
  width: 26px;padding: 1px; height: 26px; border-radius: 6px; border: 1px solid var(--border); background: var(--panel-2);
  color: var(--muted); font-family: 'JetBrains Mono', monospace; font-size: 11px; cursor: pointer;
}
.q-jump-btn:hover { border-color: var(--cyan); color: var(--text); }
.q-jump-btn.current { border-color: var(--cyan); background: var(--cyan); color: #0A0E1A; }
.q-jump-btn.ans-correct { border-color: var(--green); color: var(--green); }
.q-jump-btn.ans-wrong { border-color: var(--rose); color: var(--rose); }

.q-card .q-text { font-size: 14px; font-weight: 500; margin: 4px 0 8px 0; }
.test-opts .opt-row.selectable {
  width: 100%; text-align: left; cursor: pointer; color: var(--text); font-family: 'Inter', sans-serif;
}
.test-opts .opt-row.selectable:hover:not(:disabled) { border-color: var(--cyan); }
.opt-row.opt-picked { border-color: var(--cyan); background: var(--panel-2); }
.opt-row.opt-correct-answer { border-color: var(--green); background: var(--panel-2); }
.opt-row.opt-wrong-answer { border-color: var(--rose); background: var(--panel-2); }

.solution.reveal { margin-top: 10px; }
.solution-head { margin-bottom: 6px; }
.mark-row { display: flex; gap: 6px; margin-top: 8px; }

.test-nav { display: flex; justify-content: space-between; gap: 8px; margin-top: 12px; }

.summary { align-items: center; text-align: center; padding-top: 30px; }
.summary h2 { font-family: 'Space Grotesk', sans-serif; font-size: 18px; margin-bottom: 16px; }
.summary-grid { display: flex; gap: 10px; margin-bottom: 20px; width: 100%; }
.summary-stat {
  flex: 1; background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 14px 6px;
  display: flex; flex-direction: column; gap: 4px;
}
.summary-stat b { font-family: 'JetBrains Mono', monospace; font-size: 20px; }
.summary-stat span { font-size: 10px; color: var(--muted); }
.summary-stat.ok b { color: var(--green); } .summary-stat.bad b { color: var(--rose); } .summary-stat.neutral b { color: var(--muted); }
.summary-actions { width: 100%; }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(4,6,12,0.75); backdrop-filter: blur(3px);
  display: flex; align-items: flex-end; justify-content: center; z-index: 100;
}
.modal {
  background: var(--panel); border: 1px solid var(--border); border-radius: 16px 16px 0 0; width: 100%;
  max-width: 430px; max-height: 88vh; display: flex; flex-direction: column; box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
}
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 14px; border-bottom: 1px solid var(--border); }
.modal-head h2 { font-family: 'Space Grotesk', sans-serif; font-size: 14px; margin: 0; }
.modal-body { padding: 14px; overflow-y: auto; }
.modal-foot { display: flex; gap: 8px; padding: 12px 14px; border-top: 1px solid var(--border); }
.modal-foot .btn { flex: 1; }

.crop-modal .modal-body { display: flex; flex-direction: column; align-items: center; }
.crop-wrap { position: relative; display: inline-block; max-width: 100%; touch-action: none; }
.crop-wrap img { display: block; max-width: 100%; max-height: 60vh; user-select: none; }
.crop-box {
  position: absolute; border: 2px solid var(--cyan); box-shadow: 0 0 0 2000px rgba(4,6,12,0.55); cursor: move;
}
.crop-handle {
  position: absolute; right: -6px; bottom: -6px; width: 14px; height: 14px; border-radius: 3px;
  background: var(--cyan); cursor: se-resize;
}

/* visual refresh */
:root { background: #202b35; }
* { box-sizing: border-box; }
body { margin: 0; background: #202b35; }
.app {
  --bg: #202b35; --panel: #2c3a46; --panel-2: #354957; --border: #55707a;
  --cyan: #58b7b1; --green: #7acb9b; --rose: #ee806f; --amber: #e6b35b;
  --text: #f3e5cf; --muted: #b2c0bd;
  width: min(100%, 980px); max-width: 980px; background: var(--bg); color: var(--text);
  font-family: 'DM Sans', sans-serif; font-size: 14px; box-shadow: 0 0 80px rgba(42,49,44,.08);
}
.header { padding: 26px 32px 18px; background: rgba(32,43,53,.96); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); }
.header-title { font-family: 'Space Grotesk', sans-serif; font-size: 22px; letter-spacing: -.04em; }
.brand-accent { color: var(--cyan); }
.add-btn { width: 42px; height: 42px; border-radius: 50%; background: var(--amber); color: #202b35; box-shadow: none; transition: background .2s, transform .2s; }
.add-btn:hover { transform: rotate(5deg); background: #d19a43; }
.header-stats { gap: 9px; padding: 15px 32px; background: rgba(44,58,70,.94); border-bottom: 1px solid var(--border); }
.stat { font-size: 11px; background: #3b505d; border: 1px solid var(--border); border-radius: 999px; padding: 7px 11px; }
.stat b { font-family: 'Space Grotesk', sans-serif; font-size: 13px; }.stat.ok-c b { color: var(--green); }.stat.bad-c b { color: var(--rose); }.stat.amber-c b { color: var(--amber); }.stat.cyan-c b { color: var(--cyan); }
.content { padding: 28px 32px 36px; }
.section-head { margin-bottom: 16px; }.section-head h2 { font-family: 'Space Grotesk', sans-serif; font-size: 19px; letter-spacing: -.03em; }.count-pill { background: #e2f0ec; color: var(--cyan); border: 0; border-radius: 999px; padding: 5px 10px; }
.empty-state { border: 1px dashed #8f8c73; border-radius: 16px; padding: 40px 18px; background: rgba(86,91,83,.72); }.card-list { gap: 14px; }
.card { background: var(--panel); border: 1px solid var(--border); border-radius: 18px; padding: 20px; box-shadow: 0 8px 22px rgba(18,24,20,.2); transition: transform .2s, box-shadow .2s; }.card:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(18,24,20,.34); }
.badge { font-size: 10px; font-weight: 700; padding: 5px 9px; border-radius: 999px; border-color: transparent; }.badge.cat { color: #8bd0cc; background: #315d5e; }.badge.ok { color: #e7d98b; background: #625d37; }.badge.bad { color: #f1ae95; background: #70473d; }.badge.hide { color: #f0c87e; background: #695334; }
.card-q p { font-size: 16px; line-height: 1.5; font-weight: 500; }.question-toggle:hover, .question-toggle:focus { background: #f4f8f4; }
.opt-list { gap: 7px; margin: 12px 0; }.opt-row { padding: 10px 12px; border-radius: 11px; background: var(--panel-2); border-color: var(--border); font-size: 13px; }.opt-row.opt-correct { border-color: var(--green); background: #6e693c; }.opt-letter { width: 24px; height: 24px; border-radius: 8px; background: #858573; color: #f0c87e; border: 0; }
.link-btn { color: var(--cyan); font-weight: 700; }.solution { padding: 12px; border-radius: 12px; background: #3b505d; border-color: var(--border); color: var(--text); font-size: 13px; }
.card-actions { gap: 7px; margin-top: 15px; }.icon-btn, .visibility-btn { border-radius: 9px; background: var(--panel-2); border-color: var(--border); }.visibility-btn:hover, .icon-btn:hover { color: var(--cyan); border-color: var(--cyan); }
.navbar { background: rgba(44,58,70,.96); border-top-color: var(--border); backdrop-filter: blur(14px); padding: 5px 18px 8px; }.nav-btn { padding: 10px 2px 7px; font-size: 10px; font-family: 'DM Sans', sans-serif; font-weight: 600; }.nav-btn.active { color: var(--amber); }.nav-btn.active::before { top: -5px; height: 3px; background: var(--amber); }
.toast { bottom: 78px; background: var(--text); color: #e8eee6; padding: 10px 16px; border-radius: 999px; box-shadow: 0 8px 20px rgba(23,39,45,.2); }
.field-label { font-size: 11px; font-weight: 700; color: #d8cdb5; font-family: 'DM Sans', sans-serif; letter-spacing: 0; }.input, .textarea { background: #77796b; border-color: var(--border); border-radius: 10px; padding: 11px 12px; font-family: 'DM Sans', sans-serif; }.input:focus, .textarea:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(47,143,145,.25); }
.radio-dot { width: 32px; height: 32px; border-radius: 9px; }.radio-dot.checked { background: var(--green); color: #3f4540; border-color: var(--green); }.imgdrop { border-color: #8f8c73; border-radius: 12px; padding: 20px 12px; }.imgdrop:hover { border-color: var(--cyan); color: #8bd0cc; }
.btn { font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px; border-radius: 10px; padding: 10px 15px; }.btn-primary { background: var(--amber); color: #202b35; border-color: var(--amber); box-shadow: none; }.btn-primary:hover:not(:disabled) { transform: translateY(-1px); background: #d19a43; }.toggle-btn.active { color: #f3e5cf; border-color: var(--cyan); background: #285b61; }
.setup-card { background: var(--panel); border-color: var(--border); border-radius: 20px; padding: 27px; width: min(100%, 620px); box-shadow: 0 12px 28px rgba(10,18,25,.18); }.setup-card h2 { font-family: 'Space Grotesk', sans-serif; font-size: 26px; letter-spacing: -.04em; }.progress-track { height: 7px; background: #354957; }.progress-fill { background: var(--cyan); border-radius: 8px; }.q-card .q-text { font-size: 22px; line-height: 1.35; }.test-opts .opt-row.selectable:hover:not(:disabled) { border-color: var(--cyan); background: #285b61; color: var(--text); }.opt-row.opt-picked { border-color: var(--cyan); background: #285b61; color: var(--text); }.opt-row.opt-correct-answer { border-color: var(--green); background: #35634f; color: var(--text); }.opt-row.opt-wrong-answer { border-color: var(--rose); background: #713f43; color: var(--text); }
.summary h2 { font-family: 'Space Grotesk', sans-serif; font-size: 30px; }.summary-stat { background: var(--panel); border-color: var(--border); border-radius: 16px; padding: 18px 8px; }.summary-stat b { font-family: 'Space Grotesk', sans-serif; font-size: 28px; }.summary-stat.ok b { color: var(--green); }.summary-stat.bad b { color: var(--rose); }
.modal-overlay { background: rgba(23,39,45,.42); backdrop-filter: blur(7px); }.modal { background: var(--panel); border-color: var(--border); border-radius: 22px 22px 0 0; max-width: 560px; box-shadow: 0 -18px 60px rgba(23,39,45,.2); }.modal-head { padding: 18px 22px; }.modal-head h2 { font-family: 'Space Grotesk', sans-serif; font-size: 19px; }.modal-body { padding: 22px; }.modal-foot { padding: 15px 22px; }
@media (max-width: 640px) { .header { padding: 20px 18px 14px; }.header-stats { padding: 12px 18px; }.content { padding: 22px 18px 28px; }.card { padding: 16px; border-radius: 15px; }.setup-card { padding: 21px; }.q-card .q-text { font-size: 19px; }.navbar { padding-left: 6px; padding-right: 6px; } }

/* final color system */
:root { background: #241d24; }
body { background: #241d24; }
.app {
  --bg: #241d24; --panel: #3a303a; --panel-2: #4b3d48; --border: #745b68;
  --cyan: #67c7dd; --green: #a8d86e; --rose: #f08a6d; --amber: #f0b653;
  --text: #f4e7d2; --muted: #c4b4b2;
  background: var(--bg); color: var(--text);
}
.header { background: rgba(36,29,36,.97); border-color: var(--border); }
.brand-accent { color: var(--cyan); }
.add-btn { background: var(--amber); color: #241d24; box-shadow: none; }
.add-btn:hover { background: #d99a3e; box-shadow: none; }
.header-stats { background: rgba(58,48,58,.96); border-color: var(--border); }
.stat { background: #51434e; border-color: var(--border); color: var(--muted); }
.stat b { color: var(--text); }.stat.ok-c b { color: var(--green); }.stat.bad-c b { color: var(--rose); }.stat.amber-c b { color: var(--amber); }.stat.cyan-c b { color: var(--cyan); }
.section-head h2 { color: var(--text); }.count-pill { background: #354e5b; color: var(--cyan); }
.empty-state { border-color: #806878; background: #332b34; color: var(--muted); }
.card { background: var(--panel); border-color: var(--border); box-shadow: 0 8px 22px rgba(12,8,13,.28); }.card:hover { box-shadow: 0 12px 28px rgba(12,8,13,.42); }
.badge.cat { color: #9be1ed; background: #315768; }.badge.ok { color: #c8ed91; background: #49613c; }.badge.bad { color: #ffb09a; background: #6d403e; }.badge.hide { color: #ffd77d; background: #66502f; }
.question-toggle:hover, .question-toggle:focus { background: #463846; }
.opt-row { background: var(--panel-2); border-color: var(--border); color: var(--text); }.opt-row.opt-correct { background: #49613c; border-color: var(--green); }.opt-letter { background: #5c4e59; color: var(--cyan); }
.link-btn { color: var(--cyan); }.solution { background: #302c38; border-color: #665a73; color: var(--text); }
.icon-btn, .visibility-btn { background: var(--panel-2); border-color: var(--border); color: var(--muted); }.visibility-btn:hover, .icon-btn:hover { color: var(--cyan); border-color: var(--cyan); }.icon-btn.active-ok { color: var(--green); border-color: var(--green); }.icon-btn.active-bad { color: var(--rose); border-color: var(--rose); }
.navbar { background: rgba(58,48,58,.98); border-color: var(--border); }.nav-btn { color: var(--muted); }.nav-btn.active { color: var(--amber); }.nav-btn.active::before { background: var(--amber); }
.toast { background: #151116; color: var(--text); border: 1px solid var(--border); }
.field-label { color: #dfc7b7; }.input, .textarea { background: #51434e; border-color: var(--border); color: var(--text); }.input:focus, .textarea:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(103,199,221,.2); }
.radio-dot { background: var(--panel-2); border-color: var(--border); color: var(--muted); }.radio-dot.checked { background: var(--green); color: #241d24; border-color: var(--green); }.imgdrop { border-color: var(--border); color: var(--muted); }.imgdrop:hover { border-color: var(--cyan); color: var(--cyan); }
.btn { background: var(--panel-2); border-color: var(--border); color: var(--text); }.btn-primary { background: var(--amber); border-color: var(--amber); color: #241d24; box-shadow: none; }.btn-primary:hover:not(:disabled) { background: #d99a3e; }.btn-ghost { background: transparent; }.btn-ok-active { color: var(--green); border-color: var(--green); background: #364c35; }.btn-bad-active { color: var(--rose); border-color: var(--rose); background: #603b3d; }
.toggle-btn { background: var(--panel-2); border-color: var(--border); color: var(--muted); }.toggle-btn.active { color: var(--text); border-color: var(--cyan); background: #315768; }
.setup-card { background: var(--panel); border-color: var(--border); box-shadow: 0 12px 28px rgba(12,8,13,.26); }.progress-track { background: #4b3d48; }.progress-fill { background: var(--cyan); }.q-card .q-text { color: var(--text); }
.test-opts .opt-row.selectable:hover:not(:disabled) { border-color: var(--cyan); background: #315768; color: var(--text); }.opt-row.opt-picked { background: #315768; border-color: var(--cyan); }.opt-row.opt-correct-answer { background: #49613c; border-color: var(--green); }.opt-row.opt-wrong-answer { background: #6d403e; border-color: var(--rose); }
.summary-stat { background: var(--panel); border-color: var(--border); }.summary-stat.ok b { color: var(--green); }.summary-stat.bad b { color: var(--rose); }.summary-stat.neutral b { color: var(--muted); }
.modal-overlay { background: rgba(20,14,21,.72); }.modal { background: var(--panel); border-color: var(--border); }.modal-head, .modal-foot { border-color: var(--border); }
.topic-filter { display: flex; align-items: center; gap: 10px; margin: -4px 0 16px; padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; background: #332b34; flex-wrap: wrap; }.topic-filter .field-label { margin: 0; white-space: nowrap; }.topic-select { max-width: 240px; padding: 8px 10px; cursor: pointer; }.topic-select option { background: #3a303a; color: #f4e7d2; }
.search-input { max-width: 260px; flex: 1 1 180px; }
.q-jump-row { padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; background: #332b34; }
@media (max-width: 640px) { .topic-filter { align-items: stretch; flex-direction: column; gap: 6px; }.topic-select { max-width: none; width: 100%; }.search-input { max-width: none; max-height: 30px; } }

.test-source-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 7px;
}
.source-choice {
  text-align: left;
  border: 1px solid var(--border);
  background: var(--panel-2);
  color: var(--text);
  border-radius: 8px;
  padding: 9px;
  cursor: pointer;
}
.source-choice:hover, .source-choice.selected {
  border-color: var(--cyan);
  background: rgba(76,141,255,0.10);
}
.source-title {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 11px;
  margin-bottom: 3px;
}
.source-desc {
  display: block;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.35;
}
.topic-select-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
}
.topic-select-head .field-label { margin-bottom: 0; }
.topic-actions { display: flex; gap: 8px; }
.topic-actions .link-btn:disabled { opacity: 0.35; cursor: default; }
.topic-check-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  max-height: 230px;
  overflow-y: auto;
  padding: 2px;
}
.topic-check {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  border: 1px solid var(--border);
  background: var(--panel-2);
  border-radius: 7px;
  padding: 7px 8px;
  cursor: pointer;
  color: var(--muted);
}
.topic-check.checked {
  color: var(--text);
  border-color: var(--cyan);
  background: rgba(76,141,255,0.10);
}
.topic-check input {
  width: 14px;
  height: 14px;
  accent-color: var(--cyan);
  flex: 0 0 auto;
}
.topic-check span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.test-selection-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0 10px;
}
.test-selection-summary span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--muted);
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 5px 7px;
}
.test-selection-summary b { color: var(--text); }

@media (max-width: 560px) {
  .test-source-grid { grid-template-columns: 1fr; }
  .topic-check-grid { grid-template-columns: 1fr; }
}
`;

if (typeof document !== "undefined" && document.getElementById("root")) {
  ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
}