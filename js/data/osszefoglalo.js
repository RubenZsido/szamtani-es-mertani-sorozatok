/** Vegyes feladatok: melyik modell, és a négy téma kapcsolata. */
(function (root) {
  const FELADATOK = [
    {
      id: "os-1",
      question:
        "Melyik sorozat számtani? Írd be annak a differenciáját. A) 2, 6, 18, 54  B) 3, 8, 13, 18  C) 4, 8, 16, 32",
      hint: "Számtaninál a különbség állandó, mértaninál a hányados.",
      fields: [{ key: "d", label: "a számtani sorozat d-je", type: "int" }],
      compute() {
        return { d: 5 };
      },
      spec: { kind: "arithNext", seq: [3, 8, 13, 18], extra: 0 },
    },
    {
      id: "os-2",
      question:
        "40 000 Ft évi 5%-on 3 évig kamatozik. Ez mértani sorozat. Mennyi a 3. év végi összeg, és mennyi q?",
      hint: "\\(q = 1{,}05\\), \\(T = 40\\,000 \\cdot 1{,}05^3\\). A 0. év a tőke, 3 szorzás kell.",
      fields: [
        { key: "q", label: "hányados q", type: "number" },
        { key: "T", label: "összeg 3 év múlva", type: "money", suffix: "Ft" },
      ],
      compute(M) {
        return { q: 1.05, T: M.compound(40000, 5, 3) };
      },
      spec: { kind: "compound", A: 40000, p: 5, n: 3 },
    },
    {
      id: "os-3",
      question:
        "Számtani: \\(a_1 = 4\\), \\(d = 7\\). Mértani: \\(b_1 = 4\\), \\(q = 2\\). Mennyi \\(a_6\\) és \\(b_6\\)?",
      hint: "Számtani: hozzáadsz. Mértani: szorzol. Ugyanaz a start, más növekedés.",
      fields: [
        { key: "a6", label: "számtani 6. tag", type: "int" },
        { key: "b6", label: "mértani 6. tag", type: "int" },
      ],
      compute(M) {
        return { a6: M.arithTerm(4, 7, 6), b6: M.geomTerm(4, 2, 6) };
      },
      spec: { kind: "bothSixth", a1: 4, d: 7, b1: 4, q: 2 },
    },
    {
      id: "os-4",
      question:
        "300 000 Ft hitel, évi 8%, 4 év, éves törlesztő. Mennyi a törlesztő (egész Ft), és ez hányszorosa a hitelnek összesen?",
      hint: "Először a, aztán \\(4a / 300\\,000\\). A szorzót két tizedesre add meg.",
      fields: [
        { key: "a", label: "éves törlesztő", type: "money", suffix: "Ft" },
        { key: "ratio", label: "összesen / hitel", type: "number" },
      ],
      compute(M) {
        const a = M.roundFt(M.annuity(300000, 1.08, 4));
        return { a, ratio: Math.round((4 * a) / 300000 * 100) / 100 };
      },
      spec: { kind: "annuityRatio", T: 300000, q: 1.08, n: 4 },
    },
    {
      id: "os-5",
      question:
        "Egy gyűjtés: minden év elején 50 000 Ft-ot teszel be, évi 4% kamat, 3 év, az utolsó év végén veszed ki. Mennyi lesz? Egész Ft. (Az első betét 3 teljes évet kamatozik.)",
      hint: "Mértani összeg: \\(50\\,000\\cdot 1{,}04^3 + 50\\,000\\cdot 1{,}04^2 + 50\\,000\\cdot 1{,}04\\).",
      fields: [{ key: "S", label: "gyűjtött összeg", type: "money", suffix: "Ft" }],
      compute() {
        const q = 1.04;
        return { S: 50000 * (q ** 3 + q ** 2 + q) };
      },
      spec: { kind: "sinking", a: 50000, q: 1.04, n: 3 },
    },
  ];

  root.FELADATOK = FELADATOK;
  if (typeof module !== "undefined" && module.exports) module.exports = FELADATOK;
})(typeof globalThis !== "undefined" ? globalThis : this);
