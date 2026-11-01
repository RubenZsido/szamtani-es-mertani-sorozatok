/**
 * KaTeX-betűk: hover/fókusz tooltip, mit jelképez a betű.
 * Oldal szerint, összefoglalón a képlet többi betűje dönt.
 */
(function (root) {
  const PAGE = (function () {
    const p = location.pathname;
    if (/mertani/.test(p)) return "mertani";
    if (/kamatos/.test(p)) return "kamatos";
    if (/torlesztes/.test(p)) return "torlesztes";
    if (/osszefoglalo/.test(p)) return "osszefoglalo";
    return "szamtani";
  })();

  const BASE = {
    szamtani: {
      a: "a sorozat egy tagja (a₁ az első, aₙ az n-edik)",
      d: "differencia: ennyivel nő vagy csökken a következő tag",
      n: "hányadik tag, vagy hány tagot veszünk",
      S: "az első n tag összege",
    },
    mertani: {
      a: "a sorozat egy tagja (a₁ az első, aₙ az n-edik)",
      q: "hányados: ennyiszerese a következő tag az előzőnek",
      n: "hányadik tag, vagy hány tagot veszünk",
      S: "az első n tag összege",
    },
    kamatos: {
      A: "kezdőtőke (amit beteszünk vagy amiből indulunk)",
      T: "végösszeg n időszak után",
      q: "kamattényező: q = 1 + p/100 (csökkenésnél 1 − p/100)",
      p: "kamatláb százalékban (éves, ha nincs más megadva)",
      n: "időszakok száma (általában évek)",
    },
    torlesztes: {
      a: "azonos törlesztő: ennyit fizetsz minden időszak végén",
      T: "tartozás / hitelösszeg (Tₖ a k. lépés utáni tartozás)",
      q: "kamattényező: évesen 1 + p/100, havonta 1 + p/1200",
      p: "éves kamatláb százalékban",
      n: "időszakok száma (évek vagy hónapok)",
      k: "hányadik időszak (index a tartozásnál)",
    },
    osszefoglalo: {
      a: "a sorozat tagja, vagy azonos törlesztő / befizetés",
      b: "a mértani sorozat egy tagja (összehasonlításkor)",
      d: "differencia: számtani lépés",
      q: "hányados vagy kamattényező",
      n: "tagok / időszakok száma",
      S: "az első n tag összege",
      A: "kezdőtőke",
      T: "végösszeg vagy hitelösszeg",
      p: "kamatláb százalékban",
    },
  };

  function tip(letter, katexHtml) {
    const src = katexHtml.textContent || "";
    const map = BASE[PAGE];
    if (PAGE === "osszefoglalo" && letter === "a") {
      if (/T/.test(src)) return "azonos törlesztő (annuitás)";
      if (/q/.test(src) && !/[₁ₙ]/.test(src)) return "azonos befizetés (járadék)";
      return "a sorozat egy tagja (a₁ az első)";
    }
    return map[letter] || null;
  }

  function ensureTipEl() {
    let el = document.getElementById("sym-tip");
    if (el) return el;
    el = document.createElement("div");
    el.id = "sym-tip";
    el.hidden = true;
    el.setAttribute("role", "tooltip");
    document.body.appendChild(el);
    return el;
  }

  function showTip(node, text) {
    const el = ensureTipEl();
    el.textContent = text;
    el.hidden = false;
    const r = node.getBoundingClientRect();
    const w = el.offsetWidth;
    const left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), innerWidth - w - 8);
    const top = r.top > 56 ? r.top - el.offsetHeight - 8 : r.bottom + 8;
    el.style.left = left + "px";
    el.style.top = top + "px";
  }

  function hideTip() {
    const el = document.getElementById("sym-tip");
    if (el) el.hidden = true;
  }

  function decorate(scope) {
    const root = scope || document;
    root.querySelectorAll(".katex-html").forEach((html) => {
      html.querySelectorAll(".mord.mathnormal, .mord.mathit, .mord.mathdefault").forEach((node) => {
        if (node.closest(".katex-mathml")) return;
        if (node.dataset.sym) return;
        const letter = (node.textContent || "").trim();
        if (!/^[A-Za-z]$/.test(letter)) return;
        const text = tip(letter, html);
        if (!text) return;
        node.dataset.sym = letter;
        node.dataset.tip = text;
        node.setAttribute("title", text);
        node.classList.add("sym");
      });
    });
  }

  // Egy úszó buborék: hover és billentyű-fókusz (telefonon tap = fókusz).
  if (!root.__symBound) {
    root.__symBound = true;
    document.addEventListener("mouseover", (e) => {
      const n = e.target.closest && e.target.closest(".sym");
      if (n) showTip(n, n.dataset.tip);
    });
    document.addEventListener("mouseout", (e) => {
      const n = e.target.closest && e.target.closest(".sym");
      if (n) hideTip();
    });
    document.addEventListener("click", (e) => {
      const n = e.target.closest && e.target.closest(".sym");
      if (n) showTip(n, n.dataset.tip);
      else hideTip();
    });
    document.addEventListener("scroll", hideTip, true);
  }

  root.decorateSymbols = decorate;
})(typeof globalThis !== "undefined" ? globalThis : this);
