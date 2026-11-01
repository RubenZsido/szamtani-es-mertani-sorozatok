/**
 * Tanított zárt képletek — a feladatok compute() ezt használja.
 * A scripts/verify.js ugyanezeket iterációval ellenőrzi.
 */
(function (root) {
  const Matek = {
    arithTerm(a1, d, n) {
      return a1 + (n - 1) * d;
    },

    arithSum(a1, d, n) {
      return (n / 2) * (2 * a1 + (n - 1) * d);
    },

    // Két ismert tagból d és a1.
    arithFromTwo(n1, an1, n2, an2) {
      const d = (an2 - an1) / (n2 - n1);
      const a1 = an1 - (n1 - 1) * d;
      return { a1, d };
    },

    geomTerm(a1, q, n) {
      return a1 * q ** (n - 1);
    },

    geomSum(a1, q, n) {
      if (q === 1) return a1 * n;
      return (a1 * (q ** n - 1)) / (q - 1);
    },

    geomFromTwo(n1, an1, n2, an2) {
      const q = (an2 / an1) ** (1 / (n2 - n1));
      // negatív hányados: a hatványgyök pozitívat ad, előjelet a tagokból
      const signed = an1 * an2 < 0 || (n2 - n1) % 2 === 1 && an2 / an1 < 0
        ? -Math.abs(q)
        : Math.abs(q) * Math.sign(an2 / an1) || q;
      const qUse = Number.isFinite(signed) && signed !== 0 ? signed : q;
      const a1 = an1 / qUse ** (n1 - 1);
      return { a1, q: qUse };
    },

    kamatTényező(p) {
      return 1 + p / 100;
    },

    // T_n = T_0 * q^n (kamatos kamat)
    compound(T0, p, n) {
      return T0 * this.kamatTényező(p) ** n;
    },

    depreciate(A, p, n) {
      return A * (1 - p / 100) ** n;
    },

    // Legkisebb n, ahol A * q^n >= cél.
    yearsToReach(A, p, target) {
      const q = this.kamatTényező(p);
      let t = A;
      let n = 0;
      while (t < target - 1e-9) {
        t *= q;
        n += 1;
        if (n > 500) break;
      }
      return n;
    },

    // p% három ismert A, T, n-ből (kamatos).
    findRate(A, T, n) {
      return (Math.pow(T / A, 1 / n) - 1) * 100;
    },

    // A = t * (q^n * p') / (q^n - 1), p' = q - 1
    annuity(t, q, n) {
      const qn = q ** n;
      const pPrime = q - 1;
      return (t * qn * pPrime) / (qn - 1);
    },

    annuityFromPercent(T, p, n, monthly) {
      const q = monthly ? 1 + p / 1200 : 1 + p / 100;
      const steps = monthly ? n : n;
      return this.annuity(T, q, steps);
    },

    roundFt(x) {
      return Math.round(x);
    },

    near(a, b, eps) {
      return Math.abs(a - b) <= eps;
    },
  };

  if (typeof module !== "undefined" && module.exports) module.exports = Matek;
  root.Matek = Matek;
})(typeof globalThis !== "undefined" ? globalThis : this);
