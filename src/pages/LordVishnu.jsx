import React, { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════
   LORD VISHNU — The Preserver & Saviour of the Universe
   Antigravity / Zero-Gravity Cosmic Themed React Page
   ═══════════════════════════════════════════════════════ */

// ─── Google Fonts injection ───────────────────────────
const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Philosopher:wght@400;700&display=swap";

// ─── Colour tokens ───────────────────────────────────
const C = {
  cosmicBlack: "#06060e",
  deepIndigo: "#1a0a3e",
  violet: "#4b0082",
  saffron: "#ff9933",
  gold: "#ffd700",
  lightGold: "#ffe680",
  nebulaPink: "#c850c0",
  nebulaBlue: "#4158d0",
  white: "#f0e6d3",
  dimWhite: "rgba(240,230,211,0.7)",
};

// ─── Power emojis ─────────────────────────────────────
const EMOJIS = ["❤️‍🔥", "💥", "📈", "⚡️", "🦚"];

// ─── Section data ─────────────────────────────────────
const AVATARS = [
  { name: "Matsya", desc: "The Divine Fish who saved the Vedas during the great flood." },
  { name: "Kurma", desc: "The Cosmic Tortoise who supported Mount Mandara during the churning of the ocean." },
  { name: "Varaha", desc: "The Great Boar who rescued Earth from the cosmic waters." },
  { name: "Narasimha", desc: "The Half-Man Half-Lion who destroyed the demon Hiranyakashipu." },
  { name: "Vamana", desc: "The Dwarf Brahmin who measured the three worlds in three strides." },
  { name: "Parashurama", desc: "The Warrior Sage wielding the divine axe of Shiva." },
  { name: "Rama", desc: "The Ideal King and hero of the epic Ramayana." },
  { name: "Krishna", desc: "The Divine Charioteer and speaker of the Bhagavad Gita." },
  { name: "Buddha", desc: "The Enlightened One who taught the path of compassion." },
  { name: "Kalki", desc: "The Future Avatar who will end the age of darkness." },
];

const ATTRIBUTES = [
  { icon: "🔱", title: "Sudarshana Chakra", text: "The invincible spinning disc that destroys evil and protects dharma." },
  { icon: "🐚", title: "Shankha (Conch)", text: "Panchajanya — its sound represents the primordial vibration Om." },
  { icon: "🪷", title: "Padma (Lotus)", text: "Symbolises purity, beauty, and spiritual liberation." },
  { icon: "🏹", title: "Kaumodaki (Mace)", text: "Represents mental and physical strength of the Supreme Being." },
];

const QUOTES = [
  "Whenever dharma declines and adharma rises, I manifest Myself. — Bhagavad Gita 4.7",
  "I am the beginning, middle, and end of all beings. — Bhagavad Gita 10.20",
  "For the protection of the good, for the destruction of the wicked, I am born age after age. — Bhagavad Gita 4.8",
  "He who sees Me everywhere and sees everything in Me, I am never lost to him. — Bhagavad Gita 6.30",
];

// ─── CSS (injected into <style>) ──────────────────────
const STYLES = `
@import url('${GOOGLE_FONTS_URL}');

/* ── Reset & Base ─────────────────────────────────── */
.vishnu-page *,
.vishnu-page *::before,
.vishnu-page *::after { box-sizing: border-box; margin: 0; padding: 0; }

.vishnu-page {
  font-family: 'Philosopher', serif;
  background: ${C.cosmicBlack};
  color: ${C.white};
  overflow-x: hidden;
  min-height: 100vh;
  scroll-behavior: smooth;
  position: relative;
}

/* ── Starfield canvas ─────────────────────────────── */
.vishnu-starfield {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
}

/* ── Nebula blobs ─────────────────────────────────── */
.vishnu-nebula {
  position: fixed; border-radius: 50%; filter: blur(120px);
  opacity: 0.35; z-index: 0; pointer-events: none;
  animation: nebulaFloat 18s ease-in-out infinite alternate;
}
.vishnu-nebula--1 {
  width: 600px; height: 600px; top: -10%; left: -10%;
  background: radial-gradient(circle, ${C.nebulaBlue}, transparent 70%);
}
.vishnu-nebula--2 {
  width: 500px; height: 500px; bottom: -5%; right: -5%;
  background: radial-gradient(circle, ${C.nebulaPink}, transparent 70%);
  animation-delay: -7s;
}
.vishnu-nebula--3 {
  width: 400px; height: 400px; top: 40%; left: 55%;
  background: radial-gradient(circle, ${C.violet}, transparent 70%);
  animation-delay: -12s;
}

@keyframes nebulaFloat {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(40px, -30px) scale(1.15); }
  100% { transform: translate(-20px, 20px) scale(0.95); }
}

/* ── Content wrapper ──────────────────────────────── */
.vishnu-content { position: relative; z-index: 1; }

/* ── Navbar ───────────────────────────────────────── */
.vishnu-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: center;
  gap: 2rem; padding: 1rem 2rem;
  background: rgba(6,6,14,0.75); backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255,215,0,0.15);
  animation: floatNav 6s ease-in-out infinite;
}
.vishnu-nav a {
  color: ${C.gold}; text-decoration: none;
  font-family: 'Cinzel Decorative', serif;
  font-size: 0.85rem; letter-spacing: 2px;
  text-transform: uppercase; transition: color 0.3s, text-shadow 0.3s;
}
.vishnu-nav a:hover {
  color: ${C.saffron};
  text-shadow: 0 0 18px ${C.saffron};
}

@keyframes floatNav {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-4px); }
}

/* ── Hero ─────────────────────────────────────────── */
.vishnu-hero {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  padding: 6rem 2rem 4rem; position: relative;
}

/* Mandala ring */
.vishnu-mandala-wrap {
  position: relative; width: 280px; height: 280px;
  margin-bottom: 2rem;
}
.vishnu-mandala {
  position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid rgba(255,215,0,0.3);
  animation: spinMandala 30s linear infinite;
}
.vishnu-mandala::before, .vishnu-mandala::after {
  content: ''; position: absolute; inset: 18px; border-radius: 50%;
  border: 1.5px dashed rgba(255,153,51,0.4);
}
.vishnu-mandala::after { inset: 40px; border-style: dotted; animation: spinMandala 20s linear infinite reverse; }
.vishnu-mandala--inner {
  animation-direction: reverse; animation-duration: 22s;
  inset: 55px; border-color: rgba(75,0,130,0.5);
}

@keyframes spinMandala { to { transform: rotate(360deg); } }

/* Sudarshana Chakra */
.vishnu-chakra {
  position: absolute; top: 50%; left: 50%;
  width: 80px; height: 80px;
  transform: translate(-50%, -50%);
  font-size: 3.5rem; line-height: 80px; text-align: center;
  animation: spinChakra 4s linear infinite;
  filter: drop-shadow(0 0 18px ${C.saffron});
}
@keyframes spinChakra { to { transform: translate(-50%, -50%) rotate(360deg); } }

/* Title shimmer */
.vishnu-title {
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(2.2rem, 6vw, 4.5rem);
  font-weight: 900; line-height: 1.15;
  background: linear-gradient(
    90deg, ${C.gold}, ${C.saffron}, ${C.lightGold}, ${C.gold}
  );
  background-size: 300% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
@keyframes shimmer { to { background-position: 300% 0; } }

.vishnu-subtitle {
  margin-top: 1rem; font-size: 1.2rem;
  color: ${C.dimWhite}; max-width: 600px;
  animation: fadeUp 1.4s ease-out 0.5s both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Emoji strip ──────────────────────────────────── */
.vishnu-emoji-strip {
  display: flex; gap: 1.6rem; margin-top: 2rem;
  animation: floatStrip 5s ease-in-out infinite;
}
.vishnu-emoji-strip span {
  font-size: 2rem; cursor: default;
  transition: transform 0.3s;
}
.vishnu-emoji-strip span:hover { transform: scale(1.5) rotate(15deg); }

@keyframes floatStrip {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
}

/* ── Section (generic) ────────────────────────────── */
.vishnu-section {
  padding: 5rem 2rem; max-width: 1100px;
  margin: 0 auto;
  opacity: 0; transform: translateY(50px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.vishnu-section.vishnu-visible {
  opacity: 1; transform: translateY(0);
}

.vishnu-section-title {
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  text-align: center; margin-bottom: 3rem;
  color: ${C.gold};
  text-shadow: 0 0 30px rgba(255,215,0,0.3);
}

/* ── Cards grid ───────────────────────────────────── */
.vishnu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.8rem;
}

.vishnu-card {
  background: linear-gradient(145deg, rgba(26,10,62,0.6), rgba(6,6,14,0.8));
  border: 1px solid rgba(255,215,0,0.12);
  border-radius: 18px; padding: 2rem;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  animation: levitateIdle 6s ease-in-out infinite;
  cursor: default;
}
.vishnu-card:nth-child(even) { animation-delay: -3s; }
.vishnu-card:hover {
  transform: translateY(-14px) scale(1.03);
  box-shadow:
    0 0 30px rgba(255,215,0,0.25),
    0 20px 60px rgba(75,0,130,0.3);
}

@keyframes levitateIdle {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}

.vishnu-card__icon {
  font-size: 2.4rem; margin-bottom: 0.8rem;
}
.vishnu-card__name {
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.2rem; color: ${C.saffron}; margin-bottom: 0.5rem;
}
.vishnu-card__text {
  font-size: 0.95rem; color: ${C.dimWhite}; line-height: 1.6;
}

/* ── Quote section ────────────────────────────────── */
.vishnu-quotes {
  display: flex; flex-direction: column; gap: 2rem;
  align-items: center;
}
.vishnu-quote {
  max-width: 700px; text-align: center;
  font-style: italic; font-size: 1.15rem;
  color: ${C.lightGold}; line-height: 1.8;
  padding: 1.5rem 2rem;
  border-left: 3px solid ${C.saffron};
  background: rgba(255,153,51,0.04);
  border-radius: 0 12px 12px 0;
  animation: levitateIdle 7s ease-in-out infinite;
}
.vishnu-quote:nth-child(even) { animation-delay: -4s; }

/* ── Footer ───────────────────────────────────────── */
.vishnu-footer {
  text-align: center; padding: 3rem 2rem 2rem;
  border-top: 1px solid rgba(255,215,0,0.1);
  font-size: 0.85rem; color: ${C.dimWhite};
}
.vishnu-footer span { color: ${C.gold}; }

/* ── Scroll-to-top ────────────────────────────────── */
.vishnu-scroll-top {
  position: fixed; bottom: 2rem; right: 2rem;
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, ${C.saffron}, ${C.gold});
  color: ${C.cosmicBlack}; border: none; cursor: pointer;
  font-size: 1.4rem; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 20px rgba(255,153,51,0.4);
  transition: transform 0.3s, box-shadow 0.3s;
  z-index: 99; animation: levitateIdle 4s ease-in-out infinite;
}
.vishnu-scroll-top:hover {
  transform: translateY(-6px) scale(1.1);
  box-shadow: 0 0 30px rgba(255,215,0,0.6);
}

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 600px) {
  .vishnu-nav { gap: 1rem; font-size: 0.7rem; flex-wrap: wrap; }
  .vishnu-mandala-wrap { width: 200px; height: 200px; }
  .vishnu-chakra { font-size: 2.5rem; width: 60px; height: 60px; line-height: 60px; }
  .vishnu-section { padding: 3rem 1rem; }
  .vishnu-grid { grid-template-columns: 1fr; }
}
`;

// ═══════════════════════════════════════════════════════
// STARFIELD — 200+ canvas stars
// ═══════════════════════════════════════════════════════
function Starfield() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create 250 stars
    const COUNT = 250;
    starsRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      alpha: Math.random(),
      dAlpha: (Math.random() * 0.015 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of starsRef.current) {
        s.alpha += s.dAlpha;
        if (s.alpha <= 0 || s.alpha >= 1) s.dAlpha *= -1;
        s.alpha = Math.max(0, Math.min(1, s.alpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,240,${s.alpha})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="vishnu-starfield" />;
}

// ═══════════════════════════════════════════════════════
// SECTION WRAPPER — fade-in via IntersectionObserver
// ═══════════════════════════════════════════════════════
function Section({ id, children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`vishnu-section ${visible ? "vishnu-visible" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════
export default function LordVishnu() {
  const [showTop, setShowTop] = useState(false);

  // inject styles once
  useEffect(() => {
    const id = "vishnu-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  // show / hide scroll-to-top button
  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="vishnu-page">
      {/* Starfield */}
      <Starfield />

      {/* Nebula blobs */}
      <div className="vishnu-nebula vishnu-nebula--1" />
      <div className="vishnu-nebula vishnu-nebula--2" />
      <div className="vishnu-nebula vishnu-nebula--3" />

      {/* Content */}
      <div className="vishnu-content">
        {/* ── Navbar ──────────────────────────────── */}
        <nav className="vishnu-nav">
          {["hero", "avatars", "attributes", "quotes"].map((s) => (
            <a
              key={s}
              href={`#${s}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(s);
              }}
            >
              {s === "hero" ? "Home" : s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
        </nav>

        {/* ── Hero ────────────────────────────────── */}
        <header id="hero" className="vishnu-hero">
          {/* Mandala rings */}
          <div className="vishnu-mandala-wrap">
            <div className="vishnu-mandala" />
            <div className="vishnu-mandala vishnu-mandala--inner" />
            {/* Spinning Chakra */}
            <div className="vishnu-chakra" aria-hidden="true">☸</div>
          </div>

          <h1 className="vishnu-title">Lord Vishnu</h1>
          <p className="vishnu-subtitle">
            The Preserver &amp; Saviour of the Universe — sustaining cosmic order
            across infinite cycles of creation and dissolution.
          </p>

          {/* Emoji strip */}
          <div className="vishnu-emoji-strip" aria-hidden="true">
            {EMOJIS.map((e, i) => (
              <span key={i}>{e}</span>
            ))}
          </div>
        </header>

        {/* ── Dashavatar Section ──────────────────── */}
        <Section id="avatars">
          <h2 className="vishnu-section-title">The Dashavatara — Ten Divine Incarnations</h2>
          <div className="vishnu-grid">
            {AVATARS.map((a, i) => (
              <div key={i} className="vishnu-card">
                <div className="vishnu-card__icon">🙏</div>
                <div className="vishnu-card__name">{a.name}</div>
                <div className="vishnu-card__text">{a.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Attributes Section ─────────────────── */}
        <Section id="attributes">
          <h2 className="vishnu-section-title">Sacred Attributes</h2>
          <div className="vishnu-grid">
            {ATTRIBUTES.map((a, i) => (
              <div key={i} className="vishnu-card">
                <div className="vishnu-card__icon">{a.icon}</div>
                <div className="vishnu-card__name">{a.title}</div>
                <div className="vishnu-card__text">{a.text}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Quotes Section ─────────────────────── */}
        <Section id="quotes">
          <h2 className="vishnu-section-title">Divine Verses</h2>
          <div className="vishnu-quotes">
            {QUOTES.map((q, i) => (
              <blockquote key={i} className="vishnu-quote">"{q}"</blockquote>
            ))}
          </div>
        </Section>

        {/* ── Footer ─────────────────────────────── */}
        <footer className="vishnu-footer">
          <span>ॐ नमो नारायणाय</span> — Crafted with devotion
          <br />
          <div className="vishnu-emoji-strip" style={{ justifyContent: "center", marginTop: "1rem" }} aria-hidden="true">
            {EMOJIS.map((e, i) => (
              <span key={i}>{e}</span>
            ))}
          </div>
        </footer>
      </div>

      {/* Scroll-to-top */}
      {showTop && (
        <button
          className="vishnu-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}
