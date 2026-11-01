import { useEffect, useRef } from "react";

// Elastic strap physics, ported from the portfolio.
// Pull the card as hard as you like: the strap stretches, thins, snaps back and bounces.
const G = 1500; // gravity
const K = 70; // strap stiffness

export default function Lanyard({ children }) {
  const rail = useRef(null);
  const swing = useRef(null);
  const strap = useRef(null);
  const card = useRef(null);

  useEffect(() => {
    const rl = rail.current;
    const sw = swing.current;
    const st = strap.current;
    const cd = card.current;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let L0 = 92;
    let Lr = L0 + G / K;
    let cx = 0;
    let x = 0, y = 0, vx = 0, vy = 0; // card position and velocity
    let ph = 0, pw = 0; // card angle and angular velocity
    let drag = false, tx = 0, ty = 0, ox = 0, oy = 0, mv = 0;
    let raf = 0, lt = 0, asleep = true;

    function draw() {
      const d = Math.max(1, Math.hypot(x, y));
      const a = Math.atan2(x, y);
      const s = d / Lr;
      const w = Math.max(4, Math.min(34, 30 / Math.sqrt(Math.max(s, 0.5))));
      st.style.left = cx - w / 2 + "px";
      st.style.width = w + "px";
      st.style.height = d + "px";
      st.style.transform = `rotate(${-a}rad)`;
      st.style.setProperty("--s", s.toFixed(3));
      sw.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${ph.toFixed(4)}rad)`;
    }

    function measure() {
      L0 = Math.max(64, Math.min(170, innerHeight - cd.offsetHeight - G / K - 190));
      Lr = L0 + G / K;
      cx = rl.clientWidth / 2;
      sw.style.left = cx - sw.offsetWidth / 2 + "px";
      rl.style.height = Lr + cd.offsetHeight + 30 + "px";
      if (still || asleep) {
        x = 0;
        y = Lr;
      }
      draw();
    }

    function phys(dt) {
      if (drag) {
        let nx = tx, ny = ty;
        const m = Math.hypot(nx, ny);
        if (m > 1500) {
          nx *= 1500 / m;
          ny *= 1500 / m;
        }
        vx = vx * 0.5 + ((nx - x) / dt) * 0.5;
        vy = vy * 0.5 + ((ny - y) / dt) * 0.5;
        x = nx;
        y = ny;
      } else {
        const d = Math.hypot(x, y) || 1e-6;
        const ux = x / d, uy = y / d;
        const f = -K * (d - L0);
        const vr = vx * ux + vy * uy;
        const tX = vx - vr * ux, tY = vy - vr * uy;
        vx += (f * ux - 3.2 * vr * ux - 1.7 * tX) * dt;
        vy += (G + f * uy - 3.2 * vr * uy - 1.7 * tY) * dt;
        x += vx * dt;
        y += vy * dt;
      }
      const tg = Math.max(-1.3, Math.min(1.3, Math.atan2(x, y) * 0.9));
      pw += (-70 * (ph - tg) - 5.5 * pw) * dt;
      ph += pw * dt;
    }

    function tick(t) {
      raf = 0;
      const dt = Math.min(0.05, (t - lt) / 1000 || 0.016);
      lt = t;
      const n = Math.ceil(dt / 0.008);
      const h = dt / n;
      for (let i = 0; i < n; i++) phys(h);
      draw();
      if (
        drag ||
        Math.abs(vx) + Math.abs(vy) > 0.6 ||
        Math.abs(x) > 0.15 ||
        Math.abs(y - Lr) > 0.15 ||
        Math.abs(pw) > 0.01 ||
        Math.abs(ph) > 0.002
      ) {
        raf = requestAnimationFrame(tick);
      } else {
        asleep = true;
        x = 0;
        y = Lr;
        ph = 0;
        pw = 0;
        draw();
      }
    }

    function wake() {
      if (still || raf) return;
      if (asleep) {
        asleep = false;
        lt = performance.now();
      }
      raf = requestAnimationFrame(tick);
    }

    const pos = (e) => {
      const r = rl.getBoundingClientRect();
      return [e.clientX - r.left - cx, e.clientY - r.top];
    };
    function onMove(e) {
      if (!drag) return;
      const p = pos(e);
      const nx = p[0] - ox, ny = p[1] - oy;
      mv += Math.abs(nx - tx) + Math.abs(ny - ty);
      tx = nx;
      ty = ny;
      wake();
    }
    function onUp() {
      if (!drag) return;
      drag = false;
      cd.classList.remove("grab");
      const m = Math.hypot(vx, vy);
      if (m > 3000) {
        vx *= 3000 / m;
        vy *= 3000 / m;
      }
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      removeEventListener("pointercancel", onUp);
      wake();
    }
    function onDown(e) {
      if (e.button > 0) return;
      const p = pos(e);
      drag = true;
      mv = 0;
      ox = p[0] - x;
      oy = p[1] - y;
      tx = x;
      ty = y;
      cd.classList.add("grab");
      addEventListener("pointermove", onMove);
      addEventListener("pointerup", onUp);
      addEventListener("pointercancel", onUp);
      wake();
    }
    const stopDrag = (e) => e.preventDefault();
    // a drag should not count as a click on the links inside the card
    const swallowClick = (e) => {
      if (mv > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (!still) {
      cd.addEventListener("pointerdown", onDown);
      cd.addEventListener("dragstart", stopDrag);
      cd.addEventListener("click", swallowClick, true);
    }

    measure();
    addEventListener("resize", measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    // one entrance: the card drops from partway up the strap and bounces to rest
    if (!still) {
      x = 0;
      y = L0 * 0.45;
      asleep = false;
      lt = performance.now();
      draw();
      wake();
    }

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", measure);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      removeEventListener("pointercancel", onUp);
      cd.removeEventListener("pointerdown", onDown);
      cd.removeEventListener("dragstart", stopDrag);
      cd.removeEventListener("click", swallowClick, true);
    };
  }, []);

  return (
    <div className="rail" ref={rail}>
      <span className="ring" aria-hidden="true" />
      <div className="strap" ref={strap} aria-hidden="true" />
      <div className="swing" ref={swing}>
        <div className="clip" aria-hidden="true" />
        <div className="idc" ref={card}>
          {children}
        </div>
      </div>
    </div>
  );
}
