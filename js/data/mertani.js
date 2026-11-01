/** Mértani sorozat — a feladatlapok típusai, saját számokkal. */
(function (root) {
  const FELADATOK = [
    {
      id: "me-1",
      question: "A sorozat: 5, 10, 20, 40, … Mennyi a hányados? Mik a következő két tag?",
      hint: "Oszd el a szomszédos tagokat: \\(10/5\\). Aztán szorozz még kétszer.",
      fields: [
        { key: "q", label: "hányados (q)", type: "int" },
        { key: "next1", label: "következő tag", type: "int" },
        { key: "next2", label: "az azutáni tag", type: "int" },
      ],
      compute() {
        return { q: 2, next1: 80, next2: 160 };
      },
      spec: { kind: "geomNext", seq: [5, 10, 20, 40], extra: 2 },
    },
    {
      id: "me-2",
      question: "Első tag \\(a_1 = 2\\), hányados \\(q = 3\\). Mennyi a 4. tag?",
      hint: "Szorozz háromszor 3-mal, vagy: \\(a_n = a_1 \\cdot q^{n-1}\\).",
      fields: [{ key: "an", label: "4. tag", type: "int" }],
      compute(M) {
        return { an: M.geomTerm(2, 3, 4) };
      },
      spec: { kind: "geomTerm", a1: 2, q: 3, n: 4 },
    },
    {
      id: "me-3",
      question: "Első tag 4, hányados −2. Mennyi a 6. tag?",
      hint: "\\(a_6 = 4 \\cdot (-2)^5\\). Páratlan kitevő: negatív eredmény.",
      fields: [{ key: "an", label: "6. tag", type: "int" }],
      compute(M) {
        return { an: M.geomTerm(4, -2, 6) };
      },
      spec: { kind: "geomTerm", a1: 4, q: -2, n: 6 },
    },
    {
      id: "me-4",
      question: "Első tag 3, hányados 2. Hányadik tagja a sorozatnak a 384?",
      hint: "\\(3 \\cdot 2^{n-1} = 384\\), tehát \\(2^{n-1} = 128\\).",
      fields: [{ key: "n", label: "hányadik tag", type: "int" }],
      compute() {
        return { n: 8 };
      },
      spec: { kind: "geomFindN", a1: 3, q: 2, value: 384 },
    },
    {
      id: "me-5",
      question: "Az 5. tag 80, a hányados 2. Mennyi az első tag?",
      hint: "\\(a_5 = a_1 \\cdot 2^4\\), ebből \\(a_1 = 80 / 16\\).",
      fields: [{ key: "a1", label: "első tag", type: "int" }],
      compute() {
        return { a1: 5 };
      },
      spec: { kind: "geomFindA1", an: 80, q: 2, n: 5 },
    },
    {
      id: "me-6",
      question: "A 2. tag 6, az 5. tag 48. Add meg \\(a_1\\)-et és \\(q\\)-t.",
      hint: "\\(a_5 / a_2 = q^3 = 8\\), tehát \\(q = 2\\). Az első tag: \\(6 / q\\).",
      fields: [
        { key: "a1", label: "első tag", type: "int" },
        { key: "q", label: "hányados", type: "int" },
      ],
      compute() {
        return { a1: 3, q: 2 };
      },
      spec: { kind: "geomFromTwo", n1: 2, an1: 6, n2: 5, an2: 48 },
    },
    {
      id: "me-7",
      question: "A 2. tag −8, az 5. tag 64. Add meg \\(a_1\\)-et és \\(q\\)-t (q negatív).",
      hint: "\\(64 / (-8) = q^3 = -8\\), így \\(q = -2\\).",
      fields: [
        { key: "a1", label: "első tag", type: "int" },
        { key: "q", label: "hányados", type: "int" },
      ],
      compute() {
        return { a1: 4, q: -2 };
      },
      spec: { kind: "geomFromTwo", n1: 2, an1: -8, n2: 5, an2: 64 },
    },
    {
      id: "me-8",
      question: "Első tag 5, hányados 3. Mennyi az első 4 tag összege?",
      hint: "\\(S_n = a_1 \\dfrac{q^n - 1}{q - 1}\\), ha \\(q \\neq 1\\).",
      fields: [{ key: "sn", label: "összeg", type: "int" }],
      compute(M) {
        return { sn: M.geomSum(5, 3, 4) };
      },
      spec: { kind: "geomSum", a1: 5, q: 3, n: 4 },
    },
    {
      id: "me-9",
      question: "Első tag 4, hányados 1. Mennyi az első 12 tag összege?",
      hint: "Ha \\(q = 1\\), minden tag ugyanaz, az összeg \\(a_1 \\cdot n\\).",
      fields: [{ key: "sn", label: "összeg", type: "int" }],
      compute(M) {
        return { sn: M.geomSum(4, 1, 12) };
      },
      spec: { kind: "geomSum", a1: 4, q: 1, n: 12 },
    },
    {
      id: "me-10",
      question:
        "Dani hétfőn 3 percet edz, és minden nap a duplájára növeli. Hány percet edzett a 5 nap alatt összesen?",
      hint: "Mértani: \\(a_1 = 3\\), \\(q = 2\\), \\(n = 5\\). Összegképlet.",
      fields: [{ key: "sn", label: "összes perc", type: "int", suffix: "perc" }],
      compute(M) {
        return { sn: M.geomSum(3, 2, 5) };
      },
      spec: { kind: "geomSum", a1: 3, q: 2, n: 5 },
    },
    {
      id: "me-11",
      question:
        "Egy virágágyás területe 16 m², és hetente 1,5-szeresére nő. Mekkora a terület 4 hét múlva? (Két tizedesjegy.)",
      hint: "4 hét = 4 szorzás: \\(16 \\cdot 1{,}5^4\\). Ez a 5. állapot (0. hét + 4 növekedés).",
      fields: [{ key: "T", label: "terület 4 hét múlva", type: "number", suffix: "m²" }],
      compute() {
        return { T: 16 * 1.5 ** 4 };
      },
      spec: { kind: "geomGrow", A: 16, q: 1.5, steps: 4 },
    },
  ];

  root.FELADATOK = FELADATOK;
  if (typeof module !== "undefined" && module.exports) module.exports = FELADATOK;
})(typeof globalThis !== "undefined" ? globalThis : this);
