/**
 * Független ellenőrzés: a tanított zárt képlet vs. lépésenkénti ciklus.
 * Futtatás: node scripts/verify.js
 */
const path = require("path");
const Matek = require(path.join(__dirname, "..", "js", "math.js"));

function load(name) {
  return require(path.join(__dirname, "..", "js", "data", name));
}

// --- iteratív motor, szándékosan nem a zárt képlet ---

function addTerm(a1, d, n) {
  let a = a1;
  for (let i = 2; i <= n; i++) a += d;
  return a;
}

function sumArith(a1, d, n) {
  let s = 0;
  let a = a1;
  for (let i = 1; i <= n; i++) {
    s += a;
    a += d;
  }
  return s;
}

function mulTerm(a1, q, n) {
  let a = a1;
  for (let i = 2; i <= n; i++) a *= q;
  return a;
}

function sumGeom(a1, q, n) {
  let s = 0;
  let a = a1;
  for (let i = 1; i <= n; i++) {
    s += a;
    a *= q;
  }
  return s;
}

function grow(A, q, steps) {
  let t = A;
  for (let i = 0; i < steps; i++) t *= q;
  return t;
}

function yearsTo(A, p, target) {
  let t = A;
  let n = 0;
  const q = 1 + p / 100;
  while (t < target - 1e-9) {
    t *= q;
    n += 1;
    if (n > 500) break;
  }
  return n;
}

function findA(T, p, n) {
  let t = T;
  const q = 1 + p / 100;
  for (let i = 0; i < n; i++) t /= q;
  return t;
}

