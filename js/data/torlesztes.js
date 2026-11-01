/** Hitel törlesztés — először táblázat, aztán annuitás-képlet. */
(function (root) {
  const FELADATOK = [
    {
      id: "to-1",
      question:
        "20 000 Ft hitel, évi 10%, 2 év, év végi azonos törlesztő. Mennyi a törlesztőrészlet? Egész forintra kerekíts.",
      hint: "\\(A = t \\cdot \\dfrac{q^n \cdot p'}{q^n - 1}\\), \\(p' = q - 1\\), \\(q = 1{,}1\\), \\(n = 2\\), \\(t = 20\\,000\\).",
      fields: [{ key: "a", label: "éves törlesztő", type: "money", suffix: "Ft" }],
      compute(M) {
        return { a: M.annuity(20000, 1.1, 2) };
      },
      spec: { kind: "annuity", T: 20000, q: 1.1, n: 2 },
    },
    {
      id: "to-2",
      question:
        "100 000 Ft hitel, évi 10%, 3 év, azonos éves törlesztő. Mennyi a törlesztő? Egész Ft.",
      hint: "Ugyanaz a képlet, \\(n = 3\\), \\(q = 1{,}1\\).",
      fields: [{ key: "a", label: "éves törlesztő", type: "money", suffix: "Ft" }],
      compute(M) {
        return { a: M.annuity(100000, 1.1, 3) };
      },
      spec: { kind: "annuity", T: 100000, q: 1.1, n: 3 },
    },
    {
      id: "to-3",
      question:
        "Az előző hitel (100 000 Ft, 10%, 3 év) törlesztőjét kerekítsd egészre, és számold ki: mennyit fizetünk be összesen, és mennyi ebből a kamat?",
      hint: "Összesen: \\(3 \\cdot a\\). Kamat: összesen mínusz a felvett 100 000 Ft.",
      fields: [
        { key: "a", label: "éves törlesztő (egész Ft)", type: "money", suffix: "Ft" },
        { key: "total", label: "összesen befizetve", type: "money", suffix: "Ft" },
        { key: "interest", label: "kamat", type: "money", suffix: "Ft" },
      ],
      compute(M) {
        const a = M.roundFt(M.annuity(100000, 1.1, 3));
        return { a, total: 3 * a, interest: 3 * a - 100000 };
      },
      spec: { kind: "annuityPaid", T: 100000, q: 1.1, n: 3 },
    },
    {
      id: "to-4",
      question:
        "1 000 000 Ft hitel, évi 6%, 5 év, éves törlesztés. Mennyi a törlesztő? Egész Ft.",
      hint: "\\(q = 1{,}06\\), \\(n = 5\\). Számológép: \\(q^5\\), aztán a képlet.",
      fields: [{ key: "a", label: "éves törlesztő", type: "money", suffix: "Ft" }],
      compute(M) {
        return { a: M.annuity(1000000, 1.06, 5) };
      },
      spec: { kind: "annuity", T: 1000000, q: 1.06, n: 5 },
    },
    {
      id: "to-5",
      question:
        "600 000 Ft hitel, évi 12% (havi tőkésítés), 12 hónap. Mennyi a havi törlesztő? Egész Ft.",
      hint: "Havi kamattényező \\(q = 1 + 12/1200 = 1{,}01\\), \\(n = 12\\).",
      fields: [{ key: "a", label: "havi törlesztő", type: "money", suffix: "Ft" }],
      compute(M) {
        return { a: M.annuity(600000, 1.01, 12) };
      },
      spec: { kind: "annuity", T: 600000, q: 1.01, n: 12 },
    },
    {
      id: "to-6",
      question:
        "Egy telefon 240 000 Ft, 24 havi részlet, évi 18% THM, havi tőkésítés. Mennyi a havi törlesztő? Egész Ft.",
      hint: "Havi \\(q = 1 + 18/1200 = 1{,}015\\), \\(n = 24\\).",
      fields: [{ key: "a", label: "havi törlesztő", type: "money", suffix: "Ft" }],
      compute(M) {
        return { a: M.annuity(240000, 1.015, 24) };
      },
      spec: { kind: "annuity", T: 240000, q: 1.015, n: 24 },
    },
    {
      id: "to-7",
      question:
        "A 240 000 Ft-os telefon 24 havi törlesztőjét egészre kerekítve: mennyit fizetünk ki összesen, és mennyi a kamat?",
      hint: "Összesen \\(24 \\cdot a\\), kamat = összesen − 240 000.",
      fields: [
        { key: "total", label: "összesen", type: "money", suffix: "Ft" },
        { key: "interest", label: "kamat", type: "money", suffix: "Ft" },
      ],
      compute(M) {
        const a = M.roundFt(M.annuity(240000, 1.015, 24));
        return { total: 24 * a, interest: 24 * a - 240000 };
      },
      spec: { kind: "annuityPaid", T: 240000, q: 1.015, n: 24 },
    },
  ];

  root.FELADATOK = FELADATOK;
  if (typeof module !== "undefined" && module.exports) module.exports = FELADATOK;
})(typeof globalThis !== "undefined" ? globalThis : this);
