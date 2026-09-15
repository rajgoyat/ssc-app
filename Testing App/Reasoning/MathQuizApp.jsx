const { useState, useEffect, useRef } = React;

function Icon({ symbol, size = 16 }) {
  return React.createElement(
    "span",
    {
      style: {
        display: "inline-block",
        width: size,
        textAlign: "center",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        lineHeight: 1,
      },
    },
    symbol
  );
}

const iconSymbols = {
  Play: "▶",
  CheckCircle2: "✓",
  XCircle: "✕",
  EyeOff: "◌",
  Eye: "◉",
  ListChecks: "☷",
  Plus: "＋",
  X: "×",
  Pencil: "✎",
  Copy: "⧉",
  Trash2: "⌫",
  Upload: "↥",
  ChevronLeft: "‹",
  ChevronRight: "›",
  Shuffle: "⤨",
  ListOrdered: "☷",
  RotateCcw: "↶",
};

const icons = Object.fromEntries(
  Object.entries(iconSymbols).map(([name, symbol]) => [
    name,
    (props) => <Icon {...props} symbol={symbol} />,
  ])
);

const {
  Play,
  CheckCircle2,
  XCircle,
  EyeOff,
  Eye,
  ListChecks,
  Plus,
  X,
  Pencil,
  Copy,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  RotateCcw,
} = icons;

/* ---------------------------------- helpers ---------------------------------- */

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const SUPERSCRIPTS = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

const SUBSCRIPTS = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
};

function formatMathText(value) {
  return String(value || "")
    .replace(/\broot-([0-9]+)\b/gi, (_, number) => "√" + number)
    .replace(
      /\b(\d+)\s*&\s*(\d+)\s*\/\s*(\d+)\b/g,
      (_, whole, numerator, denominator) =>
        whole +
        [...numerator].map((digit) => SUPERSCRIPTS[digit]).join("") +
        "⁄" +
        [...denominator].map((digit) => SUBSCRIPTS[digit]).join("")
    )
    .replace(/\^([0-9]+)/g, (_, power) =>
      [...power].map((digit) => SUPERSCRIPTS[digit]).join("")
    );
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

    return (
      <React.Fragment key={index}>
        {formatMathText(part)}
      </React.Fragment>
    );
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

  const allQuestions = Object.values(topicData).flatMap((topicQuestions) =>
    Array.isArray(topicQuestions) ? topicQuestions : []
  );

  if (allQuestions.length > 0) {
    return allQuestions.map((question, index) => ({
      ...question,
      id: question.id || `topic-${index}`,
      order:
        typeof question.order === "number" ? question.order : index,
      attemptStatus: question.attemptStatus || "unattempted",
      testAllowed: question.testAllowed !== false,
    }));
  }

  return [
    {
      id: "s1",
      order: 0,
      category: "Algebra",
      questionText:
        "If (x + y)^2 = xy + 8 and x^3 - y^3 = 96, then what is the value of x - y?",
      questionImage: null,
      options: ["12", "20", "-12", "16"],
      correctIndex: 0,
      solutionText:
        "From (x+y)^2 = x^2 + 2xy + y^2 = xy + 8, we get x^2 + xy + y^2 = 8. Using x^3 - y^3 = (x-y)(x^2 + xy + y^2), substitute: x^3 - y^3 = (x-y) × 8. Since x^3 - y^3 = 96, we get 8(x-y) = 96, so x-y = 12.",
      solutionImage: null,
      attemptStatus: "unattempted",
      testAllowed: true,
    },

    {
      id: "s2",
      order: 1,
      category: "Algebra",
      questionText: "Solve for x: 2x + 5 = 15",
      questionImage: null,
      options: ["3", "5", "7", "10"],
      correctIndex: 1,
      solutionText:
        "Subtract 5 from both sides: 2x = 10. Divide both sides by 2: x = 5.",
      solutionImage: null,
      attemptStatus: "unattempted",
      testAllowed: true,
    },

    {
      id: "s3",
      order: 2,
      category: "Geometry",
      questionText:
        "Find the area of a circle with radius 7 cm. (Use π = 22/7)",
      questionImage: null,
      options: ["144 cm²", "150 cm²", "154 cm²", "160 cm²"],
      correctIndex: 2,
      solutionText: "Area = πr² = (22/7) × 7 × 7 = 154 cm².",
      solutionImage: null,
      attemptStatus: "unattempted",
      testAllowed: true,
    },

    {
      id: "s4",
      order: 3,
      category: "Percentage",
      questionText: "What is 15% of 200?",
      questionImage: null,
      options: ["20", "25", "30", "35"],
      correctIndex: 2,
      solutionText: "15% of 200 = (15/100) × 200 = 30.",
      solutionImage: null,
      attemptStatus: "unattempted",
      testAllowed: true,
    },
  ];
}

