import React, { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────
   Google Fonts – injected once via a <style> tag
   ──────────────────────────────────────────────────────────── */
const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Philosopher:ital,wght@0,400;0,700;1,400&display=swap');
`;

/* ────────── colour tokens ────────── */
const C = {
  bg: "#030014",
  gold: "#FFD700",
  saffron: "#FF9933",
  indigo: "#4B0082",
  violet: "#7F00FF",
  white: "#F0E6D3",
  card: "rgba(75, 0, 130, 0.18)",
  cardBorder: "rgba(255, 215, 0, 0.25)",
};

/* ────────── emoji strip ────────── */
const EMOJIS = ["❤️‍🔥", "💥", "📈", "⚡️", "🦚"];

/* ────────── nav links ────────── */
const NAV = [
  { label: "Home", to: "hero" },
  { label: "About", to: "about" },
  { label: "Avatars", to: "avatars" },
  { label: "Powers", to: "powers" },
  { label: "Mantras", to: "mantras" },
  { label: "Gallery", to: "gallery" },
];

/* ────────── Dashavatar data ────────── */
const AVATARS = [
  { name: "Matsya", desc: "The Fish – saved sacred texts from a great deluge", icon: "🐟" },
  { name: "Kurma", desc: "The Tortoise – supported Mount Mandara during the churning of the ocean", icon: "🐢" },
  { name: "Varaha", desc: "The Boar – rescued Earth from the cosmic ocean", icon: "🐗" },
  { name: "Narasimha", desc: "The Man-Lion – destroyed the tyrant Hiranyakashipu", icon: "🦁" },
  { name: "Vamana", desc: "The Dwarf – reclaimed the three worlds from Bali", icon: "👣" },
  { name: "Parashurama", desc: "The Warrior Sage – vanquished corrupt warriors", icon: "🪓" },
  { name: "Rama", desc: "The Perfect King – embodiment of dharma and virtue", icon: "🏹" },
  { name: "Krishna", desc: "The Divine Statesman – delivered the Bhagavad Gita", icon: "🦚" },
  { name: "Buddha", desc: "The Enlightened One – taught compassion and non-violence", icon: "🪷" },
  { name: "Kalki", desc: "The Future Warrior – will end the age of darkness", icon: "🐴" },
];

/* ────────── powers data ────────── */
const POWERS = [
  { title: "Sudarshana Chakra", desc: "The invincible discus that annihilates evil across all dimensions.", icon: "☀️" },
  { title: "Shankha (Conch)", desc: "Panchajanya – its sound dispels darkness and heralds cosmic order.", icon: "🐚" },
  { title: "Kaumodaki (Mace)", desc: "Represents the power of knowledge that crushes ignorance.", icon: "⚔️" },
  { title: "Padma (Lotus)", desc: "Symbolises purity, creation, and the unfolding of the universe.", icon: "🪷" },
  { title: "Yoga Maya", desc: "The divine illusion through which the cosmos is projected and sustained.", icon: "✨" },
  { title: "Preservation", desc: "Maintains cosmic balance – sustaining all life between creation and dissolution.", icon: "🌀" },
];

/* ────────── mantras data ────────── */
const MANTRAS = [
  { sanskrit: "ॐ नमो नारायणाय", transliteration: "Om Namo Narayanaya", meaning: "Salutations to Lord Narayana, the supreme refuge of all beings." },
  { sanskrit: "ॐ नमो भगवते वासुदेवाय", transliteration: "Om Namo Bhagavate Vasudevaya", meaning: "I bow to Lord Vasudeva, the all-pervading Supreme Being." },
  { sanskrit: "शान्ताकारं भुजगशयनं", transliteration: "Shantakaram Bhujagashayanam", meaning: "He who is the embodiment of peace, reclining on the serpent Shesha." },
];

/* ═══════════════════════════════════════════════════════════
   CSS (injected into <style>)
   ═══════════════════════════════════════════════════════════ */
const CSS = `
${FONT_IMPORT}

/* ── resets & base ── */
.vishnu-page *,
.vishnu-page *::before,
.vishnu-page *::after { margin:0; padding:0; box-sizing:border-box; }

.vishnu-page {
  font-family: 'Philosopher', serif;
  background: ${C.bg};
  color: ${C.white};
  overflow-x: hidden;
  position: relative;
  scroll-behavior: smooth;
}

/* ── starfield canvas ── */
.vishnu-page .star-canvas {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
}

/* ── nebula blobs ── */
.vishnu-page .nebula {
  position: fixed; border-radius: 50%; filter: blur(120px);
  pointer-events: none; z-index: 0; opacity: 0.35;
  animation: nebulaDrift 18s ease-in-out infinite alternate;
}
.vishnu-page .nebula.n1 { width:600px; height:600px; top:-10%; left:-10%; background: radial-gradient(circle, ${C.violet}, transparent); }
.vishnu-page .nebula.n2 { width:500px; height:500px; bottom:-5%; right:-8%; background: radial-gradient(circle, ${C.indigo}, transparent); animation-delay:-6s; }
.vishnu-page .nebula.n3 { width:450px; height:450px; top:40%; left:50%; background: radial-gradient(circle, ${C.saffron}44, transparent); animation-delay:-12s; }

@keyframes nebulaDrift {
  0%   { transform: translate(0,0) scale(1); }
  100% { transform: translate(40px, -30px) scale(1.15); }
}

/* ── nav ── */
.vishnu-page .nav {
  position: fixed; top:0; left:0; right:0; z-index:100;
  display:flex; justify-content:center; gap:1.5rem;
  padding: 1rem 2rem;
  background: rgba(3,0,20,0.75); backdrop-filter: blur(12px);
  border-bottom: 1px solid ${C.cardBorder};
  animation: floatSlow 6s ease-in-out infinite;
}
.vishnu-page .nav a {
  color: ${C.gold}; text-decoration:none; font-weight:700;
  font-family:'Cinzel Decorative',serif; font-size:0.85rem;
  letter-spacing:0.1em; transition: color 0.3s, text-shadow 0.3s;
}
.vishnu-page .nav a:hover {
  color: ${C.saffron};
  text-shadow: 0 0 12px ${C.saffron};
}

/* ── sections ── */
.vishnu-page section {
  position: relative; z-index:1; padding: 6rem 2rem;
  max-width: 1200px; margin: 0 auto;
}

/* ── scroll fade-in ── */
.vishnu-page .fade-section {
  opacity: 0; transform: translateY(50px);
  transition: opacity 0.9s ease-out, transform 0.9s ease-out;
}
.vishnu-page .fade-section.visible {
  opacity: 1; transform: translateY(0);
}

/* ── hero ── */
.vishnu-page .hero {
  min-height: 100vh; display:flex; flex-direction:column;
  align-items:center; justify-content:center; text-align:center;
  gap: 1.5rem;
}

/* mandala ring */
.vishnu-page .mandala-wrap { position: relative; width:260px; height:260px; margin-bottom:1rem; }
.vishnu-page .mandala-ring {
  position: absolute; inset:0; border-radius:50%;
  border: 2px solid ${C.gold}44;
  animation: spinCW 20s linear infinite;
}
.vishnu-page .mandala-ring::before {
  content:''; position:absolute; inset:18px; border-radius:50%;
  border: 2px dashed ${C.saffron}55;
  animation: spinCCW 14s linear infinite;
}
.vishnu-page .mandala-ring::after {
  content:''; position:absolute; inset:36px; border-radius:50%;
  border: 2px dotted ${C.violet}66;
  animation: spinCW 10s linear infinite;
}

/* chakra */
.vishnu-page .chakra {
  position: absolute; top:50%; left:50%; transform: translate(-50%,-50%);
  font-size: 5rem; animation: spinCW 4s linear infinite;
  filter: drop-shadow(0 0 24px ${C.gold});
}

@keyframes spinCW  { to { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes spinCCW { to { transform: rotate(-360deg); } }

/* shimmer heading */
.vishnu-page .shimmer {
  font-family:'Cinzel Decorative', serif;
  font-size: clamp(2.2rem, 5vw, 4rem); font-weight:900;
  background: linear-gradient(
    110deg,
    ${C.gold} 0%, ${C.saffron} 25%, ${C.violet} 50%, ${C.gold} 75%, ${C.saffron} 100%
  );
  background-size: 300% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmerMove 4s linear infinite;
}
@keyframes shimmerMove {
  0%   { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

.vishnu-page .subtitle {
  font-size: 1.25rem; opacity:0.85; max-width:600px; line-height:1.6;
  animation: floatSlow 7s ease-in-out infinite;
}

/* ── floating emoji strip ── */
.vishnu-page .emoji-strip {
  display:flex; gap:2rem; justify-content:center;
  padding: 1.5rem 0; font-size:2rem;
  animation: floatSlow 5s ease-in-out infinite;
}
.vishnu-page .emoji-strip span {
  animation: emojiPulse 2s ease-in-out infinite;
  cursor: default;
}
.vishnu-page .emoji-strip span:nth-child(2) { animation-delay:0.3s; }
.vishnu-page .emoji-strip span:nth-child(3) { animation-delay:0.6s; }
.vishnu-page .emoji-strip span:nth-child(4) { animation-delay:0.9s; }
.vishnu-page .emoji-strip span:nth-child(5) { animation-delay:1.2s; }

@keyframes emojiPulse {
  0%,100% { transform: scale(1) translateY(0); }
  50%     { transform: scale(1.25) translateY(-10px); }
}

/* ── card grid ── */
.vishnu-page .card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem; margin-top: 2.5rem;
}

/* ── levitating card ── */
.vishnu-page .lev-card {
  background: ${C.card};
  border: 1px solid ${C.cardBorder};
  border-radius: 1rem; padding: 2rem; text-align:center;
  animation: floatSlow 6s ease-in-out infinite;
  transition: transform 0.4s, box-shadow 0.4s;
  backdrop-filter: blur(6px);
}
.vishnu-page .lev-card:nth-child(even) { animation-delay:-3s; }
.vishnu-page .lev-card:hover {
  transform: translateY(-14px) scale(1.03);
  box-shadow: 0 0 40px ${C.gold}55, 0 0 80px ${C.violet}33;
}
.vishnu-page .lev-card .card-icon { font-size:3rem; margin-bottom:0.75rem; display:block; }
.vishnu-page .lev-card h3 {
  font-family:'Cinzel Decorative',serif; color:${C.gold};
  font-size:1.15rem; margin-bottom:0.5rem;
}
.vishnu-page .lev-card p { font-size:0.95rem; opacity:0.85; line-height:1.5; }

/* ── about section ── */
.vishnu-page .about-text {
  max-width:800px; margin:0 auto; text-align:center;
  font-size:1.1rem; line-height:1.8; animation: floatSlow 8s ease-in-out infinite;
}

/* ── section heading ── */
.vishnu-page .sec-title {
  font-family:'Cinzel Decorative',serif; text-align:center;
  font-size: clamp(1.5rem,3.5vw,2.5rem); color:${C.gold};
  margin-bottom:1.5rem; letter-spacing:0.05em;
  text-shadow: 0 0 20px ${C.gold}55;
}

/* ── mantra cards ── */
.vishnu-page .mantra-card {
  background: ${C.card};
  border: 1px solid ${C.cardBorder};
  border-radius: 1rem; padding: 2rem; text-align:center;
  animation: floatSlow 7s ease-in-out infinite;
  transition: transform 0.4s, box-shadow 0.4s;
  backdrop-filter: blur(6px);
  margin-bottom: 2rem;
}
.vishnu-page .mantra-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 0 40px ${C.gold}55, 0 0 80px ${C.violet}33;
}
.vishnu-page .mantra-card .sanskrit {
  font-size:1.8rem; color:${C.saffron}; margin-bottom:0.5rem; font-weight:700;
}
.vishnu-page .mantra-card .translit {
  font-style:italic; color:${C.gold}; margin-bottom:0.5rem; font-size:1.05rem;
}
.vishnu-page .mantra-card .meaning { opacity:0.8; line-height:1.6; }

/* ── gallery placeholder ── */
.vishnu-page .gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem; margin-top:2rem;
}
.vishnu-page .gallery-item {
  aspect-ratio: 1; border-radius:1rem; overflow:hidden;
  background: linear-gradient(135deg, ${C.indigo}55, ${C.violet}33);
  display:flex; align-items:center; justify-content:center; font-size:4rem;
  border: 1px solid ${C.cardBorder};
  animation: floatSlow 6s ease-in-out infinite;
  transition: transform 0.4s, box-shadow 0.4s;
}
.vishnu-page .gallery-item:nth-child(even) { animation-delay:-2.5s; }
.vishnu-page .gallery-item:hover {
  transform: translateY(-10px) scale(1.04);
  box-shadow: 0 0 40px ${C.gold}55;
}

/* ── footer ── */
.vishnu-page .footer {
  text-align:center; padding:3rem 2rem 2rem; opacity:0.6; font-size:0.85rem;
  border-top: 1px solid ${C.cardBorder}; position:relative; z-index:1;
}

/* ── float keyframe ── */
@keyframes floatSlow {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-12px); }
}

