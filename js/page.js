/** Közös indítás: feladatok + KaTeX a teljes oldalon. */
(function () {
  function renderTex() {
    if (!window.renderMathInElement) return;
    renderMathInElement(document.body, {
      delimiters: [
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
    });
  }

  window.startPage = function (list) {
    const run = function () {
      if (window.Feladat) Feladat.mount(list);
      renderTex();
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    window.addEventListener("load", renderTex);
  };
})();
