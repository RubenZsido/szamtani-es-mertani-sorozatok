/** Kamatos kamat — éves tőkésítés, majd keresés és értékcsökkenés. */
(function (root) {
  const FELADATOK = [
    {
      id: "ka-1",
      question: "20 000 Ft-ot teszünk be évi 5%-ra. Mennyi lesz 1 év múlva?",
      hint: "Egy év: szorozd 1,05-tel. \\(T_1 = T_0 \\cdot q\\), \\(q = 1 + p/100\\).",
      fields: [{ key: "T", label: "összeg 1 év múlva", type: "money", suffix: "Ft" }],
      compute(M) {
        return { T: M.compound(20000, 5, 1) };
      },
      spec: { kind: "compound", A: 20000, p: 5, n: 1 },
    },
    {
      id: "ka-2",
      question: "50 000 Ft, évi 4%, 2 év, kamatos kamat. Mennyi lesz a betét?",
      hint: "Kétszer szorzol 1,04-gyel: \\(50\\,000 \\cdot 1{,}04^2\\).",
      fields: [{ key: "T", label: "összeg 2 év múlva", type: "money", suffix: "Ft" }],
      compute(M) {
        return { T: M.compound(50000, 4, 2) };
      },
      spec: { kind: "compound", A: 50000, p: 4, n: 2 },
    },
    {
      id: "ka-3",
      question:
        "Három év alatt 10%-os kamatos kamattal 13 310 Ft lett a betét. Mennyi volt a kezdő összeg?",
      hint: "Fordítva: oszd el \\(1{,}1^3\\)-mal. \\(T_0 = T_n / q^n\\).",
      fields: [{ key: "A", label: "kezdő összeg", type: "money", suffix: "Ft" }],
      compute() {
        return { A: 10000 };
      },
      spec: { kind: "findA", T: 13310, p: 10, n: 3 },
    },
    {
      id: "ka-4",
      question:
        "10 000 Ft évi 10%-on kamatozik. Hány év múlva lesz először legalább 20 000 Ft?",
      hint: "Szorozgasd 1,1-gyel, amíg eléred a 20 000-et. \\(1{,}1^7 \\approx 1{,}95\\), \\(1{,}1^8 \\approx 2{,}14\\).",
      fields: [{ key: "n", label: "évek száma", type: "years", suffix: "év" }],
      compute(M) {
        return { n: M.yearsToReach(10000, 10, 20000) };
      },
      spec: { kind: "yearsToReach", A: 10000, p: 10, target: 20000 },
    },
    {
      id: "ka-5",
      question:
        "20 000 Ft három év alatt 26 620 Ft lett kamatos kamattal. Hány százalék volt az éves kamatláb?",
      hint: "\\(20\\,000 \\cdot q^3 = 26\\,620\\), tehát \\(q^3 = 1{,}331\\), \\(q = 1{,}1\\).",
      fields: [{ key: "p", label: "kamatláb", type: "rate", suffix: "%" }],
      compute(M) {
        return { p: M.findRate(20000, 26620, 3) };
      },
      spec: { kind: "findRate", A: 20000, T: 26620, n: 3 },
    },
    {
      id: "ka-6",
      question:
        "Egy 3 000 000 Ft-os autó értéke évente 10%-kal csökken. Mennyit ér 2 év múlva?",
      hint: "Most szorzó \\(0{,}9\\). \\(T = 3\\,000\\,000 \\cdot 0{,}9^2\\).",
      fields: [{ key: "T", label: "érték 2 év múlva", type: "money", suffix: "Ft" }],
      compute(M) {
        return { T: M.depreciate(3000000, 10, 2) };
      },
      spec: { kind: "depreciate", A: 3000000, p: 10, n: 2 },
    },
    {
      id: "ka-7",
      question:
        "Egy erdő faállománya 10 000 m³, évente 3%-kal nő. Hány év múlva lesz először legalább 12 000 m³?",
      hint: "Ugyanaz, mint a kamatos kamat: keresd a legkisebb n-t, ahol \\(10\\,000 \\cdot 1{,}03^n \\ge 12\\,000\\).",
      fields: [{ key: "n", label: "évek száma", type: "years", suffix: "év" }],
      compute(M) {
        return { n: M.yearsToReach(10000, 3, 12000) };
      },
      spec: { kind: "yearsToReach", A: 10000, p: 3, target: 12000 },
    },
    {
      id: "ka-8",
      question:
        "Egy városnak 8000 lakosa van, és évente 2%-kal nő. Hány lakosa lesz 10 év múlva? Egészre kerekíts.",
      hint: "\\(8000 \\cdot 1{,}02^{10}\\).",
      fields: [{ key: "T", label: "lélekszám", type: "money" }],
      compute(M) {
        return { T: M.compound(8000, 2, 10) };
      },
      spec: { kind: "compound", A: 8000, p: 2, n: 10 },
    },
    {
      id: "ka-9",
      question:
        "6000 Ft kamatos kamatra 8%-on van. Logaritmussal (vagy szorozással) hány év múlva lesz először legalább 12 000 Ft?",
      hint: "\\(1{,}08^n \\ge 2\\), tehát \\(n = \\log 2 / \\log 1{,}08 \\approx 9{,}01\\). A 9. év még kevés, válasz: 10 év.",
      fields: [{ key: "n", label: "évek száma", type: "years", suffix: "év" }],
      compute(M) {
        return { n: M.yearsToReach(6000, 8, 12000) };
      },
      spec: { kind: "yearsToReach", A: 6000, p: 8, target: 12000 },
    },
    {
      id: "ka-10",
      question:
        "25 000 Ft évi 6%-os kamattal nő. Hány év múlva lesz először legalább 50 000 Ft? (Használhatod: \\(n = \\log(C/T_0)/\\log q\\).)",
      hint: "\\(C/T_0 = 2\\), \\(q = 1{,}06\\). \\(n \\approx 11{,}9\\) → felfelé egész: 12 év.",
      fields: [{ key: "n", label: "évek száma", type: "years", suffix: "év" }],
      compute(M) {
        return { n: M.yearsToReach(25000, 6, 50000) };
      },
      spec: { kind: "yearsToReach", A: 25000, p: 6, target: 50000 },
    },
    {
      id: "ka-11",
      question:
        "8000 Ft évi 10%-kal kamatozik. Hány év múlva lesz először legalább 25 000 Ft?",
      hint: "\\(n = \\log(25\\,000/8000) / \\log 1{,}1 \\approx 12{,}0\\). Ellenőrizd: \\(8000 \\cdot 1{,}1^{11}\\) még kevés, \\(1{,}1^{12}\\) már elég.",
      fields: [{ key: "n", label: "évek száma", type: "years", suffix: "év" }],
      compute(M) {
        return { n: M.yearsToReach(8000, 10, 25000) };
      },
      spec: { kind: "yearsToReach", A: 8000, p: 10, target: 25000 },
    },
    {
      id: "ka-12",
      question:
        "20 000 Ft hitel, évi 10%, 2 év, azonos éves törlesztő. Mennyi a törlesztő? Egész forintra kerekíts.",
      hint: "\\(A = t \\cdot \\dfrac{q^n \\cdot p'}{q^n - 1}\\), \\(p' = q - 1\\), \\(q = 1{,}1\\), \\(n = 2\\), \\(t = 20\\,000\\).",
      fields: [{ key: "a", label: "éves törlesztő", type: "money", suffix: "Ft" }],
      compute(M) {
        return { a: M.roundFt(M.annuity(20000, 1.1, 2)) };
      },
      spec: { kind: "annuity", T: 20000, q: 1.1, n: 2 },
    },
    {
      id: "ka-13",
      question:
        "100 000 Ft hitel, évi 10%, 3 év, azonos éves törlesztő. Mennyi a törlesztő? Egész Ft.",
      hint: "Ugyanaz a képlet: \\(n = 3\\), \\(q^3 = 1{,}331\\).",
      fields: [{ key: "a", label: "éves törlesztő", type: "money", suffix: "Ft" }],
      compute(M) {
        return { a: M.roundFt(M.annuity(100000, 1.1, 3)) };
      },
      spec: { kind: "annuity", T: 100000, q: 1.1, n: 3 },
    },
    {
      id: "ka-14",
      question:
        "50 000 Ft hitel, évi 8%, 4 év, éves törlesztő (kerekített \\(A\\)). Mennyit fizetsz be összesen, és mennyi ebből kamat?",
      hint: "Először \\(A\\) a képletből, egész Ft. Összesen: \\(4A\\). Kamat: \\(4A - t\\).",
      fields: [
        { key: "total", label: "összesen befizetve", type: "money", suffix: "Ft" },
        { key: "interest", label: "kamat", type: "money", suffix: "Ft" },
      ],
      compute(M) {
        const a = M.roundFt(M.annuity(50000, 1.08, 4));
        return { total: 4 * a, interest: 4 * a - 50000 };
      },
      spec: { kind: "annuityPaid", T: 50000, q: 1.08, n: 4 },
    },
  ];

  root.FELADATOK = FELADATOK;
  if (typeof module !== "undefined" && module.exports) module.exports = FELADATOK;
})(typeof globalThis !== "undefined" ? globalThis : this);
