/**
 * Számtani sorozat — gyakorlatok, nehezedő sorrend.
 * spec: a verify.js iteratív ellenőrzéséhez.
 */
(function (root) {
  const FELADATOK = [
    {
      id: "sz-1",
      question: "A sorozat: 4, 7, 10, 13, … Mennyi a differencia? Mik a következő két tag?",
      hint: "Vonj ki két szomszédos tagot: 7 − 4. Aztán add hozzá még kétszer.",
      fields: [
        { key: "d", label: "differencia (d)", type: "int" },
        { key: "next1", label: "következő tag", type: "int" },
        { key: "next2", label: "az azutáni tag", type: "int" },
      ],
      compute() {
        return { d: 3, next1: 16, next2: 19 };
      },
      spec: { kind: "arithNext", seq: [4, 7, 10, 13], extra: 2 },
    },
    {
      id: "sz-2",
      question: "Első tag \\(a_1 = 5\\), differencia \\(d = 4\\). Mennyi a 6. tag?",
      hint: "Hat tag: 5, aztán ötször hozzáadod a 4-et. \\(a_n = a_1 + (n-1)d\\).",
      fields: [{ key: "an", label: "6. tag", type: "int" }],
      compute(M) {
        return { an: M.arithTerm(5, 4, 6) };
      },
      spec: { kind: "arithTerm", a1: 5, d: 4, n: 6 },
    },
    {
      id: "sz-3",
      question: "Első tag 7, differencia −3. Mennyi a 10. tag?",
      hint: "A sorozat csökken. \\(a_{10} = 7 + 9 \\cdot (-3)\\).",
      fields: [{ key: "an", label: "10. tag", type: "int" }],
      compute(M) {
        return { an: M.arithTerm(7, -3, 10) };
      },
      spec: { kind: "arithTerm", a1: 7, d: -3, n: 10 },
    },
    {
      id: "sz-4",
      question: "Első tag 2, differencia 6. Hányadik tagja a sorozatnak a 44?",
      hint: "Oldd meg: \\(2 + (n-1)\\cdot 6 = 44\\).",
      fields: [{ key: "n", label: "hányadik tag", type: "int" }],
      compute() {
        return { n: 8 };
      },
      spec: { kind: "arithFindN", a1: 2, d: 6, value: 44 },
    },
    {
      id: "sz-5",
      question: "A 12. tag 40, a differencia 4. Mennyi az első tag?",
      hint: "\\(a_{12} = a_1 + 11d\\), ebből \\(a_1 = 40 - 11\\cdot 4\\).",
      fields: [{ key: "a1", label: "első tag", type: "int" }],
      compute() {
        return { a1: -4 };
      },
      spec: { kind: "arithFindA1", an: 40, d: 4, n: 12 },
    },
    {
      id: "sz-6",
      question: "A 4. tag 15, a 9. tag 30. Add meg \\(a_1\\)-et és \\(d\\)-t.",
      hint: "A két tag között 5 lépés van: \\(d = (30-15)/5\\). Az első tag: \\(15 - 3d\\).",
      fields: [
        { key: "a1", label: "első tag", type: "int" },
        { key: "d", label: "differencia", type: "int" },
      ],
      compute(M) {
        return M.arithFromTwo(4, 15, 9, 30);
      },
      spec: { kind: "arithFromTwo", n1: 4, an1: 15, n2: 9, an2: 30 },
    },
    {
      id: "sz-7",
      question: "Első tag 5, differencia 2. Mennyi az első 8 tag összege?",
      hint: "\\(S_n = \\dfrac{n}{2}\\bigl(2a_1 + (n-1)d\\bigr)\\).",
      fields: [{ key: "sn", label: "összeg", type: "int" }],
      compute(M) {
        return { sn: M.arithSum(5, 2, 8) };
      },
      spec: { kind: "arithSum", a1: 5, d: 2, n: 8 },
    },
    {
      id: "sz-8",
      question:
        "Anna hétfőn 8 percet fut, minden további napon 4 perccel többet. Hány percet futott a 6 nap alatt összesen?",
      hint: "Számtani sorozat: \\(a_1 = 8\\), \\(d = 4\\), \\(n = 6\\). Az összegképlet kell.",
      fields: [{ key: "sn", label: "összes perc", type: "int", suffix: "perc" }],
      compute(M) {
        return { sn: M.arithSum(8, 4, 6) };
      },
      spec: { kind: "arithSum", a1: 8, d: 4, n: 6 },
    },
    {
      id: "sz-9",
      question:
        "Egy számtani sorozatban \\(a_1 + a_2 = 12\\) és \\(a_3 + a_4 = 20\\). Mennyi \\(a_1\\) és \\(d\\)?",
      hint: "\\(2a_1 + d = 12\\) és \\(2a_1 + 5d = 20\\). A két egyenletet vond ki egymásból.",
      fields: [
        { key: "a1", label: "első tag", type: "int" },
        { key: "d", label: "differencia", type: "int" },
      ],
      compute() {
        return { a1: 5, d: 2 };
      },
      spec: { kind: "arithPairSums", pairs: [[1, 2, 12], [3, 4, 20]] },
    },
  ];

  root.FELADATOK = FELADATOK;
  if (typeof module !== "undefined" && module.exports) module.exports = FELADATOK;
})(typeof globalThis !== "undefined" ? globalThis : this);
