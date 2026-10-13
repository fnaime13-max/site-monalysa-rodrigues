/* Monalysa Rodrigues · Nutricionista
   Dados editáveis ficam no CONFIG; o resto do arquivo não precisa ser tocado. */

const CONFIG = {
  whatsapp: "5534991106189",
  whatsappMsg: "Oi, Monalysa! Vim pelo site e quero agendar minha consulta.",
  instagram: "https://www.instagram.com/monalysa_nutri/",
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js");

const waLink = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMsg)}`;
$$("[data-wa]").forEach((a) => (a.href = waLink));
$$('a[href*="instagram.com"]').forEach((a) => (a.href = CONFIG.instagram));
$("#year").textContent = new Date().getFullYear();

/* ==========================================================
   ROSAS-DO-DESERTO, desenhadas em canvas.
   Brotam na abertura (0 → 100%), saem de trás da moldura do hero,
   balançam com o mouse e soltam pétalas e folhas quando ele passa
   por cima. Depois de alguns segundos, rebrotam.
   ========================================================== */
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOutBack = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;

function drawPetal(ctx, R) {
  const w = R * 0.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-w * 0.1, -R * 0.2, -w * 1.0, -R * 0.45, -w * 0.86, -R * 0.8);
  ctx.bezierCurveTo(-w * 0.7, -R * 1.02, -w * 0.1, -R * 1.06, w * 0.2, -R * 0.95);
  ctx.bezierCurveTo(w * 0.62, -R * 0.99, w * 0.98, -R * 0.7, w * 0.72, -R * 0.45);
  ctx.bezierCurveTo(w * 0.5, -R * 0.25, w * 0.1, -R * 0.1, 0, 0);
  ctx.closePath();
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
  g.addColorStop(0, "#F8E8C6");
  g.addColorStop(0.13, "#F4D8B0");
  g.addColorStop(0.26, "#F9CBD7");
  g.addColorStop(0.55, "#F0A6BC");
  g.addColorStop(1, "#DE7E9D");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = "rgba(196, 90, 128, .35)";
  ctx.lineWidth = Math.max(0.6, R * 0.012);
  ctx.stroke();
}
function drawLeaf(ctx, L) {
  const W = L * 0.17;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(L * 0.45, -W * 1.6, L, 0);
  ctx.quadraticCurveTo(L * 0.45, W * 1.6, 0, 0);
  const g = ctx.createLinearGradient(0, -W, 0, W);
  g.addColorStop(0, "#94B29D");
  g.addColorStop(1, "#5D7E69");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(L * 0.05, 0);
  ctx.lineTo(L * 0.9, 0);
  ctx.strokeStyle = "rgba(235, 245, 236, .45)";
  ctx.lineWidth = Math.max(0.6, L * 0.012);
  ctx.stroke();
}
function drawBud(ctx, L) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-L * 0.2, -L * 0.25, -L * 0.14, -L * 0.75, 0, -L);
  ctx.bezierCurveTo(L * 0.14, -L * 0.75, L * 0.2, -L * 0.25, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, -L);
  g.addColorStop(0, "#C9688A");
  g.addColorStop(0.6, "#EBA0B6");
  g.addColorStop(1, "#F7C9D6");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.beginPath(); // cálice
  ctx.moveTo(-L * 0.13, 0);
  ctx.quadraticCurveTo(0, -L * 0.34, L * 0.13, 0);
  ctx.closePath();
  ctx.fillStyle = "#6F8B74";
  ctx.fill();
}
function drawThroat(ctx, R) {
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.24);
  g.addColorStop(0, "#D8B27A");
  g.addColorStop(0.55, "#F5E0B4");
  g.addColorStop(1, "rgba(246, 221, 164, 0)");
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(0, 0, R * 0.24, 0, TAU); ctx.fill();
  ctx.strokeStyle = "rgba(140, 80, 60, .45)";
  ctx.lineWidth = Math.max(0.5, R * 0.011);
  ctx.lineCap = "round";
  for (let i = 0; i < 5; i++) {
    for (let k = -1; k <= 1; k++) {
      const b = (i / 5) * TAU + 0.18 + k * 0.11, len = R * (0.27 - Math.abs(k) * 0.06);
      ctx.beginPath();
      ctx.moveTo(Math.sin(b) * R * 0.05, -Math.cos(b) * R * 0.05);
      ctx.lineTo(Math.sin(b) * len, -Math.cos(b) * len);
      ctx.stroke();
    }
  }
  ctx.fillStyle = "#9A6A4E";
  ctx.beginPath(); ctx.arc(0, 0, R * 0.035, 0, TAU); ctx.fill();
}

/* Chuva de pétalas: um canvas fixo por cima de tudo, que só roda enquanto algo cai */
const Rain = (() => {
  const c = document.createElement("canvas");
  c.className = "rain";
  c.setAttribute("aria-hidden", "true");
  document.body.append(c);
  const ctx = c.getContext("2d");
  let parts = [], raf = 0, dpr = 1;
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
  };
  size();
  addEventListener("resize", size);
  const tick = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter((p) => p.y < innerHeight + 80 && p.life > 0);
    for (const p of parts) {
      p.vy = Math.min(p.vy + 0.045, p.kind === "leaf" ? 2.2 : 1.6);
      p.vx *= 0.985;
      p.ph += p.fl;
      p.x += p.vx + Math.sin(p.ph) * 0.9;
      p.y += p.vy;
      p.ang += p.va;
      p.life -= 1 / 60;
      ctx.save();
      ctx.globalAlpha = clamp(p.life / 1.2);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.ang);
      ctx.scale(Math.cos(p.ph * 1.3) || 0.01, 1); // a pétala vira no ar
      p.kind === "leaf" ? drawLeaf(ctx, p.R) : drawPetal(ctx, p.R);
      ctx.restore();
    }
    raf = parts.length ? requestAnimationFrame(tick) : 0;
  };
  return {
    add(p) {
      parts.push(Object.assign({ vx: 0, vy: -0.4, va: (Math.random() - 0.5) * 0.06, ph: Math.random() * TAU, fl: 0.04 + Math.random() * 0.03, life: 9 }, p));
      if (!raf) raf = requestAnimationFrame(tick);
    },
  };
})();

/* Jardim: flores com o caule preso num ponto (bx, by), a cabeça em (hx, hy) */
class Garden {
  constructor(canvas, layout, { hidden = false } = {}) {
    this.c = canvas;
    this.ctx = canvas.getContext("2d");
    this.layout = layout;
    this.hidden = hidden;
    this.flowers = [];
    this.t = 0;
    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas);
  }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2), r = this.c.getBoundingClientRect();
    this.w = r.width; this.h = r.height;
    this.c.width = Math.round(r.width * dpr); this.c.height = Math.round(r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.flowers = this.layout(this).map((spec, i) => {
      const old = this.flowers[i];
      const fresh = {
        a: 0, va: 0, last: 0, phase: Math.random() * TAU,
        g: this.hidden ? 0 : 1, bloom: this.hidden ? 0 : 1,
        petals: Array.from({ length: 5 }, () => ({ s: 1, back: 0 })),
        leafSt: (spec.leaves || []).map(() => ({ s: 1, back: 0 })),
      };
      const keep = old ? { a: old.a, va: old.va, g: old.g, bloom: old.bloom, petals: old.petals, leafSt: old.leafSt, phase: old.phase } : {};
      return Object.assign(fresh, { leaves: [] }, spec, keep);
    });
    this.draw();
  }
  head(f) {
    const dx = (f.hx - f.bx) * f.g, dy = (f.hy - f.by) * f.g, c = Math.cos(f.a), s = Math.sin(f.a);
    return { x: f.bx + dx * c - dy * s, y: f.by + dx * s + dy * c };
  }
  corolla(f) { return f.rot + f.a * 1.6 + (1 - f.bloom) * 1.3; }
  leafPos(f, i) {
    const spec = f.leaves[i], h = this.head(f);
    const px = f.bx + (h.x - f.bx) * spec.t, py = f.by + (h.y - f.by) * spec.t;
    const ang = Math.atan2(h.y - f.by, h.x - f.bx) + spec.ang + f.a * 0.6;
    return { px, py, ang, mx: px + Math.cos(ang) * f.leafLen * 0.5, my: py + Math.sin(ang) * f.leafLen * 0.5 };
  }
  step(now) {
    this.t += 1 / 60;
    for (const f of this.flowers) {
      const breeze = Math.sin(this.t * 0.9 + f.phase) * 0.0006;
      f.va = (f.va - f.a * 0.018 + breeze) * 0.93;
      f.a = clamp(f.a + f.va, -0.4, 0.4);
      for (const p of [...f.petals, ...f.leafSt]) if (p.s < 1 && now > p.back) p.s = Math.min(1, p.s + 0.02);
    }
  }
  // o mouse empurra as flores por perto; passando por cima, derruba pétalas e folhas
  pointer(x, y, vx, vy, now, toView) {
    const speed = Math.hypot(vx, vy);
    for (const f of this.flowers) {
      if (f.g < 1) continue;
      const h = this.head(f), d = Math.hypot(x - h.x, y - h.y);
      const sx = h.x - f.bx, sy = h.y - f.by, len2 = sx * sx + sy * sy || 1;
      if (d < f.r * 3) f.va += ((sx * vy - sy * vx) / len2) * (1 - d / (f.r * 3)) * 0.5;
      if (!f.bud && d < f.r * 1.25 && speed > 1 && now - f.last > 110) { f.last = now; this.shedPetal(f, now, toView, vx); }
      f.leaves.forEach((_, i) => {
        const lp = this.leafPos(f, i);
        if (f.leafSt[i].s >= 1 && speed > 1 && Math.hypot(x - lp.mx, y - lp.my) < f.leafLen * 0.38) this.shedLeaf(f, i, now, toView, vx);
      });
    }
  }
  burst(x, y, now, toView) {
    for (const f of this.flowers) {
      const h = this.head(f);
      if (!f.bud && Math.hypot(x - h.x, y - h.y) < f.r * 1.6) {
        f.va += 0.04;
        for (let k = 0; k < 3; k++) this.shedPetal(f, now, toView, (Math.random() - 0.5) * 6);
      }
    }
  }
  shedPetal(f, now, toView, vx, wait = 2400) {
    const live = f.petals.map((p, i) => [p, i]).filter(([p]) => p.s >= 1);
    if (!live.length) return;
    const [p, i] = live[(Math.random() * live.length) | 0];
    p.s = 0; p.back = now + wait + Math.random() * 1200;
    const h = this.head(f), ang = this.corolla(f) + (i / 5) * TAU + 0.4, v = toView(h.x, h.y);
    Rain.add({ kind: "petal", x: v.x, y: v.y, ang, R: f.r * clamp(f.bloom) * (wait > 1e8 ? 0.7 : 0.92), vx: vx * 0.12 + Math.sin(ang) * 0.9, vy: -Math.cos(ang) * 0.7 - 0.3 });
  }
  shedLeaf(f, i, now, toView, vx, wait = 3800) {
    const st = f.leafSt[i];
    st.s = 0; st.back = now + wait + Math.random() * 1500;
    const lp = this.leafPos(f, i), v = toView(lp.px, lp.py);
    Rain.add({ kind: "leaf", x: v.x, y: v.y, ang: lp.ang, R: f.leafLen, vx: vx * 0.1, vy: -0.2 });
  }
  shedAll(toView) {
    const now = performance.now();
    for (const f of this.flowers) {
      if (!f.bud) for (let k = 0; k < 2; k++) this.shedPetal(f, now, toView, (Math.random() - 0.5) * 8, 1e9);
      f.leaves.forEach((_, i) => Math.random() < 0.3 && this.shedLeaf(f, i, now, toView, (Math.random() - 0.5) * 6, 1e9));
    }
  }
  draw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);
    const live = this.flowers.filter((f) => f.g > 0.01);
    for (const f of live) { // 1º: caules e folhas, para nenhum caule cruzar por cima de uma flor
      const h = this.head(f);
      ctx.strokeStyle = "#7C8665";
      ctx.lineCap = "round";
      ctx.lineWidth = Math.max(2, f.r * 0.08);
      ctx.beginPath();
      ctx.moveTo(f.bx, f.by);
      ctx.quadraticCurveTo((f.bx + h.x) / 2 + f.r * 0.35, (f.by + h.y) / 2, h.x, h.y);
      ctx.stroke();
      f.leaves.forEach((_, i) => {
        const s = f.leafSt[i].s * clamp(f.g * 1.4 - 0.4);
        if (s <= 0.02) return;
        const lp = this.leafPos(f, i);
        ctx.save(); ctx.translate(lp.px, lp.py); ctx.rotate(lp.ang); ctx.scale(s, s);
        drawLeaf(ctx, f.leafLen);
        ctx.restore();
      });
    }
    for (const f of live) { // 2º: flores e botões
      const h = this.head(f);
      ctx.save();
      ctx.translate(h.x, h.y);
      if (f.bud) {
        const s = clamp(f.bloom);
        ctx.rotate(Math.atan2(h.y - f.by, h.x - f.bx) + Math.PI / 2 + f.a);
        ctx.scale(s, s);
        drawBud(ctx, f.r);
      } else {
        const b = Math.max(0, easeOutBack(clamp(f.bloom)));
        ctx.rotate(this.corolla(f));
        for (let i = 0; i < 5; i++) {
          const p = f.petals[i];
          if (p.s * b <= 0.02) continue;
          ctx.save(); ctx.rotate((i / 5) * TAU + 0.18); ctx.rotate(0.22); ctx.scale(p.s * b, p.s * b); // leve cata-vento, como na rosa-do-deserto
          drawPetal(ctx, f.r);
          ctx.restore();
        }
        if (b > 0.05) { ctx.scale(b, b); drawThroat(ctx, f.r); }
      }
      ctx.restore();
    }
  }
  loop(update) {
    if (this.running) return;
    this.running = true;
    const tick = (now) => {
      if (!this.running) return;
      update && update(now);
      this.step(now);
      this.draw();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }
}

const leaf = (t, ang) => ({ t, ang });

/* Flores em volta da moldura em arco; o caule nasce atrás da foto */
function heroGarden() {
  const hero = $("#inicio"), canvas = $("#heroGarden"), mirror = $(".mirror__glass");
  const gd = new Garden(canvas, () => {
    const m = mirror.getBoundingClientRect(), c = canvas.getBoundingClientRect();
    const M = { x: m.left - c.left, y: m.top - c.top, w: m.width, h: m.height };
    const out = M.x < 70 ? 0.5 : 1; // no celular sobra pouca margem: as flores saem menos
    const X = (fx) => M.x + (fx < 0 ? fx * out : fx > 1 ? 1 + (fx - 1) * out : fx) * M.w;
    const F = ([bx, by], [hx, hy], r, rot, extra = {}) =>
      Object.assign({ bx: X(bx), by: M.y + by * M.h, hx: X(hx), hy: M.y + hy * M.h, r: r * M.w, rot, leafLen: M.w * 0.12 }, extra);
    // [cabeça x, cabeça y, tamanho] em frações da moldura; o caule nasce atrás da foto
    // um buquê só, saindo do canto superior esquerdo da moldura
    const heads = [
      [-0.08, 0.33, 0.085], [-0.03, 0.26, 0.07], [-0.12, 0.22, 0.08], [-0.05, 0.155, 0.095], [-0.15, 0.11, 0.07],
      [0.02, 0.075, 0.08], [0.1, 0.025, 0.085], [0.2, -0.015, 0.075], [0.31, -0.04, 0.07],
      [-0.04, 0.0, 0.065], [0.14, -0.07, 0.065], [0.4, -0.055, 0.06],
    ];
    const buds = [[-0.1, 0.29], [0.25, -0.08], [-0.11, 0.045], [0.36, -0.095], [0.05, -0.04]];
    const base = () => [0.32, 0.3];
    return [
      ...heads.map(([hx, hy, r], i) => F(base(hx, hy), [hx, hy], r, i * 1.7, { leaves: i % 3 ? [] : [leaf(0.74, i % 2 ? 0.85 : -0.85)] })),
      ...buds.map(([hx, hy]) => F(base(hx, hy), [hx, hy], 0.06, 0, { bud: true })),
    ];
  }, { hidden: !reduced });
  if (reduced) return;

  const toView = (x, y) => { const r = canvas.getBoundingClientRect(); return { x: r.left + x, y: r.top + y }; };
  let prev = null;
  hero.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (prev) gd.pointer(x, y, x - prev.x, y - prev.y, performance.now(), toView);
    prev = { x, y };
  });
  hero.addEventListener("pointerleave", () => (prev = null));
  hero.addEventListener("pointerdown", (e) => {
    const r = canvas.getBoundingClientRect();
    gd.burst(e.clientX - r.left, e.clientY - r.top, performance.now(), toView);
  });

  // depois da abertura, as flores brotam de trás da moldura, uma a uma
  let t0 = 0;
  const grow = (now) => {
    if (!t0) return;
    gd.flowers.forEach((f, i) => {
      const e = (now - t0) / 1000 - i * 0.045;
      f.g = clamp(e / 0.75);
      f.bloom = clamp((e - 0.4) / 0.6);
    });
  };
  new IntersectionObserver(([en]) => (en.isIntersecting ? gd.loop(grow) : gd.stop())).observe(hero);
  return { start: () => (t0 = performance.now()) };
}

/* ---------- abertura 0 → 100%: as flores brotam junto com a semana ---------- */
function runLoader(done) {
  const loader = $("#loader");
  const countEl = $("#count");
  const days = $$(".loader__week li");
  const dur = reduced ? 500 : 2800;
  let loaded = document.readyState === "complete";
  addEventListener("load", () => (loaded = true));

  let gd = null;
  if (!reduced) {
    gd = new Garden($(".loader__garden"), (g) => {
      const W = g.w, H = g.h, k = clamp(Math.min(W, H) / 820, 0.6, 1.25);
      const F = (b, hd, r, rot, extra = {}) =>
        Object.assign({ bx: b[0] * W, by: b[1] * H, hx: hd[0] * W, hy: hd[1] * H, r: r * k, rot, leafLen: 46 * k }, extra);
      // dois buquês nos cantos, com várias florzinhas
      const corner = (bx, by, pts) => pts.map(([hx, hy, r], i) =>
        r ? F([bx, by], [hx, hy], r, i * 1.9, { leaves: i % 2 ? [] : [leaf(0.62, i % 4 ? 0.8 : -0.8)] }) : F([bx, by], [hx, hy], 26, 0, { bud: true }));
      const bl = corner(-0.04, 1.06, [[0.1, 0.8, 44], [0.2, 0.9, 36], [0.04, 0.63, 38], [0.17, 0.7, 0], [0.28, 0.97, 30], [0.08, 0.92, 32], [0.13, 0.57, 0], [0.02, 0.76, 30], [0.24, 0.81, 34]]);
      const tr = corner(1.04, -0.06, [[0.88, 0.2, 44], [0.78, 0.08, 36], [0.96, 0.38, 38], [0.84, 0.31, 0], [0.71, 0.03, 30], [0.92, 0.07, 32], [0.87, 0.43, 0], [0.98, 0.22, 30], [0.76, 0.18, 34]]);
      return bl.flatMap((f, i) => [f, tr[i]]);
    }, { hidden: true });
  }

  let prog = 0;
  const start = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  const tick = (now) => {
    let p = ease(Math.min(1, (now - start) / dur));
    if (!loaded) p = Math.min(p, 0.99);
    prog = p;
    const v = Math.round(p * 100);
    countEl.textContent = v;
    days.forEach((d, i) => d.classList.toggle("is-on", v >= ((i + 1) * 100) / 7 - 0.5));
    if (p < 1) requestAnimationFrame(tick);
    else finish();
  };
  if (gd) gd.loop(() => {
    const n = gd.flowers.length;
    gd.flowers.forEach((f, i) => {
      const s0 = (i / n) * 0.72;
      f.g = clamp((prog - s0) / 0.18);
      f.bloom = clamp((prog - s0 - 0.1) / 0.2);
    });
  });
  requestAnimationFrame(tick);

  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    setTimeout(() => {
      if (gd) { gd.shedAll((x, y) => ({ x, y })); } // as pétalas voam quando a cortina sobe
      loader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      done();
      setTimeout(() => { loader.classList.add("is-gone"); gd && gd.stop(); }, 1100);
    }, reduced ? 0 : 420);
  }
}

/* ---------- quarta-feira é dia de rosa ---------- */
function wednesday() {
  const now = new Date();
  const dow = now.getDay(); // 0 dom … 3 qua
  const idx = (dow + 6) % 7; // 0 seg … 6 dom
  const until = (3 - dow + 7) % 7;
  const sticker = $("#wedSticker");
  const status = $("#wedStatus");
  const days = $$("#wedDays li");
  days[idx] && days[idx].classList.add("is-today");
  if (until === 0) {
    sticker.textContent = "Hoje é quarta: dia de rosa!";
    status.innerHTML = "Hoje é quarta. <em>Cadê o seu rosa?</em>";
    days[2].classList.add("is-bounce");
    document.documentElement.classList.add("is-wednesday");
  } else if (until === 1) {
    sticker.textContent = "Amanhã é quarta: separa o rosa.";
    status.innerHTML = "Amanhã é quarta. <em>Já separou o rosa?</em>";
  } else {
    sticker.textContent = "Na quarta, a gente usa rosa.";
    status.innerHTML = `Faltam ${until} dias para a quarta. <em>Vai de rosa?</em>`;
  }
}

/* ---------- topo, menu e links ativos ---------- */
function header() {
  const top = $("#top"), btn = $("#menuBtn"), nav = $("#nav");
  const onScroll = () => {
    top.classList.toggle("is-solid", scrollY > 10);
    $(".wa-float").classList.toggle("is-in", scrollY > innerHeight * 0.7);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const close = () => { nav.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); btn.querySelector(".sr-only").textContent = "Abrir menu"; };
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open));
    btn.querySelector(".sr-only").textContent = open ? "Fechar menu" : "Abrir menu";
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", close));
  addEventListener("keydown", (e) => e.key === "Escape" && btn.getAttribute("aria-expanded") === "true" && (close(), btn.focus()));

  const links = $$('.nav ul a');
  const io = new IntersectionObserver((ens) => ens.forEach((en) => {
    if (!en.isIntersecting) return;
    links.forEach((l) => (l.getAttribute("href") === "#" + en.target.id ? l.setAttribute("aria-current", "true") : l.removeAttribute("aria-current")));
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((l) => { const s = $(l.getAttribute("href")); s && io.observe(s); });
}

/* ---------- frase do reflexo se pinta com a rolagem; a semana enche junto ---------- */
function reflexo() {
  const h = $("[data-words]");
  const wrap = (node) => {
    [...node.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) frag.append(t);
          else { const s = document.createElement("span"); s.className = "w"; s.textContent = t; frag.append(s); }
        });
        c.replaceWith(frag);
      } else wrap(c);
    });
  };
  wrap(h);
  const words = $$(".w", h);
  const week = $$(".week span");
  const sec = $("#reflexo");
  const update = () => {
    const r = sec.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height * 0.75)));
    const on = Math.round(p * words.length * 1.1);
    words.forEach((w, i) => w.classList.toggle("is-on", i < on));
    week.forEach((d, i) => d.style.setProperty("--fill", Math.min(1, Math.max(0, p * 7 - i)).toFixed(3)));
  };
  if (reduced) { words.forEach((w) => w.classList.add("is-on")); week.forEach((d) => d.style.setProperty("--fill", 1)); return; }
  let q = false;
  addEventListener("scroll", () => { if (!q) { q = true; requestAnimationFrame(() => { update(); q = false; }); } }, { passive: true });
  update();
}

/* ---------- abas Leve / Mente ---------- */
function tabs() {
  const tabs = $$('[role="tab"]');
  const select = (t) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1;
      $("#" + x.getAttribute("aria-controls")).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("mouseenter", () => matchMedia("(hover: hover)").matches && select(t));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      select(n); n.focus();
    });
  });
}

/* ---------- dúvidas ---------- */
function faq() {
  $$(".faq__item button").forEach((b) => b.addEventListener("click", () => {
    const open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", String(open));
    $("#" + b.getAttribute("aria-controls")).hidden = !open;
  }));
}

/* ---------- revelação ao rolar ---------- */
function reveals() {
  const io = new IntersectionObserver((ens) => ens.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 70}ms`; io.observe(el); });
}

/* ---------- início ---------- */
wednesday();
header();
reflexo();
tabs();
faq();
reveals();

const hg = heroGarden();
runLoader(() => hg && hg.start());