function createQuestionStorage() {
  const localStorageAdapter = window.storage || {
    get: async (key) => window.localStorage.getItem(key),
    set: async (key, value) =>
      window.localStorage.setItem(key, value),
    remove: async (key) => window.localStorage.removeItem(key),
  };

  return {
    async get(key) {
      try {
        const response = await fetch("/api/questions", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Question API is unavailable");
        }

        const payload = await response.json();

        return JSON.stringify(
          Array.isArray(payload.questions) ? payload.questions : []
        );
      } catch (error) {
        return localStorageAdapter.get(key);
      }
    },

    async set(key, value) {
      try {
        const response = await fetch("/api/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: value,
        });

        if (!response.ok) {
          throw new Error("Could not save questions");
        }
      } catch (error) {
        await localStorageAdapter.set(key, value);
      }
    },

    async delete(key, id) {
      try {
        const response = await fetch(
          `/api/questions?id=${encodeURIComponent(id)}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Could not delete question");
        }

        const payload = await response.json();

        const questions = Array.isArray(payload.questions)
          ? payload.questions
          : [];

        await localStorageAdapter.set(
          key,
          JSON.stringify(questions)
        );

        return questions;
      } catch (error) {
        const current = JSON.parse(
          (await localStorageAdapter.get(key)) || "[]"
        );

        const remaining = current.filter(
          (question) =>
            String(question.id) !== String(id)
        );

        await localStorageAdapter.set(
          key,
          JSON.stringify(remaining)
        );

        return remaining;
      }
    },
  };
}

function defaultOptions() {
  return ["1", "2", "3", "4"];
}

function emptyDraft() {
  return {
    category: "",
    questionText: "",
    questionImage: null,
    options: defaultOptions(),
    correctIndex: 0,
    solutionText: "",
    solutionImage: null,
    special: false,
  };
}

function normalizeQuestion(question) {
  const options =
    Array.isArray(question.options) &&
    question.options.length
      ? question.options
      : defaultOptions();

  const parsedIndex = Number(question.correctIndex);

  const correctIndex =
    Number.isInteger(parsedIndex) &&
    parsedIndex >= 0 &&
    parsedIndex < options.length
      ? parsedIndex
      : 0;

  return {
    ...question,
    options,
    correctIndex,
    special: question.special === true,
  };
}

/* ---------------------------------- navbar sections ---------------------------------- */

const SECTIONS = [
  {
    key: "test",
    label: "Test",
    icon: Play,
  },

  {
    key: "all",
    label: "All",
    icon: ListOrdered,
  },

  {
    key: "correct",
    label: "Weak",
    icon: CheckCircle2,
  },

  {
    key: "hidden",
    label: "Hidden",
    icon: EyeOff,
  },

  {
    key: "allowed",
    label: "Allowed",
    icon: ListChecks,
  },

  {
    key: "special",
    label: "Special",
    icon: ListChecks,
  },
];

/* ---------------------------------- image crop modal ---------------------------------- */

function ImageCropModal({
  src,
  onCancel,
  onApply,
}) {
  const imgRef = useRef(null);

  const [disp, setDisp] = useState(null);
  const [crop, setCrop] = useState(null);

  const dragRef = useRef(null);

  function onImgLoad(e) {
    const rect =
      e.target.getBoundingClientRect();

    const d = {
      w: rect.width,
      h: rect.height,
    };

    setDisp(d);

    setCrop({
      x: 0,
      y: 0,
      w: d.w,
      h: d.h,
    });
  }

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  function onDragMove(e) {
    if (!dragRef.current || !disp) return;

    e.preventDefault();

    const point = e.touches
      ? e.touches[0]
      : e;

    const dx =
      point.clientX -
      dragRef.current.startX;

    const dy =
      point.clientY -
      dragRef.current.startY;

    const { mode, orig } =
      dragRef.current;

    if (mode === "move") {
      const nx = clamp(
        orig.x + dx,
        0,
        disp.w - orig.w
      );

      const ny = clamp(
        orig.y + dy,
        0,
        disp.h - orig.h
      );

      setCrop((c) => ({
        ...c,
        x: nx,
        y: ny,
      }));
    } else if (mode === "resize") {
      const nw = clamp(
        orig.w + dx,
        30,
        disp.w - orig.x
      );

      const nh = clamp(
        orig.h + dy,
        30,
        disp.h - orig.y
      );

      setCrop((c) => ({
        ...c,
        w: nw,
        h: nh,
      }));
    }
  }

  function endDrag() {
    dragRef.current = null;

    window.removeEventListener(
      "mousemove",
      onDragMove
    );

    window.removeEventListener(
      "mouseup",
      endDrag
    );

    window.removeEventListener(
      "touchmove",
      onDragMove
    );

    window.removeEventListener(
      "touchend",
      endDrag
    );
  }

  function startDrag(mode, e) {
    e.preventDefault();
    e.stopPropagation();

    const point = e.touches
      ? e.touches[0]
      : e;

    dragRef.current = {
      mode,
      startX: point.clientX,
      startY: point.clientY,
      orig: { ...crop },
    };

    window.addEventListener(
      "mousemove",
      onDragMove
    );

    window.addEventListener(
      "mouseup",
      endDrag
    );

    window.addEventListener(
      "touchmove",
      onDragMove,
      {
        passive: false,
      }
    );

    window.addEventListener(
      "touchend",
      endDrag
    );
  }

  function applyCrop() {
    if (
      !crop ||
      !disp ||
      !imgRef.current
    ) {
      onCancel();
      return;
    }

    const img = imgRef.current;

    const scaleX =
      img.naturalWidth / disp.w;

    const scaleY =
      img.naturalHeight / disp.h;

    const sx = crop.x * scaleX;
    const sy = crop.y * scaleY;
    const sw = crop.w * scaleX;
    const sh = crop.h * scaleY;

    const canvas =
      document.createElement("canvas");

    canvas.width = Math.max(
      1,
      Math.round(sw)
    );

    canvas.height = Math.max(
      1,
      Math.round(sh)
    );

    const ctx =
      canvas.getContext("2d");

    ctx.drawImage(
      img,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      canvas.width,
      canvas.height
    );

    onApply(
      canvas.toDataURL("image/png")
    );
  }

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
    >
      <div
        className="modal crop-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-head">
          <h2>Crop Image</h2>

          <button
            className="icon-btn"
            onClick={onCancel}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="crop-wrap">
            <img
              ref={imgRef}
              src={src}
              onLoad={onImgLoad}
              alt="to crop"
              draggable={false}
            />

            {crop && (
              <div
                className="crop-box"
                style={{
                  left: crop.x,
                  top: crop.y,
                  width: crop.w,
                  height: crop.h,
                }}
                onMouseDown={(e) =>
                  startDrag(
                    "move",
                    e
                  )
                }
                onTouchStart={(e) =>
                  startDrag(
                    "move",
                    e
                  )
                }
              >
                <div
                  className="crop-handle"
                  onMouseDown={(e) =>
                    startDrag(
                      "resize",
                      e
                    )
                  }
                  onTouchStart={(e) =>
                    startDrag(
                      "resize",
                      e
                    )
                  }
                />
              </div>
            )}
          </div>

          <p className="hint">
            Drag the box to move it,
            drag the corner handle to
            resize.
          </p>
        </div>

        <div className="modal-foot">
          <button
            className="btn btn-ghost"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={applyCrop}
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- image field ---------------------------------- */

function ImageField({
  label,
  value,
  onChange,
}) {
  const fileRef = useRef(null);

  const [cropSrc, setCropSrc] =
    useState(null);

  function handleFile(file) {
    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = () =>
      setCropSrc(reader.result);

    reader.readAsDataURL(file);
  }

  function handlePaste(e) {
    const items =
      (e.clipboardData &&
        e.clipboardData.items) ||
      [];

    for (const item of items) {
      if (
        item.type &&
        item.type.startsWith(
          "image/"
        )
      ) {
        handleFile(
          item.getAsFile()
        );

        e.preventDefault();
        break;
      }
    }
  }

  return (
    <div className="field">
      <label className="field-label">
        {label}
      </label>

      {value ? (
        <div className="imgpreview">
          <img
            src={value}
            alt=""
          />

          <div className="imgpreview-actions">
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() =>
                setCropSrc(value)
              }
            >
              <Pencil size={12} />
              Edit
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() =>
                onChange(null)
              }
            >
              <Trash2 size={12} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className="imgdrop"
          tabIndex={0}
          onPaste={handlePaste}
          onClick={(e) =>
            e.currentTarget.focus()
          }
        >
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() =>
              fileRef.current &&
              fileRef.current.click()
            }
          >
            <Upload size={14} />
            Choose image
          </button>

          <span>
            Click here to paste an
            image (Ctrl/Cmd+V), or
            choose a file
          </span>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{
          display: "none",
        }}
        onChange={(e) => {
          handleFile(
            e.target.files[0]
          );

          e.target.value = "";
        }}
      />

      {cropSrc && (
        <ImageCropModal
          src={cropSrc}
          onCancel={() =>
            setCropSrc(null)
          }
          onApply={(dataUrl) => {
            onChange(dataUrl);
            setCropSrc(null);
          }}
        />
      )}
    </div>
  );
}

/* ---------------------------------- editor ---------------------------------- */

function QuestionEditorModal({
  initial,
  topics,
  onCancel,
  onSave,
}) {
  const [draft, setDraft] =
    useState(() =>
      initial
        ? JSON.parse(
            JSON.stringify(initial)
          )
        : emptyDraft()
    );

  const [error, setError] =
    useState("");

  const [
    optionSuffix,
    setOptionSuffix,
  ] = useState("");

  function applyOptionSuffix(
    options,
    suffix
  ) {
    const cleanSuffix =
      String(suffix ?? "");

    if (!cleanSuffix) {
      return options.map((o) =>
        String(o)
      );
    }

    return options.map((o) => {
      const value = String(
        o ?? ""
      );

      return value.endsWith(
        cleanSuffix
      )
        ? value
        : value + cleanSuffix;
    });
  }

  function changeOptionSuffix(
    value
  ) {
    const nextSuffix =
      String(value ?? "");

    setOptionSuffix(nextSuffix);

    setDraft((d) => {
      const previousSuffix =
        optionSuffix;

      const options =
        d.options.map((o) => {
          let value = String(
            o ?? ""
          );

          if (
            previousSuffix &&
            value.endsWith(
              previousSuffix
            )
          ) {
            value = value.slice(
              0,
              -previousSuffix.length
            );
          }

          return nextSuffix
            ? value +
                nextSuffix
            : value;
        });

      return {
        ...d,
        options,
      };
    });
  }

  function updateOption(i, val) {
    setDraft((d) => {
      const options = [
        ...d.options,
      ];

      options[i] = val;

      return {
        ...d,
        options,
      };
    });
  }

  function generateOptions(type) {
    let options = [];

    if (type === "number") {
      const values = new Set();

      while (values.size < 4) {
        values.add(
          String(
            Math.floor(
              Math.random() *
                100
            ) + 1
          )
        );
      }

      options = [...values];
    }

    if (type === "decimal") {
      const values = new Set();

      while (values.size < 4) {
        values.add(
          (
            Math.floor(
              Math.random() *
                9999
            ) / 100
          ).toFixed(2)
        );
      }

      options = [...values];
    }

    if (type === "letter") {
      options = [
        "A",
        "B",
        "C",
        "D",
      ];
    }

    if (type === "digit") {
      const values = new Set();

      while (values.size < 4) {
        values.add(
          String(
            Math.floor(
              Math.random() *
                9
            ) + 1
          )
        );
      }

      options = [...values];
    }

    setDraft((d) => ({
      ...d,
      options:
        applyOptionSuffix(
          options,
          optionSuffix
        ),
    }));
  }

  function handleSave() {
    const topic =
      draft.category.trim();

    const hasQ =
      draft.questionText.trim() ||
      draft.questionImage;

    const optsFilled =
      draft.options.every((o) =>
        String(o).trim()
      );

    if (!topic) {
      setError(
        "Add a topic before saving the question."
      );
      return;
    }

    if (!hasQ) {
      setError(
        "Add question text or a question image."
      );
      return;
    }

    if (!optsFilled) {
      setError(
        "Fill in all 4 options."
      );
      return;
    }

    const clean = {
      ...draft,

      category: topic,

      questionText:
        draft.questionText.trim(),

      options: draft.options.map(
        (o) => String(o).trim()
      ),

      correctIndex: Number(
        draft.correctIndex
      ),

      solutionText:
        draft.solutionText.trim(),
    };

    onSave(clean);
  }

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
    >
      <div
        className="modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-head">
          <h2>
            {initial
              ? "Edit Question"
              : "New Question"}
          </h2>

          <button
            className="icon-btn"
            onClick={onCancel}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label className="field-label">
              Topic
            </label>

            <input
              className="input"
              list="question-topics"
              value={draft.category}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  category:
                    e.target.value,
                }))
              }
              placeholder="Select an existing topic or type a new one"
            />

            <datalist id="question-topics">
              {topics.map(
                (topic) => (
                  <option
                    key={topic}
                    value={topic}
                  />
                )
              )}
            </datalist>
          </div>

          <div className="field">
            <label className="field-label">
              Question Text
            </label>

            <textarea
              className="textarea"
              rows={3}
              value={
                draft.questionText
              }
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  questionText:
                    e.target.value,
                }))
              }
              placeholder="Type the question..."
            />
          </div>

          <ImageField
            label="Question Image (optional)"
            value={
              draft.questionImage
            }
            onChange={(img) =>
              setDraft((d) => ({
                ...d,
                questionImage:
                  img,
              }))
            }
          />

          <div className="field">
            <label className="field-label">
              Options
            </label>

            <div className="quick-option-tools">
              <button
                type="button"
                className="quick-option-btn"
                onClick={() =>
                  generateOptions(
                    "number"
                  )
                }
              >
                2
              </button>

              <button
                type="button"
                className="quick-option-btn"
                onClick={() =>
                  generateOptions(
                    "decimal"
                  )
                }
              >
                .
              </button>

              <button
                type="button"
                className="quick-option-btn"
                onClick={() =>
                  generateOptions(
                    "letter"
                  )
                }
              >
                a
              </button>

              <button
                type="button"
                className="quick-option-btn"
                onClick={() =>
                  generateOptions(
                    "digit"
                  )
                }
              >
                1
              </button>
            </div>

            <div className="option-suffix-row">
              <input
                type="text"
                className="option-suffix-input"
                value={
                  optionSuffix
                }
                onChange={(e) =>
                  changeOptionSuffix(
                    e.target.value
                  )
                }
                placeholder="%"
              />

              <span className="option-suffix-hint">
                append to all
                options
              </span>
            </div>

            {draft.options.map(
              (opt, i) => (
                <div
                  className="option-edit-row"
                  key={i}
                >
                  <button
                    type="button"
                    className={
                      "radio-dot" +
                      (draft.correctIndex ===
                      i
                        ? " checked"
                        : "")
                    }
                    onClick={() =>
                      setDraft(
                        (d) => ({
                          ...d,
                          correctIndex:
                            i,
                        })
                      )
                    }
                  >
                    {String.fromCharCode(
                      65 + i
                    )}
                  </button>

                  <input
                    className="input"
                    value={opt}
                    onChange={(e) =>
                      updateOption(
                        i,
                        e.target
                          .value
                      )
                    }
                    placeholder={
                      "Option " +
                      String.fromCharCode(
                        65 + i
                      )
                    }
                  />
                </div>
              )
            )}
          </div>

          <div className="field">
            <label className="field-label">
              Solution
            </label>

            <textarea
              className="textarea"
              rows={3}
              value={
                draft.solutionText
              }
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  solutionText:
                    e.target.value,
                }))
              }
              placeholder="Explain the solution..."
            />
          </div>

          <ImageField
            label="Solution Image (optional)"
            value={
              draft.solutionImage
            }
            onChange={(img) =>
              setDraft((d) => ({
                ...d,
                solutionImage:
                  img,
              }))
            }
          />

          <div className="field">
            <label className="topic-check">
              <input
                type="checkbox"
                checked={
                  draft.special ===
                  true
                }
                onChange={(e) =>
                  setDraft(
                    (d) => ({
                      ...d,
                      special:
                        e.target
                          .checked,
                    })
                  )
                }
              />

              <span>
                Special /
                Important Question
              </span>
            </label>
          </div>

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}
        </div>

        <div className="modal-foot">
          <button
            className="btn btn-ghost"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSave}
          >
            Save Question
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- question card ---------------------------------- */

function QuestionCard({
  q,
  onMarkCorrect,
  onMarkWrong,
  onToggleAllow,
  onCopy,
  onEdit,
  onDelete,
  showStatusActions = true,
  showWrongAction = true,
}) {
  const [
    showSolution,
    setShowSolution,
  ] = useState(false);

  const [
    showOptions,
    setShowOptions,
  ] = useState(false);

  return (
    <div className="card">
      <div className="card-top">
        <span className="badge cat">
          {q.category ||
            "General"}
        </span>

        {q.attemptStatus ===
          "correct" && (
          <span className="badge ok">
            Weak
          </span>
        )}

        {q.attemptStatus ===
          "wrong" && (
          <span className="badge bad">
            Wrong
          </span>
        )}

        {!q.testAllowed && (
          <span className="badge hide">
            Hidden
          </span>
        )}

        {q.special && (
          <span className="badge special-badge">
            Special
          </span>
        )}
      </div>

      <div
        className="card-q question-toggle"
        onClick={() =>
          setShowOptions(
            (shown) => !shown
          )
        }
        role="button"
        tabIndex={0}
      >
        {q.questionText && (
          <p>
            {formatMathText(
              q.questionText
            )}
          </p>
        )}

        {q.questionImage && (
          <img
            className="card-img"
            src={
              q.questionImage
            }
            alt="question"
          />
        )}

        <span className="question-hint">
          {showOptions
            ? "Click question to hide options"
            : "Click question to show options"}
        </span>
      </div>

      {showOptions && (
        <div className="opt-list">
          {q.options.map(
            (opt, i) => (
              <div
                key={i}
                className={
                  "opt-row" +
                  (i ===
                  q.correctIndex
                    ? " opt-correct"
                    : "")
                }
              >
                <span className="opt-letter">
                  {String.fromCharCode(
                    65 + i
                  )}
                </span>

                <span>
                  {formatMathText(
                    opt
                  )}
                </span>
              </div>
            )
          )}
        </div>
      )}

      <button
        type="button"
        className="link-btn"
        onClick={() =>
          setShowSolution(
            (s) => !s
          )
        }
      >
        {showSolution
          ? "Hide solution"
          : "Show solution"}
      </button>

      {showSolution && (
        <div className="solution">
          {q.solutionText && (
            <p>
              {renderTextWithClickableLinks(
                q.solutionText
              )}
            </p>
          )}

          {q.solutionImage && (
            <img
              className="card-img"
              src={
                q.solutionImage
              }
              alt="solution"
            />
          )}

          {!q.solutionText &&
            !q.solutionImage && (
              <p className="muted">
                No solution
                provided.
              </p>
            )}
        </div>
      )}

      <div className="card-actions">
        {showStatusActions && (
          <>
            <button
              className={
                "icon-btn" +
                (q.attemptStatus ===
                "correct"
                  ? " active-ok"
                  : "")
              }
              onClick={
                onMarkCorrect
              }
              title="Move to Weak"
            >
              <CheckCircle2
                size={15}
              />
            </button>

            {showWrongAction && (
              <button
                className={
                  "icon-btn" +
                  (q.attemptStatus ===
                  "wrong"
                    ? " active-bad"
                    : "")
                }
                onClick={
                  onMarkWrong
                }
              >
                <XCircle
                  size={15}
                />
              </button>
            )}
          </>
        )}

        <button
          className="visibility-btn"
          onClick={
            onToggleAllow
          }
        >
          {q.testAllowed ? (
            <EyeOff size={15} />
          ) : (
            <Eye size={15} />
          )}

          <span>
            {q.testAllowed
              ? "Hide"
              : "Allow"}
          </span>
        </button>

        <button
          className="icon-btn"
          onClick={onCopy}
          title="Copy Question"
        >
          <Copy size={15} />
        </button>

        <button
          className="icon-btn"
          onClick={onEdit}
        >
          <Pencil size={15} />
        </button>

        <button
          className="icon-btn danger"
          onClick={onDelete}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- filter ---------------------------------- */

function TopicFilter({
  topics,
  value,
  onChange,
  searchValue,
  onSearchChange,
}) {
  return (
    <div className="topic-filter">
      <div className="filter-category-wrap">
        <label
          className="field-label"
          htmlFor="topic-filter"
        >
          Category
        </label>

        <select
          id="topic-filter"
          className="input topic-select"
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
        >
          <option value="all">
            All Categories
          </option>

          {topics.map(
            (topic) => (
              <option
                key={topic}
                value={topic}
              >
                {topic}
              </option>
            )
          )}
        </select>
      </div>

      <div className="filter-search-wrap">
        <label className="field-label">
          Search
        </label>

        <input
          type="search"
          className="input search-input"
          value={
            searchValue
          }
          onChange={(e) =>
            onSearchChange(
              e.target.value
            )
          }
          placeholder="Search questions, options, solutions..."
        />
      </div>
    </div>
  );
}

/* ---------------------------------- section list ---------------------------------- */

function SectionList({
  title,
  emptyText,
  items,
  topics,
  topicFilter,
  onTopicChange,
  searchQuery,
  onSearchChange,
  onMarkCorrect,
  onMarkWrong,
  onToggleAllow,
  onCopy,
  onEdit,
  onDelete,
  showStatusActions = true,
  showWrongAction = true,
}) {
  const sorted = [...items].sort(
    (a, b) =>
      a.order - b.order
  );

  return (
    <div className="section-wrap">
      <div className="section-head">
        <h2>{title}</h2>

        <span className="count-pill">
          {items.length}
        </span>
      </div>

      <TopicFilter
        topics={topics}
        value={topicFilter}
        onChange={
          onTopicChange
        }
        searchValue={
          searchQuery
        }
        onSearchChange={
          onSearchChange
        }
      />

      {sorted.length === 0 ? (
        <div className="empty-state">
          {emptyText}
        </div>
      ) : (
        <div className="card-list">
          {sorted.map((q) => (
            <QuestionCard
              key={q.id}
              q={q}
              onMarkCorrect={() =>
                onMarkCorrect(
                  q.id
                )
              }
              onMarkWrong={() =>
                onMarkWrong(
                  q.id
                )
              }
              onToggleAllow={() =>
                onToggleAllow(
                  q.id
                )
              }
              onCopy={() =>
                onCopy(q.id)
              }
              onEdit={() =>
                onEdit(q.id)
              }
              onDelete={() =>
                onDelete(q.id)
              }
              showStatusActions={
                showStatusActions
              }
              showWrongAction={
                showWrongAction
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- test setup ---------------------------------- */

function TestSetup({
  testPoolCount,
  topics,
  config,
  setConfig,
  onStart,
}) {
  const selectedTopics =
    Array.isArray(
      config.topics
    )
      ? config.topics
      : [];

  const allTopicsSelected =
    selectedTopics.length ===
      topics.length &&
    topics.length > 0;

  function toggleTopic(
    topic
  ) {
    setConfig((c) => {
      const current =
        Array.isArray(
          c.topics
        )
          ? c.topics
          : [];

      const next =
        current.includes(
          topic
        )
          ? current.filter(
              (t) =>
                t !== topic
            )
          : [
              ...current,
              topic,
            ];

      return {
        ...c,
        topics: next,
      };
    });
  }

  function selectAllTopics() {
    setConfig((c) => ({
      ...c,
      topics: [...topics],
    }));
  }

  function clearTopics() {
    setConfig((c) => ({
      ...c,
      topics: [],
    }));
  }

  return (
    <div className="test-setup">
      <div className="setup-card">
        <h2>
          Start a Reasoning
          Round
        </h2>

        <p className="muted">
          {testPoolCount}{" "}
          question
          {testPoolCount !== 1
            ? "s"
            : ""}{" "}
          available.
        </p>

        <div className="field">
          <label className="field-label">
            Question Source
          </label>

          <div className="test-source-grid">
            {[
              [
                "allowed",
                "Allowed / New",
              ],
              [
                "weak",
                "Weak",
              ],
              [
                "hidden",
                "Hidden / Perfect",
              ],
              [
                "special",
                "Special",
              ],
              ["all", "All"],
            ].map(
              ([
                key,
                label,
              ]) => (
                <button
                  key={key}
                  className={
                    "source-choice" +
                    (config.pool ===
                    key
                      ? " selected"
                      : "")
                  }
                  onClick={() =>
                    setConfig(
                      (c) => ({
                        ...c,
                        pool: key,
                      })
                    )
                  }
                >
                  <span className="source-title">
                    {label}
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        <div className="field">
          <div className="topic-select-head">
            <label className="field-label">
              Select Topics
            </label>

            <div className="topic-actions">
              <button
                className="link-btn"
                onClick={
                  selectAllTopics
                }
                disabled={
                  allTopicsSelected
                }
              >
                Select all
              </button>

              <button
                className="link-btn"
                onClick={
                  clearTopics
                }
                disabled={
                  selectedTopics.length ===
                  0
                }
              >
                Clear
              </button>
            </div>
          </div>

          <div className="topic-check-grid">
            {topics.map(
              (topic) => {
                const checked =
                  selectedTopics.includes(
                    topic
                  );

                return (
                  <label
                    key={
                      topic
                    }
                    className={
                      "topic-check" +
                      (checked
                        ? " checked"
                        : "")
                    }
                  >
                    <input
                      type="checkbox"
                      checked={
                        checked
                      }
                      onChange={() =>
                        toggleTopic(
                          topic
                        )
                      }
                    />

                    <span>
                      {topic}
                    </span>
                  </label>
                );
              }
            )}
          </div>
        </div>

        <div className="field">
          <label className="field-label">
            Number of
            Questions
          </label>

          <input
            type="number"
            min={1}
            max={Math.max(
              testPoolCount,
              1
            )}
            className="input"
            value={
              config.count
            }
            disabled={
              testPoolCount ===
              0
            }
            onChange={(e) => {
              let v =
                parseInt(
                  e.target
                    .value ||
                    "1",
                  10
                );

              v = Math.max(
                1,
                Math.min(
                  v,
                  Math.max(
                    testPoolCount,
                    1
                  )
                )
              );

              setConfig(
                (c) => ({
                  ...c,
                  count: v,
                })
              );
            }}
          />
        </div>

        <button
          className="btn btn-primary btn-block"
          disabled={
            testPoolCount ===
            0
          }
          onClick={onStart}
        >
          <Play size={14} />
          Start Test
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- test running ---------------------------------- */

function TestRunning({
  question,
  index,
  total,
  answer,
  onSelect,
  onMark,
  onNext,
  onBack,
  onExit,
  isLast,
  onHide,
  ids,
  answers,
  allQuestions,
  onJump,
}) {
  const [
    timerSeconds,
    setTimerSeconds,
  ] = useState(0);

  const [
    timerRunning,
    setTimerRunning,
  ] = useState(false);

  useEffect(() => {
    if (!timerRunning)
      return;

    const timerId =
      setInterval(
        () =>
          setTimerSeconds(
            (seconds) =>
              seconds + 1
          ),
        1000
      );

    return () =>
      clearInterval(timerId);
  }, [timerRunning]);

  const timerText = `${String(
    Math.floor(
      timerSeconds / 60
    )
  ).padStart(2, "0")}:${String(
    timerSeconds % 60
  ).padStart(2, "0")}`;

  if (!question) {
    return null;
  }

  const revealed =
    answer &&
    answer.revealed;

  return (
    <div className="test-running">
      <div className="test-topbar">
        <button
          className="link-btn"
          onClick={onExit}
        >
          <X size={14} />
          Exit
        </button>

        <span className="progress-label">
          Question{" "}
          {index + 1} /{" "}
          {total}
        </span>

        <div className="tiny-timer">
          <span className="tiny-timer-time">
            {timerText}
          </span>

          <button
            className="tiny-timer-btn"
            onClick={() =>
              setTimerRunning(
                true
              )
            }
          >
            ▶
          </button>

          <button
            className="tiny-timer-btn"
            onClick={() =>
              setTimerRunning(
                false
              )
            }
          >
            ■
          </button>
        </div>

        <button
          className="link-btn hide-q-btn"
          onClick={() =>
            onHide(
              question.id
            )
          }
        >
          <EyeOff
            size={14}
          />
          Hide
        </button>
      </div>

      <div className="q-jump-grid">
        {ids.map(
          (qid, i) => (
            <button
              key={qid}
              className={
                "q-jump-btn" +
                (i === index
                  ? " current"
                  : "")
              }
              onClick={() =>
                onJump(i)
              }
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      <div className="card q-card">
        <span className="badge cat">
          {question.category ||
            "General"}
        </span>

        <p className="q-text">
          {formatMathText(
            question.questionText
          )}
        </p>

        <div className="opt-list test-opts">
          {question.options.map(
            (opt, i) => {
              let cls =
                "opt-row selectable";

              if (revealed) {
                if (
                  i ===
                  question.correctIndex
                ) {
                  cls +=
                    " opt-correct-answer";
                } else if (
                  answer &&
                  i ===
                    answer.selected
                ) {
                  cls +=
                    " opt-wrong-answer";
                }
              }

              return (
                <button
                  key={i}
                  className={
                    cls
                  }
                  disabled={
                    revealed
                  }
                  onClick={() =>
                    onSelect(
                      i
                    )
                  }
                >
                  <span className="opt-letter">
                    {String.fromCharCode(
                      65 + i
                    )}
                  </span>

                  <span>
                    {formatMathText(
                      opt
                    )}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {revealed && (
          <div className="solution reveal">
            {answer.selected ===
            question.correctIndex ? (
              <span className="badge ok">
                Correct!
              </span>
            ) : (
              <span className="badge bad">
                Incorrect
              </span>
            )}

            {question.solutionText && (
              <p>
                {renderTextWithClickableLinks(
                  question.solutionText
                )}
              </p>
            )}

            <button
              className="btn btn-xs btn-ghost"
              onClick={() =>
                onMark(
                  "correct"
                )
              }
            >
              <CheckCircle2
                size={13}
              />
              Move to Weak
            </button>
          </div>
        )}
      </div>

      <div className="test-nav">
        <button
          className="btn btn-ghost"
          disabled={
            index === 0
          }
          onClick={onBack}
        >
          <ChevronLeft
            size={14}
          />
          Back
        </button>

        <button
          className="btn btn-primary"
          onClick={onNext}
        >
          {isLast
            ? "Finish"
            : "Next"}

          <ChevronRight
            size={14}
          />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- summary ---------------------------------- */

function TestSummary({
  ids,
  questions,
  onDone,
}) {
  const qs = ids
    .map((id) =>
      questions.find(
        (q) =>
          q.id === id
      )
    )
    .filter(Boolean);

  const correct =
    qs.filter(
      (q) =>
        q.attemptStatus ===
        "correct"
    ).length;

  const wrong =
    qs.filter(
      (q) =>
        q.attemptStatus ===
        "wrong"
    ).length;

  return (
    <div className="summary">
      <h2>Test Complete</h2>

      <div className="summary-grid">
        <div className="summary-stat ok">
          <b>{correct}</b>
          <span>
            Weak
          </span>
        </div>

        <div className="summary-stat bad">
          <b>{wrong}</b>
          <span>
            Wrong
          </span>
        </div>
      </div>

      <button
        className="btn btn-primary btn-block"
        onClick={onDone}
      >
        <RotateCcw
          size={14}
        />
        New Round
      </button>
    </div>
  );
}

/* ---------------------------------- app ---------------------------------- */

function App() {
  const [
    questions,
    setQuestions,
  ] = useState([]);

  const [
    loaded,
    setLoaded,
  ] = useState(false);

  const [
    section,
    setSection,
  ] = useState("test");

  const [
    editorOpen,
    setEditorOpen,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const [
    testConfig,
    setTestConfig,
  ] = useState({
    pool: "allowed",
    topics: [],
    count: 5,
  });

  const [
    testSession,
    setTestSession,
  ] = useState(null);

  const [toast, setToast] =
    useState("");

  const [
    topicFilter,
    setTopicFilter,
  ] = useState("all");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  useEffect(() => {
    let cancelled =
      false;

    (async () => {
      const STORAGE_KEY =
        "mathquiz:questions";

      const storage =
        createQuestionStorage();

      let data = [];

      try {
        const saved =
          await storage.get(
            STORAGE_KEY
          );

        const value =
          typeof saved ===
          "string"
            ? saved
            : saved &&
              saved.value;

        if (value) {
          const parsed =
            JSON.parse(value);

          if (
            Array.isArray(
              parsed
            )
          ) {
            data = parsed;
          }
        }
      } catch (e) {}

      if (
        data.length === 0
      ) {
        data =
          sampleQuestions();
      }

      data = data.map(
        (question, index) =>
          normalizeQuestion({
            ...question,

            id:
              question.id ||
              `topic-${index}`,

            order:
              typeof question.order ===
              "number"
                ? question.order
                : index,

            attemptStatus:
              question.attemptStatus ||
              "unattempted",

            testAllowed:
              question.testAllowed !==
              false,
          })
      );

      if (!cancelled) {
        setQuestions(data);
        setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const t =
      setTimeout(() => {
        createQuestionStorage()
          .set(
            "mathquiz:questions",
            JSON.stringify(
              questions
            )
          )
          .catch(() => {});
      }, 400);

    return () =>
      clearTimeout(t);
  }, [
    questions,
    loaded,
  ]);

  function notify(msg) {
    setToast(msg);

    setTimeout(
      () => setToast(""),
      1800
    );
  }

  function addQuestion(
    draft
  ) {
    setQuestions((prev) => [
      ...prev,

      {
        ...draft,
        id: uid(),
        order: prev.length,
        attemptStatus:
          "unattempted",
        testAllowed: true,
      },
    ]);

    notify(
      "Question added"
    );
  }

  function editQuestionSave(
    id,
    draft
  ) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              ...draft,
            }
          : q
      )
    );

    notify(
      "Question updated"
    );
  }

  function deleteQuestion(
    id
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this question?"
      );

    if (!confirmed)
      return;

    setQuestions((prev) =>
      prev.filter(
        (q) =>
          q.id !== id
      )
    );

    createQuestionStorage()
      .delete(
        "mathquiz:questions",
        id
      )
      .catch(() => {});

    notify(
      "Question deleted"
    );
  }

  async function copyQuestion(
    id
  ) {
    const question =
      questions.find(
        (q) =>
          q.id === id
      );

    if (!question) return;

    try {
      await navigator.clipboard.writeText(
        question.questionText ||
          ""
      );

      notify(
        "Question copied"
      );
    } catch {
      notify(
        "Copy failed"
      );
    }
  }

  function markStatus(
    id,
    status
  ) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (
          q.id !== id
        ) {
          return q;
        }

        if (
          status ===
          "correct"
        ) {
          return {
            ...q,

            attemptStatus:
              q.attemptStatus ===
              "correct"
                ? "unattempted"
                : "correct",

            testAllowed: true,
          };
        }

        return {
          ...q,

          attemptStatus:
            q.attemptStatus ===
            status
              ? "unattempted"
              : status,
        };
      })
    );
  }

  function toggleAllow(id) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (
          q.id !== id
        ) {
          return q;
        }

        if (
          !q.testAllowed
        ) {
          return {
            ...q,
            testAllowed:
              true,
            attemptStatus:
              "unattempted",
          };
        }

        return {
          ...q,
          testAllowed:
            false,
          attemptStatus:
            "unattempted",
        };
      })
    );
  }

  function hideFromTest(
    id
  ) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              testAllowed:
                false,
              attemptStatus:
                "unattempted",
            }
          : q
      )
    );
  }

  function openNew() {
    setEditingId(null);
    setEditorOpen(true);
  }

  function openEdit(id) {
    setEditingId(id);
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditorOpen(false);
    setEditingId(null);
  }

  function saveEditor(
    draft
  ) {
    if (editingId) {
      editQuestionSave(
        editingId,
        draft
      );
    } else {
      addQuestion(draft);
    }

    closeEditor();
  }

  const correctList =
    questions.filter(
      (q) =>
        q.attemptStatus ===
        "correct"
    );

  const hiddenList =
    questions.filter(
      (q) =>
        !q.testAllowed
    );

  const allowedList =
    questions.filter(
      (q) =>
        q.testAllowed &&
        q.attemptStatus !==
          "correct"
    );

  const specialList =
    questions.filter(
      (q) =>
        q.special === true
    );

  const topics = [
    ...new Set(
      questions
        .map((q) =>
          (
            q.category ||
            "General"
          ).trim()
        )
        .filter(Boolean)
    ),
  ].sort((a, b) =>
    a.localeCompare(b)
  );

  function filterList(
    items
  ) {
    let result = [
      ...items,
    ];

    if (
      topicFilter !== "all"
    ) {
      result =
        result.filter(
          (q) =>
            (
              q.category ||
              "General"
            ) ===
            topicFilter
        );
    }

    const query =
      searchQuery
        .trim()
        .toLowerCase();

    if (query) {
      result =
        result.filter(
          (q) =>
            (
              q.questionText ||
              ""
            )
              .toLowerCase()
              .includes(
                query
              ) ||
            (
              q.solutionText ||
              ""
            )
              .toLowerCase()
              .includes(
                query
              ) ||
            (
              q.category ||
              ""
            )
              .toLowerCase()
              .includes(
                query
              ) ||
            (
              q.options ||
              []
            ).some((o) =>
              String(o)
                .toLowerCase()
                .includes(
                  query
                )
            )
        );
    }

    return result;
  }

  function startTest() {
    const sourceList =
      testConfig.pool ===
      "weak"
        ? correctList
        : testConfig.pool ===
          "hidden"
        ? hiddenList
        : testConfig.pool ===
          "special"
        ? specialList
        : testConfig.pool ===
          "all"
        ? questions
        : allowedList;

    const selectedTopics =
      testConfig.topics ||
      [];

    const pool =
      selectedTopics.length ===
      0
        ? sourceList
        : sourceList.filter(
            (q) =>
              selectedTopics.includes(
                (
                  q.category ||
                  "General"
                ).trim()
              )
          );

    const ids =
      shuffleArr(pool)
        .slice(
          0,
          testConfig.count
        )
        .map((q) => q.id);

    if (
      ids.length === 0
    ) {
      return;
    }

    setTestSession({
      ids,
      idx: 0,
      answers: {},
      finished: false,
    });
  }

  function selectOption(i) {
    setTestSession(
      (prev) => {
        const qid =
          prev.ids[
            prev.idx
          ];

        return {
          ...prev,

          answers: {
            ...prev.answers,

            [qid]: {
              selected: i,
              revealed: true,
            },
          },
        };
      }
    );
  }

  function nextQuestion() {
    setTestSession(
      (prev) =>
        prev.idx <
        prev.ids.length -
          1
          ? {
              ...prev,
              idx:
                prev.idx +
                1,
            }
          : {
              ...prev,
              finished:
                true,
            }
    );
  }

  function backQuestion() {
    setTestSession(
      (prev) =>
        prev.idx > 0
          ? {
              ...prev,
              idx:
                prev.idx -
                1,
            }
          : prev
    );
  }

  function jumpToQuestion(
    i
  ) {
    setTestSession(
      (prev) => ({
        ...prev,
        idx: i,
      })
    );
  }

  function markFromTest(
    status
  ) {
    const qid =
      testSession.ids[
        testSession.idx
      ];

    markStatus(
      qid,
      status
    );
  }

  function exitTest() {
    setTestSession(null);
  }

  if (!loaded) {
    return (
      <div className="app loading-screen">
        <style>
          {CSS}
        </style>

        <div className="loader">
          Loading question
          bank…
        </div>
      </div>
    );
  }

  const editingQuestion =
    editingId
      ? questions.find(
          (q) =>
            q.id ===
            editingId
        )
      : null;

  const testPoolCount =
    (() => {
      const source =
        testConfig.pool ===
        "weak"
          ? correctList
          : testConfig.pool ===
            "hidden"
          ? hiddenList
          : testConfig.pool ===
            "special"
          ? specialList
          : testConfig.pool ===
            "all"
          ? questions
          : allowedList;

      if (
        !testConfig.topics
          .length
      ) {
        return source.length;
      }

      return source.filter(
        (q) =>
          testConfig.topics.includes(
            q.category
          )
      ).length;
    })();

  return (
    <div className="app">
      <style>{CSS}</style>

      <div className="header">
        <div className="header-title">
          <span className="brand">
            REASONING
          </span>

          <span className="brand-accent">
            ::BANK
          </span>
        </div>

        <button
          className="add-btn"
          onClick={openNew}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="header-stats">
        <span className="stat">
          <b>
            {
              questions.length
            }
          </b>
          Total
        </span>

        <span className="stat ok-c">
          <b>
            {
              correctList.length
            }
          </b>
          Weak
        </span>

        <span className="stat amber-c">
          <b>
            {
              hiddenList.length
            }
          </b>
          Hidden
        </span>

        <span className="stat cyan-c">
          <b>
            {
              allowedList.length
            }
          </b>
          Allowed
        </span>
      </div>

      <div className="content">
        {section ===
          "test" &&
          (!testSession ? (
            <TestSetup
              testPoolCount={
                testPoolCount
              }
              topics={topics}
              config={
                testConfig
              }
              setConfig={
                setTestConfig
              }
              onStart={
                startTest
              }
            />
          ) : testSession.finished ? (
            <TestSummary
              ids={
                testSession.ids
              }
              questions={
                questions
              }
              onDone={
                exitTest
              }
            />
          ) : (
            <TestRunning
              question={questions.find(
                (q) =>
                  q.id ===
                  testSession.ids[
                    testSession.idx
                  ]
              )}
              index={
                testSession.idx
              }
              total={
                testSession.ids
                  .length
              }
              answer={
                testSession
                  .answers[
                  testSession.ids[
                    testSession.idx
                  ]
                ]
              }
              onSelect={
                selectOption
              }
              onMark={
                markFromTest
              }
              onNext={
                nextQuestion
              }
              onBack={
                backQuestion
              }
              onExit={
                exitTest
              }
              isLast={
                testSession.idx ===
                testSession.ids
                  .length -
                  1
              }
              onHide={
                hideFromTest
              }
              ids={
                testSession.ids
              }
              answers={
                testSession.answers
              }
              allQuestions={
                questions
              }
              onJump={
                jumpToQuestion
              }
            />
          ))}

        {/* NEW ALL QUESTIONS TAB */}

        {section ===
          "all" && (
          <SectionList
            title="All Questions"
            emptyText="No questions found."
            items={filterList(
              questions
            )}
            topics={
              topics
            }
            topicFilter={
              topicFilter
            }
            onTopicChange={
              setTopicFilter
            }
            searchQuery={
              searchQuery
            }
            onSearchChange={
              setSearchQuery
            }
            onMarkCorrect={(
              id
            ) =>
              markStatus(
                id,
                "correct"
              )
            }
            onMarkWrong={(
              id
            ) =>
              markStatus(
                id,
                "wrong"
              )
            }
            onToggleAllow={
              toggleAllow
            }
            onCopy={
              copyQuestion
            }
            onEdit={
              openEdit
            }
            onDelete={
              deleteQuestion
            }
            showWrongAction={
              false
            }
          />
        )}

        {section ===
          "correct" && (
          <SectionList
            title="Weak Questions"
            emptyText="No weak questions yet."
            items={filterList(
              correctList
            )}
            topics={
              topics
            }
            topicFilter={
              topicFilter
            }
            onTopicChange={
              setTopicFilter
            }
            searchQuery={
              searchQuery
            }
            onSearchChange={
              setSearchQuery
            }
            onMarkCorrect={(
              id
            ) =>
              markStatus(
                id,
                "correct"
              )
            }
            onToggleAllow={
              toggleAllow
            }
            onCopy={
              copyQuestion
            }
            onEdit={
              openEdit
            }
            onDelete={
              deleteQuestion
            }
            showWrongAction={
              false
            }
          />
        )}

        {section ===
          "hidden" && (
          <SectionList
            title="Hidden / Perfect Questions"
            emptyText="No hidden questions."
            items={filterList(
              hiddenList
            )}
            topics={
              topics
            }
            topicFilter={
              topicFilter
            }
            onTopicChange={
              setTopicFilter
            }
            searchQuery={
              searchQuery
            }
            onSearchChange={
              setSearchQuery
            }
            onMarkCorrect={(
              id
            ) =>
              markStatus(
                id,
                "correct"
              )
            }
            onToggleAllow={
              toggleAllow
            }
            onCopy={
              copyQuestion
            }
            onEdit={
              openEdit
            }
            onDelete={
              deleteQuestion
            }
            showWrongAction={
              false
            }
          />
        )}

        {section ===
          "allowed" && (
          <SectionList
            title="Allowed / New Questions"
            emptyText="No allowed questions."
            items={filterList(
              allowedList
            )}
            topics={
              topics
            }
            topicFilter={
              topicFilter
            }
            onTopicChange={
              setTopicFilter
            }
            searchQuery={
              searchQuery
            }
            onSearchChange={
              setSearchQuery
            }
            onMarkCorrect={(
              id
            ) =>
              markStatus(
                id,
                "correct"
              )
            }
            onToggleAllow={
              toggleAllow
            }
            onCopy={
              copyQuestion
            }
            onEdit={
              openEdit
            }
            onDelete={
              deleteQuestion
            }
            showStatusActions={
              false
            }
          />
        )}

        {section ===
          "special" && (
          <SectionList
            title="Special / Important Questions"
            emptyText="No special questions."
            items={filterList(
              specialList
            )}
            topics={
              topics
            }
            topicFilter={
              topicFilter
            }
            onTopicChange={
              setTopicFilter
            }
            searchQuery={
              searchQuery
            }
            onSearchChange={
              setSearchQuery
            }
            onMarkCorrect={(
              id
            ) =>
              markStatus(
                id,
                "correct"
              )
            }
            onMarkWrong={(
              id
            ) =>
              markStatus(
                id,
                "wrong"
              )
            }
            onToggleAllow={
              toggleAllow
            }
            onCopy={
              copyQuestion
            }
            onEdit={
              openEdit
            }
            onDelete={
              deleteQuestion
            }
          />
        )}
      </div>

      <div className="navbar">
        {SECTIONS.map(
          (s) => {
            const NavIcon =
              s.icon;

            return (
              <button
                key={s.key}
                className={
                  "nav-btn" +
                  (section ===
                  s.key
                    ? " active"
                    : "")
                }
                onClick={() => {
                  setSection(
                    s.key
                  );

                  setTopicFilter(
                    "all"
                  );

                  setSearchQuery(
                    ""
                  );
                }}
              >
                <NavIcon
                  size={17}
                />

                <span>
                  {s.label}
                </span>
              </button>
            );
          }
        )}
      </div>

      {editorOpen && (
        <QuestionEditorModal
          initial={
            editingQuestion
          }
          topics={topics}
          onCancel={
            closeEditor
          }
          onSave={
            saveEditor
          }
        />
      )}

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- styles ---------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600&display=swap');

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #241d24;
}

.app {
  --bg: #241d24;
  --panel: #3a303a;
  --panel-2: #4b3d48;
  --border: #745b68;

  --cyan: #67c7dd;
  --green: #a8d86e;
  --rose: #f08a6d;
  --amber: #f0b653;

  --text: #f4e7d2;
  --muted: #c4b4b2;

  width: min(100%, 980px);
  max-width: 980px;
  margin: 0 auto;
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  background: var(--bg);
  color: var(--text);

  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.loading-screen {
  align-items: center;
  justify-content: center;
}

.loader {
  color: var(--cyan);
  font-family: 'JetBrains Mono', monospace;
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 16px 20px;

  background: rgba(36, 29, 36, .97);

  border-bottom: 1px solid var(--border);
}

.header-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 21px;
}

.brand-accent {
  color: var(--cyan);
}

.add-btn {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 8px;

  background: var(--amber);
  color: var(--bg);

  cursor: pointer;
}

.header-stats {
  display: flex;
  gap: 7px;

  padding: 9px 20px;

  overflow-x: auto;

  background: var(--panel);

  border-bottom: 1px solid var(--border);
}

.stat {
  display: inline-flex;
  align-items: center;
  gap: 5px;

  background: var(--panel-2);

  border: 1px solid var(--border);
  border-radius: 7px;

  padding: 5px 8px;

  white-space: nowrap;

  color: var(--muted);

  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
}

.stat b {
  color: var(--text);
}

.stat.ok-c b {
  color: var(--green);
}

.stat.amber-c b {
  color: var(--amber);
}

.stat.cyan-c b {
  color: var(--cyan);
}

.content {
  flex: 1;
  padding: 24px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 14px;
}

.section-head h2 {
  margin: 0;

  font-family: 'Space Grotesk', sans-serif;

  font-size: 20px;
}

.count-pill {
  padding: 4px 10px;

  border-radius: 999px;

  background: #354e5b;

  color: var(--cyan);

  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}

/* ---------------- FILTER ---------------- */

.topic-filter {
  display: grid;

  grid-template-columns: minmax(160px, 260px) 1fr;

  gap: 12px;

  padding: 12px;

  margin-bottom: 16px;

  border: 1px solid var(--border);

  border-radius: 12px;

  background: #302731;
}

.filter-category-wrap,
.filter-search-wrap {
  min-width: 0;
}

.field-label {
  display: block;

  margin-bottom: 6px;

  color: #dfc7b7;

  font-size: 10px;

  text-transform: uppercase;

  letter-spacing: .5px;

  font-family: 'JetBrains Mono', monospace;
}

.input,
.textarea {
  width: 100%;

  padding: 9px 10px;

  border: 1px solid var(--border);

  border-radius: 8px;

  background: #51434e;

  color: var(--text);

  font-family: 'Inter', sans-serif;
}

.input:focus,
.textarea:focus {
  outline: none;

  border-color: var(--cyan);

  box-shadow: 0 0 0 3px rgba(103,199,221,.18);
}

.topic-select {
  cursor: pointer;
}

.search-input {
  width: 100%;
}

/* ---------------- CARDS ---------------- */

.card-list {
  display: flex;
  flex-direction: column;

  gap: 11px;
}

.card {
  padding: 14px;

  border: 1px solid var(--border);

  border-radius: 12px;

  background: var(--panel);

  box-shadow: 0 8px 22px rgba(10, 5, 10, .26);
}

.card-top {
  display: flex;
  gap: 6px;

  flex-wrap: wrap;

  margin-bottom: 8px;
}

.badge {
  padding: 4px 8px;

  border-radius: 999px;

  font-size: 9px;

  font-family: 'JetBrains Mono', monospace;

  text-transform: uppercase;
}

.badge.cat {
  color: #9be1ed;

  background: #315768;
}

.badge.ok {
  color: #c8ed91;

  background: #49613c;
}

.badge.bad {
  color: #ffb09a;

  background: #6d403e;
}

.badge.hide {
  color: #ffd77d;

  background: #66502f;
}

.special-badge {
  color: #f7c9ff;

  background: #604868;
}

.card-q p {
  margin: 0 0 6px;

  font-size: 16px;

  line-height: 1.5;
}

.question-toggle {
  padding: 5px;

  margin: -5px;

  border-radius: 8px;

  cursor: pointer;
}

.question-toggle:hover {
  background: #463846;
}

.question-hint {
  display: block;

  margin-top: 5px;

  color: var(--muted);

  font-size: 9px;

  font-family: 'JetBrains Mono', monospace;
}

.card-img {
  max-width: 100%;

  margin: 8px 0;

  border-radius: 8px;
}

/* ---------------- OPTIONS ---------------- */

.opt-list {
  display: flex;
  flex-direction: column;

  gap: 7px;

  margin: 12px 0;
}

.opt-row {
  display: flex;
  align-items: center;

  gap: 8px;

  padding: 10px 12px;

  border: 1px solid var(--border);

  border-radius: 10px;

  background: var(--panel-2);

  color: var(--text);
}

.opt-correct {
  border-color: var(--green);

  background: #3b5a3e;
}

.opt-letter {
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background: #5b5575;

  color: var(--cyan);

  font-family: 'JetBrains Mono', monospace;
}

.selectable {
  width: 100%;

  cursor: pointer;

  text-align: left;
}

.opt-correct-answer {
  border-color: var(--green);

  background: #49613c;
}

.opt-wrong-answer {
  border-color: var(--rose);

  background: #6d403e;
}

/* ---------------- BUTTONS ---------------- */

.link-btn {
  border: 0;

  background: none;

  color: var(--cyan);

  cursor: pointer;

  font-family: 'JetBrains Mono', monospace;

  font-size: 11px;
}

.card-actions {
  display: flex;

  flex-wrap: wrap;

  gap: 7px;

  margin-top: 14px;
}

.icon-btn {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--border);

  border-radius: 8px;

  background: var(--panel-2);

  color: var(--muted);

  cursor: pointer;
}

.icon-btn:hover {
  color: var(--cyan);

  border-color: var(--cyan);
}

.visibility-btn {
  display: inline-flex;
  align-items: center;

  gap: 5px;

  padding: 0 9px;

  border: 1px solid var(--border);

  border-radius: 8px;

  background: var(--panel-2);

  color: var(--muted);

  cursor: pointer;
}

.visibility-btn:hover {
  color: var(--cyan);

  border-color: var(--cyan);
}

.active-ok {
  color: var(--green) !important;

  border-color: var(--green) !important;
}

.active-bad {
  color: var(--rose) !important;

  border-color: var(--rose) !important;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  padding: 9px 13px;

  border: 1px solid var(--border);

  border-radius: 8px;

  background: var(--panel-2);

  color: var(--text);

  cursor: pointer;
}

.btn-primary {
  background: var(--amber);

  border-color: var(--amber);

  color: var(--bg);
}

.btn-ghost {
  background: transparent;
}

.btn-block {
  width: 100%;
}

.btn-xs {
  padding: 6px 8px;

  font-size: 11px;
}

/* ---------------- SOLUTION ---------------- */

.solution {
  margin-top: 8px;

  padding: 10px;

  border: 1px solid #665a73;

  border-radius: 9px;

  background: #302c38;

  line-height: 1.5;
}

.solution a {
  color: var(--cyan);
}

/* ---------------- EMPTY ---------------- */

.empty-state {
  padding: 24px;

  border: 1px dashed var(--border);

  border-radius: 12px;

  color: var(--muted);

  text-align: center;
}

/* ---------------- TEST ---------------- */

.setup-card {
  padding: 18px;

  border: 1px solid var(--border);

  border-radius: 12px;

  background: var(--panel);
}

.test-source-grid {
  display: grid;

  grid-template-columns: repeat(5, minmax(0, 1fr));

  gap: 7px;
}

.source-choice {
  padding: 10px;

  border: 1px solid var(--border);

  border-radius: 8px;

  background: var(--panel-2);

  color: var(--text);

  cursor: pointer;
}

.source-choice.selected {
  border-color: var(--cyan);
}

.source-title {
  font-weight: 700;

  font-size: 11px;
}

.topic-select-head {
  display: flex;

  justify-content: space-between;

  margin-bottom: 7px;
}

.topic-check-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 6px;

  max-height: 240px;

  overflow-y: auto;
}

.topic-check {
  display: flex;

  align-items: center;

  gap: 7px;

  padding: 8px;

  border: 1px solid var(--border);

  border-radius: 7px;

  background: var(--panel-2);
}

.topic-check.checked {
  border-color: var(--cyan);
}

.test-topbar {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 8px;

  margin-bottom: 10px;
}

.progress-label {
  color: var(--muted);

  font-family: 'JetBrains Mono', monospace;

  font-size: 10px;
}

.tiny-timer {
  display: flex;

  gap: 4px;

  padding: 4px;

  border: 1px solid var(--border);

  border-radius: 6px;
}

.tiny-timer-btn {
  border: 0;

  background: transparent;

  color: var(--muted);

  cursor: pointer;
}

.q-jump-grid {
  display: flex;

  flex-wrap: wrap;

  gap: 6px;

  margin-bottom: 10px;
}

.q-jump-btn {
  width: 28px;
  height: 28px;

  border: 1px solid var(--border);

  border-radius: 6px;

  background: var(--panel-2);

  color: var(--muted);

  cursor: pointer;
}

.q-jump-btn.current {
  background: var(--cyan);

  color: #222;

  border-color: var(--cyan);
}

.test-nav {
  display: flex;

  justify-content: space-between;

  gap: 10px;

  margin-top: 12px;
}

/* ---------------- SUMMARY ---------------- */

.summary {
  text-align: center;
}

.summary-grid {
  display: flex;

  gap: 10px;

  margin: 20px 0;
}

.summary-stat {
  flex: 1;

  padding: 16px;

  border: 1px solid var(--border);

  border-radius: 12px;

  background: var(--panel);
}

.summary-stat b {
  display: block;

  font-size: 26px;
}

.summary-stat.ok b {
  color: var(--green);
}

.summary-stat.bad b {
  color: var(--rose);
}

/* ---------------- MODAL ---------------- */

.modal-overlay {
  position: fixed;

  inset: 0;

  z-index: 100;

  display: flex;

  align-items: flex-end;

  justify-content: center;

  background: rgba(20,14,21,.78);
}

.modal {
  width: 100%;

  max-width: 450px;

  max-height: 90vh;

  display: flex;

  flex-direction: column;

  border: 1px solid var(--border);

  border-radius: 16px 16px 0 0;

  background: var(--panel);
}

.modal-head {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 14px;

  border-bottom: 1px solid var(--border);
}

.modal-body {
  padding: 14px;

  overflow-y: auto;
}

.modal-foot {
  display: flex;

  gap: 8px;

  padding: 12px 14px;

  border-top: 1px solid var(--border);
}

.modal-foot .btn {
  flex: 1;
}

.field {
  margin-bottom: 14px;
}

.textarea {
  resize: vertical;
}

.quick-option-tools {
  display: flex;

  gap: 6px;

  margin-bottom: 7px;
}

.quick-option-btn {
  width: 24px;
  height: 24px;

  border: 1px solid var(--border);

  border-radius: 50%;

  background: var(--panel-2);

  color: var(--cyan);

  cursor: pointer;
}

.option-suffix-row {
  display: flex;

  align-items: center;

  gap: 6px;

  margin-bottom: 8px;
}

.option-suffix-input {
  width: 45px;

  padding: 5px;

  border: 1px solid var(--border);

  border-radius: 6px;

  background: var(--panel-2);

  color: var(--text);
}

.option-suffix-hint {
  color: var(--muted);

  font-size: 9px;
}

.option-edit-row {
  display: flex;

  align-items: center;

  gap: 8px;

  margin-bottom: 6px;
}

.radio-dot {
  width: 28px;
  height: 28px;

  border: 1px solid var(--border);

  border-radius: 7px;

  background: var(--panel-2);

  color: var(--muted);

  cursor: pointer;
}

.radio-dot.checked {
  background: var(--green);

  color: #241d24;
}

.imgdrop {
  padding: 18px;

  border: 1px dashed var(--border);

  border-radius: 8px;

  color: var(--muted);

  text-align: center;
}

.imgpreview img {
  max-width: 100%;
}

.crop-wrap {
  position: relative;
}

.crop-wrap img {
  display: block;

  max-width: 100%;
}

.crop-box {
  position: absolute;

  border: 2px solid var(--cyan);

  box-shadow: 0 0 0 2000px rgba(0,0,0,.5);
}

.crop-handle {
  position: absolute;

  right: -6px;
  bottom: -6px;

  width: 14px;
  height: 14px;

  background: var(--cyan);

  cursor: se-resize;
}

/* ---------------- NAVBAR ---------------- */

.navbar {
  position: sticky;

  bottom: 0;

  z-index: 20;

  display: flex;

  border-top: 1px solid var(--border);

  background: rgba(58,48,58,.98);
}

.nav-btn {
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 3px;

  padding: 9px 2px;

  border: 0;

  background: none;

  color: var(--muted);

  font-family: 'JetBrains Mono', monospace;

  font-size: 9px;

  cursor: pointer;
}

.nav-btn.active {
  color: var(--amber);
}

.toast {
  position: fixed;

  left: 50%;
  bottom: 75px;

  z-index: 300;

  transform: translateX(-50%);

  padding: 8px 14px;

  border: 1px solid var(--border);

  border-radius: 999px;

  background: #151116;

  color: var(--text);
}

.error-text {
  color: var(--rose);
}

/* ---------------- MOBILE ---------------- */

@media (max-width: 650px) {
  .content {
    padding: 18px 14px 28px;
  }

  .topic-filter {
    grid-template-columns: 1fr;
  }

  .test-source-grid {
    grid-template-columns: 1fr;
  }

  .topic-check-grid {
    grid-template-columns: 1fr;
  }

  .card-q p {
    font-size: 15px;
  }

  .nav-btn {
    font-size: 8px;
  }
}
`;

if (
  typeof document !==
    "undefined" &&
  document.getElementById(
    "root"
  )
) {
  ReactDOM.createRoot(
    document.getElementById(
      "root"
    )
  ).render(
    React.createElement(App)
  );
}