function findRate(A, T, n) {
  let lo = 0;
  let hi = 200;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (grow(A, 1 + mid / 100, n) < T) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function loanLeft(T, q, a, n) {
  let t = T;
  for (let i = 0; i < n; i++) t = t * q - a;
  return t;
}

function annuitySearch(T, q, n) {
  let lo = 0;
  let hi = T * Math.max(q, 1) * 2;
  for (let i = 0; i < 90; i++) {
    const mid = (lo + hi) / 2;
    if (loanLeft(T, q, mid, n) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function seqDiff(seq) {
  const d = seq[1] - seq[0];
  for (let i = 2; i < seq.length; i++) {
    if (seq[i] - seq[i - 1] !== d) throw new Error("nem számtani: " + seq);
  }
  return d;
}

function seqQ(seq) {
  const q = seq[1] / seq[0];
  for (let i = 2; i < seq.length; i++) {
    if (Math.abs(seq[i] / seq[i - 1] - q) > 1e-9) throw new Error("nem mértani");
  }
  return q;
}

function pairSums(pairs) {
  // egész a1, d kipróbálása — nem a zárt rendszer megoldása
  for (let d = -30; d <= 30; d++) {
    for (let a1 = -30; a1 <= 30; a1++) {
      const ok = pairs.every(([i, j, s]) => addTerm(a1, d, i) + addTerm(a1, d, j) === s);
      if (ok) return { a1, d };
    }
  }
  throw new Error("pairSums: nincs egész megoldás");
}

function geomTwo(n1, an1, n2, an2) {
  for (let q = -20; q <= 20; q++) {
    if (q === 0) continue;
    const a1 = an1 / mulTerm(1, q, n1);
    if (Math.abs(mulTerm(a1, q, n1) - an1) < 1e-9 && Math.abs(mulTerm(a1, q, n2) - an2) < 1e-9) {
      return { a1, q };
    }
  }
  throw new Error("geomTwo: nincs egész q");
}

function sinking(a, q, n) {
  let s = 0;
  for (let i = 0; i < n; i++) s = (s + a) * q;
  return s;
}

function fromSpec(spec) {
  switch (spec.kind) {
    case "arithNext": {
      const d = seqDiff(spec.seq);
      const out = { d };
      let last = spec.seq[spec.seq.length - 1];
      if (spec.extra >= 1) {
        last += d;
        out.next1 = last;
      }
      if (spec.extra >= 2) {
        last += d;
        out.next2 = last;
      }
      return out;
    }
    case "arithTerm":
      return { an: addTerm(spec.a1, spec.d, spec.n) };
    case "arithSum":
      return { sn: sumArith(spec.a1, spec.d, spec.n) };
    case "arithFindN": {
      let a = spec.a1;
      let n = 1;
      while (a !== spec.value) {
        a += spec.d;
        n += 1;
        if (n > 500) break;
      }
      return { n };
    }
    case "arithFindA1": {
      let a = spec.an;
      for (let i = spec.n; i > 1; i--) a -= spec.d;
      return { a1: a };
    }
    case "arithFromTwo": {
      const d = (spec.an2 - spec.an1) / (spec.n2 - spec.n1);
      let a1 = spec.an1;
      for (let i = spec.n1; i > 1; i--) a1 -= d;
      return { a1, d };
    }
    case "arithPairSums":
      return pairSums(spec.pairs);
    case "geomNext": {
      const q = seqQ(spec.seq);
      const out = { q };
      let last = spec.seq[spec.seq.length - 1];
      if (spec.extra >= 1) {
        last *= q;
        out.next1 = last;
      }
      if (spec.extra >= 2) {
        last *= q;
        out.next2 = last;
      }
      return out;
    }
    case "geomTerm":
      return { an: mulTerm(spec.a1, spec.q, spec.n) };
    case "geomSum":
      return { sn: sumGeom(spec.a1, spec.q, spec.n) };
    case "geomFindN": {
      let a = spec.a1;
      let n = 1;
      while (Math.abs(a - spec.value) > 1e-9) {
        a *= spec.q;
        n += 1;
        if (n > 500) break;
      }
      return { n };
    }
    case "geomFindA1": {
      let a = spec.an;
      for (let i = spec.n; i > 1; i--) a /= spec.q;
      return { a1: a };
    }
    case "geomFromTwo":
      return geomTwo(spec.n1, spec.an1, spec.n2, spec.an2);
    case "geomGrow":
      return { T: grow(spec.A, spec.q, spec.steps) };
    case "compound":
      return { T: grow(spec.A, 1 + spec.p / 100, spec.n), q: 1 + spec.p / 100 };
    case "findA":
      return { A: findA(spec.T, spec.p, spec.n) };
    case "yearsToReach":
      return { n: yearsTo(spec.A, spec.p, spec.target) };
    case "findRate":
      return { p: findRate(spec.A, spec.T, spec.n) };
    case "depreciate":
      return { T: grow(spec.A, 1 - spec.p / 100, spec.n) };
    case "annuity":
      return { a: annuitySearch(spec.T, spec.q, spec.n) };
    case "annuityPaid": {
      const a = Math.round(annuitySearch(spec.T, spec.q, spec.n));
      return { a, total: spec.n * a, interest: spec.n * a - spec.T };
    }
    case "bothSixth":
      return { a6: addTerm(spec.a1, spec.d, 6), b6: mulTerm(spec.b1, spec.q, 6) };
    case "annuityRatio": {
      const a = Math.round(annuitySearch(spec.T, spec.q, spec.n));
      return { a, ratio: Math.round(((spec.n * a) / spec.T) * 100) / 100 };
    }
    case "sinking":
      return { S: sinking(spec.a, spec.q, spec.n) };
    default:
      throw new Error("ismeretlen spec: " + spec.kind);
  }
}

function close(a, b, type) {
  if (type === "money") return Math.round(a) === Math.round(b);
  if (type === "int" || type === "years") return a === b;
  if (type === "rate") return Math.abs(a - b) <= 0.05;
  return Math.abs(a - b) <= 0.05;
}

const files = ["szamtani.js", "mertani.js", "kamatos.js", "torlesztes.js", "osszefoglalo.js"];
let fail = 0;
let pass = 0;

for (const file of files) {
  const list = load(file);
  console.log("\n== " + file + " (" + list.length + ") ==");
  for (const ex of list) {
    const formula = ex.compute(Matek);
    const loop = fromSpec(ex.spec);
    const types = Object.fromEntries(ex.fields.map((f) => [f.key, f.type]));
    let bad = [];
    for (const key of Object.keys(formula)) {
      if (!(key in loop)) {
        bad.push(key + " hiányzik a ciklusos eredményből");
        continue;
      }
      if (!close(formula[key], loop[key], types[key] || "number")) {
        bad.push(key + " képlet=" + formula[key] + " ciklus=" + loop[key]);
      }
    }
    // hitelnél a keresett a-val a tartozás ~ 0
    if (ex.spec.kind === "annuity" || ex.spec.kind === "annuityPaid" || ex.spec.kind === "annuityRatio") {
      const raw = annuitySearch(ex.spec.T, ex.spec.q, ex.spec.n);
      const left = loanLeft(ex.spec.T, ex.spec.q, raw, ex.spec.n);
      if (Math.abs(left) > 0.05) bad.push("maradek (pontos a) " + left);
    }
    if (bad.length) {
      fail += 1;
      console.log("  HIBA " + ex.id + ": " + bad.join(" | "));
    } else {
      pass += 1;
      console.log("  ok   " + ex.id);
    }
  }
}

console.log("\n" + pass + " rendben, " + fail + " hiba");
process.exit(fail ? 1 : 0);
