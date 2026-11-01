/**
 * Interaktív gyakorlat: mezők, ellenőrzés, hint, megoldás.
 */
(function (root) {
  function parseNum(raw) {
    if (raw == null) return NaN;
    const t = String(raw).trim().replace(/\s/g, "").replace(",", ".");
    return Number(t);
  }

  function ok(got, expected, type) {
    if (!Number.isFinite(got)) return false;
    if (type === "int" || type === "years") return got === expected;
    if (type === "money") return Math.round(got) === Math.round(expected);
    const eps = type === "rate" ? 0.05 : 0.05;
    return Math.abs(got - expected) <= eps;
  }

  function fieldBlock(f) {
    const hint = f.suffix ? `<span class="suffix">${f.suffix}</span>` : "";
    return `
      <label class="field">
        <span>${f.label}</span>
        <span class="input-wrap">
          <input inputmode="decimal" autocomplete="off" data-key="${f.key}" aria-label="${f.label}" />
          ${hint}
        </span>
      </label>`;
  }

  function card(ex) {
    const answers = ex.compute(root.Matek);
    const fields = ex.fields.map(fieldBlock).join("");
    return `
      <section class="card practice" id="${ex.id}">
        <p class="kicker">Gyakorlat</p>
        <div class="q">${ex.question}</div>
        <form class="fields" data-ex="${ex.id}">
          ${fields}
          <div class="actions">
            <button type="submit">Ellenőrzés</button>
            <button type="button" class="ghost" data-hint>Segítség</button>
            <button type="button" class="ghost" data-sol>Megoldás</button>
          </div>
          <p class="hint" hidden>${ex.hint}</p>
          <p class="feedback" role="status"></p>
        </form>
      </section>`;
  }

  function bind(form, ex) {
    const answers = ex.compute(root.Matek);
    const feedback = form.querySelector(".feedback");
    const hintEl = form.querySelector(".hint");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let all = true;
      const bits = [];
      for (const f of ex.fields) {
        const input = form.querySelector(`[data-key="${f.key}"]`);
        const got = parseNum(input.value);
        const good = ok(got, answers[f.key], f.type);
        input.classList.toggle("good", good);
        input.classList.toggle("bad", !good);
        all = all && good;
        bits.push(good ? `${f.label}: helyes` : `${f.label}: még nem`);
      }
      feedback.className = "feedback " + (all ? "ok" : "err");
      feedback.textContent = all ? "Ügyes, ez stimmel." : bits.join(" · ");
    });

    form.querySelector("[data-hint]").addEventListener("click", () => {
      hintEl.hidden = !hintEl.hidden;
    });

    form.querySelector("[data-sol]").addEventListener("click", () => {
      for (const f of ex.fields) {
        const input = form.querySelector(`[data-key="${f.key}"]`);
        const v = answers[f.key];
        input.value = f.type === "money" ? String(Math.round(v)) : String(v);
        input.classList.remove("bad");
        input.classList.add("good");
      }
      feedback.className = "feedback ok";
      feedback.textContent = "A megoldás beírva. Nézd át a lépéseket a példánál.";
    });
  }

  function mount(list) {
    for (const ex of list) {
      const slot = document.querySelector(`[data-exercise="${ex.id}"]`);
      if (!slot) continue;
      slot.innerHTML = card(ex);
      bind(slot.querySelector("form"), ex);
    }
    if (root.renderMathInElement) {
      root.renderMathInElement(document.body, {
        delimiters: [
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
      });
    }
  }

  root.Feladat = { mount, ok, parseNum };
})(typeof globalThis !== "undefined" ? globalThis : this);
