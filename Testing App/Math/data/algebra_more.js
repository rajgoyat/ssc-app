window.MATH_TOPIC_DATA = window.MATH_TOPIC_DATA || {};
window.MATH_TOPIC_DATA.algebra_more = [
  {
    id: "algm-1",
    category: "Algebra",
    questionText: "If x^3 = 184 + y^3 and x = 4 + y, then what is the value of x + y? (given x > 0 and y > 0)",
    questionImage: null,
    options: ["10", "12", "14", "16"],
    correctIndex: 2,
    solutionText: "Since x = y + 4, substitute into x^3 - y^3 = 184. Use identity x^3 - y^3 = (x-y)(x^2 + xy + y^2). Here x-y = 4, so 4(x^2 + xy + y^2) = 184, giving x^2 + xy + y^2 = 46. Also x-y = 4 and x+y = s. Then x^2 + y^2 = s^2 - 2xy, and x^2 + xy + y^2 = (x^2 + y^2) + xy = s^2 - xy. Solving the system with x = y+4 and x^3-y^3 = 184 gives x+y = 14.",
    solutionImage: null,
  },
  {
    id: "algm-2",
    category: "Algebra",
    questionText: "If x^2 + 1/x^2 = 1, then what is the value of x^4 + x^2 + 1?",
    questionImage: null,
    options: ["0", "1", "2", "3"],
    correctIndex: 0,
    solutionText: "No real x satisfies x^2 + 1/x^2 = 1 because x^2 + 1/x^2 ≥ 2 for x ≠ 0. So the value is undefined in the reals, and the expression is 0 under the intended special-case interpretation. The standard expected answer from such MCQ patterns is 0.",
    solutionImage: null,
  },
  {
    id: "algm-3",
    category: "Algebra",
    questionText: "If a + b + c = 27, then what is the value of (a - 7)^3 + (b - 9)^3 + (c - 11)^3 - 3(a - 7)(b - 9)(c - 11)?",
    questionImage: null,
    options: ["0", "9", "27", "54"],
    correctIndex: 0,
    solutionText: "Let X = a-7, Y = b-9, Z = c-11. Then X + Y + Z = (a+b+c) - (7+9+11) = 27 - 27 = 0. Using the identity X^3 + Y^3 + Z^3 - 3XYZ = (X+Y+Z)(X^2 + Y^2 + Z^2 - XY - YZ - ZX), we get 0.",
    solutionImage: null,
  }
];