/* ── responsive ── */
@media (max-width:640px) {
  .vishnu-page .nav { gap:0.7rem; padding:0.75rem 1rem; flex-wrap:wrap; }
  .vishnu-page .nav a { font-size:0.7rem; }
  .vishnu-page section { padding: 4rem 1rem; }
  .vishnu-page .mandala-wrap { width:180px; height:180px; }
  .vishnu-page .chakra { font-size:3.5rem; }
}
`;

/* ═══════════════════════════════════════════════════════════
   Star-field canvas (200+ twinkling stars)
   ═══════════════════════════════════════════════════════════ */
function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const stars = [];
    const COUNT = 220;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      /* reposition stars to fit new viewport */
      for (const s of stars) {
        s.x = Math.random() * canvas.width;
        s.y = Math.random() * canvas.height;
      }
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.3,
        alpha: Math.random(),
        da: (Math.random() - 0.5) * 0.02,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.alpha += s.da;
        if (s.alpha <= 0.1 || s.alpha >= 1) s.da *= -1;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="star-canvas" />;
}

/* ═══════════════════════════════════════════════════════════
   Section wrapper with IntersectionObserver fade-in
   ═══════════════════════════════════════════════════════════ */
function FadeSection({ id, className = "", children }) {
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
      className={`fade-section ${visible ? "visible" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main page component
   ═══════════════════════════════════════════════════════════ */
export default function LordVishnu() {
  /* inject styles once */
  useEffect(() => {
    const STYLE_ID = "vishnu-page-styles";
    let tag = document.getElementById(STYLE_ID);
    if (!tag) {
      tag = document.createElement("style");
      tag.id = STYLE_ID;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }
    return () => {
      const el = document.getElementById(STYLE_ID);
      if (el) document.head.removeChild(el);
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="vishnu-page">
      {/* ── background layers ── */}
      <Starfield />
      <div className="nebula n1" />
      <div className="nebula n2" />
      <div className="nebula n3" />

      {/* ── navigation ── */}
      <nav className="nav">
        {NAV.map((n) => (
          <a
            key={n.to}
            href={`#${n.to}`}
            onClick={(e) => { e.preventDefault(); scrollTo(n.to); }}
          >
            {n.label}
          </a>
        ))}
      </nav>

      {/* ══════ HERO ══════ */}
      <section id="hero" className="hero">
        <div className="mandala-wrap">
          <div className="mandala-ring" />
          <span className="chakra" role="img" aria-label="Sudarshana Chakra">☀️</span>
        </div>

        <h1 className="shimmer">Lord Vishnu</h1>
        <p className="subtitle">
          The Preserver &amp; Saviour of the Universe — sustaining cosmic order
          across infinite cycles of creation, preservation and dissolution.
        </p>

        {/* emoji strip */}
        <div className="emoji-strip">
          {EMOJIS.map((e, i) => (
            <span key={i} role="img" aria-label="power emoji">{e}</span>
          ))}
        </div>
      </section>

      {/* ══════ ABOUT ══════ */}
      <FadeSection id="about">
        <h2 className="sec-title">About Lord Vishnu</h2>
        <div className="about-text">
          <p>
            Lord Vishnu is one of the principal deities of Hinduism, forming the divine
            trinity (Trimurti) alongside Brahma the Creator and Shiva the Destroyer.
            Vishnu&apos;s role is to preserve and protect the universe and its moral order
            (Dharma). Whenever the world is threatened by chaos, evil, or imbalance,
            Vishnu descends in one of His many avatars to restore righteousness.
          </p>
          <br />
          <p>
            Resting on the cosmic serpent Shesha in the Ocean of Milk (Kshira Sagara),
            He is depicted with four arms holding His divine attributes — the Shankha
            (conch), Sudarshana Chakra (discus), Kaumodaki (mace), and Padma (lotus).
            His consort is Goddess Lakshmi, the deity of wealth, fortune and prosperity.
          </p>
        </div>
      </FadeSection>

      {/* ══════ DASHAVATAR ══════ */}
      <FadeSection id="avatars">
        <h2 className="sec-title">The Dashavatara — 10 Divine Incarnations</h2>
        <div className="emoji-strip">
          {EMOJIS.map((e, i) => (
            <span key={i} role="img" aria-label="power emoji">{e}</span>
          ))}
        </div>
        <div className="card-grid">
          {AVATARS.map((a) => (
            <div className="lev-card" key={a.name}>
              <span className="card-icon" role="img" aria-label={a.name}>{a.icon}</span>
              <h3>{a.name}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </FadeSection>

      {/* ══════ POWERS ══════ */}
      <FadeSection id="powers">
        <h2 className="sec-title">Divine Powers &amp; Weapons</h2>
        <div className="card-grid">
          {POWERS.map((p) => (
            <div className="lev-card" key={p.title}>
              <span className="card-icon" role="img" aria-label={p.title}>{p.icon}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </FadeSection>

      {/* ══════ MANTRAS ══════ */}
      <FadeSection id="mantras">
        <h2 className="sec-title">Sacred Mantras</h2>
        {MANTRAS.map((m, i) => (
          <div className="mantra-card" key={i}>
            <div className="sanskrit">{m.sanskrit}</div>
            <div className="translit">{m.transliteration}</div>
            <p className="meaning">{m.meaning}</p>
          </div>
        ))}
      </FadeSection>

      {/* ══════ GALLERY ══════ */}
      <FadeSection id="gallery">
        <h2 className="sec-title">Divine Symbols</h2>
        <div className="gallery-grid">
          {["🔱", "🪷", "🐚", "☀️", "🦚", "🕉️"].map((icon, i) => (
            <div className="gallery-item" key={i}>
              <span role="img" aria-label="divine symbol">{icon}</span>
            </div>
          ))}
        </div>
      </FadeSection>

      {/* ══════ FOOTER ══════ */}
      <footer className="footer">
        <p>🙏 Jai Shri Vishnu — The Eternal Preserver of the Cosmos 🙏</p>
        <p style={{ marginTop: "0.5rem" }}>
          Built with devotion &amp; React · Om Namo Narayanaya
        </p>
      </footer>
    </div>
  );
}
