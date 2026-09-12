import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Sun, Moon, ArrowUpRight, Menu, X, Download, Mail, Code2, Sparkles, ExternalLink, ChevronDown, CheckCircle2 } from 'lucide-react';
import { GitHubCalendar } from 'react-github-calendar';
import { Certifications } from './components/Certifications';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { Submissions } from './components/Submissions';

// Custom SVG Icons for Github & Linkedin
const GithubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const AsciiHeroText = () => (
  <h1
    style={{
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: 'clamp(32px, 6.5vw, 110px)',
      fontWeight: 900,
      color: '#db5435',
      margin: 0,
      padding: '0 0 6px 0',
      lineHeight: 1.05,
      letterSpacing: '0.04em',
      userSelect: 'none',
      whiteSpace: 'nowrap',
    }}
  >
    Rithya Jayaram
  </h1>
);


// ── Bending Grid Background ─────────────────────────────────────────────────
const GridBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const SPACING = 40;   // px between grid nodes
    const RADIUS  = 180;  // mouse influence radius (px)
    const PUSH    = 44;   // max node displacement (px)
    const SPRING  = 0.07; // spring constant (return speed)
    const DAMP    = 0.80; // velocity damping

    let W, H, cols, rows, pts;
    const mouse = { x: -9999, y: -9999 };

    const init = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      cols = Math.ceil(W / SPACING) + 2;
      rows = Math.ceil(H / SPACING) + 2;
      pts  = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const hx = c * SPACING, hy = r * SPACING;
          pts.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 });
        }
    };

    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of pts) {
        // Spring back to home
        p.vx += (p.hx - p.x) * SPRING;
        p.vy += (p.hy - p.y) * SPRING;
        // Mouse repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d  = Math.hypot(dx, dy);
        if (d < RADIUS && d > 0) {
          const f = (1 - d / RADIUS) * PUSH;
          p.vx += (dx / d) * f * 0.14;
          p.vy += (dy / d) * f * 0.14;
        }
        p.vx *= DAMP; p.vy *= DAMP;
        p.x  += p.vx; p.y  += p.vy;
      }

      ctx.lineWidth = 0.7;

      // Horizontal lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const p = pts[r * cols + c];
          c === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = 'rgba(219,84,53,0.20)';
        ctx.stroke();
      }

      // Vertical lines
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const p = pts[r * cols + c];
          r === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = 'rgba(219,84,53,0.20)';
        ctx.stroke();
      }

      // Glowing dot at each node near cursor
      for (const p of pts) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < RADIUS) {
          const a = (1 - d / RADIUS) * 0.75;
          ctx.fillStyle = `rgba(219,84,53,${a.toFixed(2)})`;
          ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    const onMove   = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave  = () =>  { mouse.x = -9999; mouse.y = -9999; };
    const onResize = () =>  { init(); };

    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize',     onResize);
    init();
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize',     onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
    />
  );
};
// ────────────────────────────────────────────────────────────────────────────

// ─── Scramble hook ───────────────────────────────────────────────────────────
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*[]<>';
function useScramble(finalText, trigger, delay = 0) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const FRAMES = 26;
    let tid, iid;
    tid = setTimeout(() => {
      iid = setInterval(() => {
        frame++;
        if (frame >= FRAMES) { setDisplay(finalText); clearInterval(iid); }
        else {
          const p = frame / FRAMES;
          setDisplay(finalText.split('').map((ch, i) =>
            ch === ' ' ? ' ' : i / finalText.length < p
              ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          ).join(''));
        }
      }, 38);
    }, delay);
    return () => { clearTimeout(tid); clearInterval(iid); };
  }, [trigger, finalText, delay]);
  return display || (trigger ? finalText : '');
}

// ─── InfoSlide ───────────────────────────────────────────────────────────────
const InfoSlide = ({ id, tabTitle, heading, bodyLines, skills, extra, onView }) => {
  const ref       = useRef(null);
  const [seen, setSeen]     = useState(false);
  const [textIn, setTextIn] = useState(false);
  const [barsGo, setBarsGo] = useState(false);
  const barsFired           = useRef(false);
  const [bWidths, setBWidths] = useState((skills || []).map(() => 0));
  const scrambled = useScramble(heading, seen, 560);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        onView?.(true);
        setTimeout(() => setTextIn(true), 660);
        if (!barsFired.current && skills?.length) {
          barsFired.current = true;
          setTimeout(() => {
            setBarsGo(true);
            skills.forEach((s, i) => {
              const start = Date.now() + i * 750;
              const tick = () => {
                const now   = Date.now();
                const delay = start - now;
                if (delay > 0) { setTimeout(tick, delay); return; }
                const elapsed = now - start;
                const pct     = Math.min(1, elapsed / 620);
                setBWidths(prev => { const n=[...prev]; n[i]=Math.round(s.pct*pct); return n; });
                if (pct < 1) requestAnimationFrame(tick);
              };
              setTimeout(tick, i * 750);
            });
          }, 1150);
        }
      } else { onView?.(false); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id={id} ref={ref}
      className="w-full h-full relative p-2 md:p-6 lg:p-10 flex items-center justify-center pointer-events-none"
    >
      <motion.div
        initial={{ clipPath: 'inset(0 100% 100% 0)' }}
        animate={seen ? { clipPath: 'inset(0 0% 0% 0)' } : {}}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full h-full bg-[#050505] border border-[var(--accent)] pointer-events-auto flex flex-col shadow-[0_0_40px_rgba(219,84,53,0.18),4px_4px_0_rgba(219,84,53,0.25)] relative overflow-hidden"
      >
        {/* Subtle background grid matching the main theme */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
             style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)', backgroundSize: '8px 8px' }} />

        {/* ── Tab title bar ── */}
        <div className="border-b border-[var(--accent)] px-4 py-3 flex justify-between items-center bg-[rgba(219,84,53,0.08)] relative z-10 font-orbitron">
          <span className="text-[var(--accent)] text-xs md:text-sm tracking-widest uppercase">
            ◆ {tabTitle}
          </span>
          <span className="text-[var(--accent)] text-xl opacity-60 cursor-default select-none">×</span>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 w-full h-full p-8 md:p-12 xl:p-16 relative z-10 flex flex-col items-start overflow-hidden">
          
          {/* Top Row: Heading (Spans full width so it doesn't overlap) */}
          <h2 className="text-4xl md:text-5xl lg:text-[64px] xl:text-[76px] text-[var(--accent)] tracking-widest font-orbitron mb-10 xl:mb-16 uppercase text-shadow-glow font-bold text-left whitespace-nowrap w-full">
            {scrambled}
          </h2>

          {/* Bottom Row: 2 Columns */}
          <div className="w-full flex-1 flex flex-row items-start justify-between gap-12 h-full">
            
            {/* LEFT COLUMN: Text Content */}
            <div className={`flex flex-col justify-start h-full ${skills ? 'w-[55%] pr-4' : 'w-full'}`}>
              <div className="mb-6 border-l-[6px] border-[rgba(219,84,53,0.4)] pl-8">
                {bodyLines.map((line, i) => (
                  <motion.p key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={textIn ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                    className="text-2xl md:text-3xl lg:text-[32px] xl:text-[40px] text-[var(--text-primary)] leading-[1.6] mb-12 font-mono-custom opacity-95 text-left"
                  >{line}</motion.p>
                ))}
              </div>

              {/* Extra slot (e.g. button) */}
              {extra && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={textIn ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.0 }} className="mt-4">
                  {extra}
                </motion.div>
              )}
            </div>

            {/* RIGHT COLUMN: Skill bars */}
            {skills && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={textIn ? { opacity: 1 } : {}} 
                transition={{ delay: 0.5 }}
                className="w-[45%] max-w-[500px] flex flex-col justify-start gap-y-12 border-l-2 border-[rgba(219,84,53,0.15)] pl-10 xl:pl-16 h-full"
              >
                {skills.map((s, i) => (
                  <div key={i} className="flex flex-col w-full">
                    <div className="flex justify-between items-center mb-5 font-orbitron">
                      <span className="text-[var(--accent)] text-xl md:text-2xl tracking-widest uppercase text-glow">{s.label}</span>
                      <span className="text-white text-lg opacity-90">{bWidths[i]}%</span>
                    </div>
                    {/* Progress Bar (Styled like .progress-segmented) */}
                    <div className="h-6 w-full border-2 border-[var(--accent)] p-[3px] shadow-[0_0_15px_rgba(219,84,53,0.25)]">
                      <div 
                        className="h-full progress-segmented shadow-[0_0_12px_var(--accent)]"
                        style={{ width: `${bWidths[i]}%`, transition: 'none' }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
// ────────────────────────────────────────────────────────────────────────────

// ─── StickySlides Container ──────────────────────────────────────────────────
const StickySlides = ({ onActive }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange(v => {
      // Show navbar or not
      if (v > 0.02 && v < 0.95) {
        onActive(true);
      } else {
        onActive(false);
      }

      // Determine which slide to show based on scroll progress
      if (v > 0.02 && v < 0.48) {
        setActiveSlide(1);
      } else if (v >= 0.48 && v < 0.95) {
        setActiveSlide(2);
      } else {
        setActiveSlide(0);
      }
    });
  }, [scrollYProgress, onActive]);

  return (
    <div ref={containerRef} style={{ height: '300vh', position: 'relative', marginTop: '-15vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ pointerEvents: activeSlide === 0 ? 'none' : 'auto', zIndex: 30 }}>
        <AnimatePresence mode="wait">
          {activeSlide === 1 && (
            <motion.div
              key="slide1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="absolute inset-0 w-full h-full pointer-events-auto bg-[rgba(9,9,11,0.6)] backdrop-blur-sm"
            >
              <InfoSlide
                id="fullstack"
                tabTitle="slide_01.exe"
                heading="Full Stack in Progress"
                bodyLines={[
                  'An engineer uses math, science, and logic to design and build systems that solve real problems.',
                  'I love turning ideas into practical solutions, and I\'m constantly equipping myself with full stack knowledge to do that better.',
                  'From backends and databases to interfaces people actually interact with, I like understanding and owning every layer of what I build.',
                ]}
                skills={[
                  { label: 'FastAPI',     pct: 72 },
                  { label: 'React JS',    pct: 75 },
                  { label: 'MySQL',       pct: 65 },
                  { label: 'PostgreSQL',  pct: 60 },
                ]}
              />
            </motion.div>
          )}

          {activeSlide === 2 && (
            <motion.div
              key="slide2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="absolute inset-0 w-full h-full pointer-events-auto bg-[rgba(9,9,11,0.6)] backdrop-blur-sm"
            >
              <InfoSlide
                id="ai"
                tabTitle="slide_02.exe"
                heading="Building with AI"
                bodyLines={[
                  'I\'m a curiosity-driven individual who loves learning new things, and that\'s exactly why I find AI to be the perfect field.',
                  'The technology is constantly evolving, with huge potential to change lives through real-world applications.',
                  'I love applying what I learn in AI, ML, DL, and Computer Vision by building small but impactful projects.',
                ]}
                extra={
                  <a href="#skills" className="btn-pixel px-6 py-3 text-sm inline-block mt-6 font-orbitron font-bold">
                    EXPLORE KNOWLEDGE GRAPH →
                  </a>
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
// ────────────────────────────────────────────────────────────────────────────

const NetworkStatus = () => {
  const [totalVisits, setTotalVisits] = useState('...');
  const [liveCount, setLiveCount] = useState(1);

  useEffect(() => {
    // Use our own Vercel serverless function as a backend proxy.
    // It fetches the real count server-side (no CORS issues).
    const fetchVisitors = async () => {
      try {
        const res = await fetch('/api/visitors');
        const data = await res.json();
        if (data.count !== undefined) {
          setTotalVisits(String(data.count).padStart(5, '0'));
        } else {
          setTotalVisits('00001');
        }
      } catch (err) {
        setTotalVisits('00001');
      }
    };

    fetchVisitors();
  }, []);

  useEffect(() => {
    setLiveCount(Math.floor(Math.random() * 3) + 1);
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        let next = prev + change;
        if (next < 1) next = 1;
        if (next > 5) next = 4;
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 pt-6 border-t border-[rgba(219,84,53,0.3)] flex flex-row gap-6">
       <div className="flex-1 flex justify-between items-center bg-[#0f0f0f] hud-box p-3 font-orbitron text-xs">
          <span className="text-[var(--text-muted)] uppercase tracking-widest text-[10px]">Total Visitors</span>
          <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] font-bold tracking-widest text-lg">{totalVisits}</span>
       </div>
       <div className="flex-1 flex justify-between items-center bg-[#0f0f0f] hud-box p-3 font-orbitron text-xs">
          <span className="text-[var(--text-muted)] uppercase tracking-widest text-[10px] flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
             Live Now
          </span>
          <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] font-bold tracking-widest text-lg">{String(liveCount).padStart(2, '0')}</span>
       </div>
    </div>
  );
}

const ProfileDashboard = () => {
  return (
    <section id="hero" className="min-h-screen pt-2 pb-6 px-6 lg:px-12 flex flex-col items-center justify-start relative">
      <div className="max-w-[1400px] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start mt-0">
        
        {/* HEADER — flush under navbar */}
        <div className="lg:col-span-12 pb-2">
          <AsciiHeroText />
        </div>

        {/* LEFT BOX (Now Main Profile): PHOTO + STATS (Spans 9 cols) */}
        <div className="lg:col-span-9 flex flex-col h-full">
          
          {/* UNIFIED CONTAINER (PHOTO + STATS) */}
          <div className="hud-box flex flex-col md:flex-row flex-1">
            
            {/* PHOTO SECTION */}
            <div className="md:w-5/12 border-b md:border-b-0 md:border-r hud-divider p-2">
              <div className="w-full h-full min-h-[400px] hud-glow overflow-hidden bg-black flex items-center justify-center">
                 <img src="/profile.jpg" alt="Profile" className="w-full h-full object-cover filter contrast-125" />
              </div>
            </div>

            {/* STATS & CHARTS SECTION */}
            <div className="md:w-7/12 flex flex-col">
              
              {/* INNER BOX FOR EVERYTHING */}
              <div className="flex-1 flex flex-col p-4">

                {/* STATS TABLE */}
                <div className="flex flex-col font-orbitron text-xs sm:text-[13px] hud-box mb-6 p-4">
                  <div className="flex justify-between items-center border-b hud-divider py-3 px-2">
                    <span className="text-glow tracking-widest uppercase">AGE</span>
                    <span className="text-white font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]">20</span>
                  </div>
                  <div className="flex justify-between items-center border-b hud-divider py-3 px-2">
                    <span className="text-glow tracking-widest uppercase">ROLE</span>
                    <span className="text-white font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]">AI Enthusiast</span>
                  </div>
                  <div className="flex justify-between items-center border-b hud-divider py-3 px-2">
                    <span className="text-glow tracking-widest uppercase">BASE</span>
                    <span className="text-white font-bold text-right drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]">University Visveshwaraiya<br/>College of Engineering</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-2">
                    <span className="text-glow tracking-widest uppercase">LOCATION</span>
                    <span className="text-white font-bold text-right drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]">Bangalore, Karnataka</span>
                  </div>
                </div>
                
                {/* CHARTS (Radar + Progress) */}
                <div className="flex flex-row items-stretch justify-between gap-6 h-48">
                   {/* Radar Box */}
                   <div className="relative flex items-center justify-center w-1/2 hud-box p-2">
                      <div className="absolute inset-0 flex items-center justify-center p-3">
                         <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-100 drop-shadow-[0_0_6px_var(--accent)]">
                            {/* Inner rings */}
                            <polygon points="50,15 80.3,32.5 80.3,67.5 50,85 19.7,67.5 19.7,32.5" fill="none" stroke="var(--accent)" strokeWidth="0.5" opacity="0.4" />
                            <polygon points="50,25 71.6,37.5 71.6,62.5 50,75 28.4,62.5 28.4,37.5" fill="none" stroke="var(--accent)" strokeWidth="0.5" opacity="0.4" />
                            <polygon points="50,35 63,42.5 63,57.5 50,65 37,57.5 37,42.5" fill="none" stroke="var(--accent)" strokeWidth="0.5" opacity="0.4" />
                            {/* Outer Hexagon Grid */}
                            <polygon points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.8" />
                            {/* Spokes */}
                            <line x1="50" y1="50" x2="50" y2="5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" />
                            <line x1="50" y1="50" x2="89" y2="27.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" />
                            <line x1="50" y1="50" x2="89" y2="72.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" />
                            <line x1="50" y1="50" x2="50" y2="95" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" />
                            <line x1="50" y1="50" x2="11" y2="72.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" />
                            <line x1="50" y1="50" x2="11" y2="27.5" stroke="var(--accent)" strokeWidth="0.5" opacity="0.5" />
                            {/* Data Polygon */}
                            <polygon points="50,15 71.6,37.5 63,57.5 50,75 28.4,62.5 19.7,32.5" fill="rgba(219,84,53,0.5)" stroke="var(--accent)" strokeWidth="2" />
                         </svg>
                      </div>
                      {/* Labels */}
                      <span className="absolute top-1 text-[8px] text-glow font-orbitron uppercase">problem-solving</span>
                      <span className="absolute left-1 text-[8px] text-glow font-orbitron uppercase">comms</span>
                      <span className="absolute right-1 text-[8px] text-glow font-orbitron uppercase">speed</span>
                      <span className="absolute bottom-1 text-[8px] text-glow font-orbitron uppercase">creativity</span>
                   </div>
                   
                   {/* Progress Bars Box */}
                   <div className="flex flex-col justify-center gap-6 font-orbitron text-xs w-1/2 hud-box p-5">
                      <div>
                         <div className="mb-2 text-glow uppercase tracking-widest text-[10px]">AI / ML</div>
                         <div className="h-4 w-full border-2 border-[var(--accent)] p-[2px] shadow-[0_0_10px_rgba(219,84,53,0.3)]">
                            <div className="h-full w-[85%] progress-segmented shadow-[0_0_10px_var(--accent)]"></div>
                         </div>
                      </div>
                      <div>
                         <div className="mb-2 text-glow uppercase tracking-widest text-[10px]">Development</div>
                         <div className="h-4 w-full border-2 border-[var(--accent)] p-[2px] shadow-[0_0_10px_rgba(219,84,53,0.3)]">
                            <div className="h-full w-[75%] progress-segmented shadow-[0_0_10px_var(--accent)]"></div>
                         </div>
                      </div>
                   </div>
                </div>
                
                {/* NETWORK STATUS */}
                <NetworkStatus />
                
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT BOX (Now About Me) (Spans 3 cols) */}
        <div className="lg:col-span-3 flex flex-col hud-box p-0 h-full">
          <div className="p-6 flex-1 border-b hud-divider">
             <h2 className="text-sm font-mono-custom text-glow mb-4 uppercase">About</h2>
             <div className="relative font-mono-custom text-xs leading-[30px] text-[var(--text-primary)]" 
                  style={{ 
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, rgba(219,84,53,0.3) 30px)',
                    backgroundSize: '100% 30px'
                  }}>
               <p className="pt-1">
                 A 3rd year Information Science Engineering student who loves to untangle problems and build solutions. Striving to get better each day through constant learning and keeping up with evolving tech.
               </p>
               <p className="pt-4 text-[var(--accent)] animate-pulse">
                 Scroll to know more.
               </p>
             </div>
          </div>
          
          <div className="p-6 flex flex-col gap-4">
             <a href="#projects" className="btn-pixel w-full text-center py-3 text-sm">VIEW PROJECTS</a>
             <a href="#contact" className="btn-pixel w-full text-center py-3 text-sm">LET'S TALK</a>
          </div>
        </div>

      </div>
    </section>
  );
};

// ==================== SCROLLYTELLING COMPONENT ====================
const HeroScrollSequence = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [titleIndex, setTitleIndex] = useState(0);
  const titles = ["Rithya Jayaram", "an AI Enthusiast", "a Full Stack Engineer"];

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Slide 1 (Intro): Visible 0-10%, Fades out 10-15%. Stays hidden. Fades back in 70-75% and stays.
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.15, 0.7, 0.75, 1], [1, 1, 0, 0, 1, 1]);
  const y1 = useTransform(scrollYProgress, [0, 0.1, 0.15, 0.7, 0.75, 1], [0, 0, -50, 50, 0, 0]);

  // Slide 2 (AI): Fades in 15-20%, stays till 35%, fades out 35-40%
  const opacity2 = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [50, 0, 0, -50]);

  // Slide 3 (Full Stack): Fades in 40-45%, stays till 60%, fades out 60-65%
  const opacity3 = useTransform(scrollYProgress, [0.4, 0.45, 0.6, 0.65], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.4, 0.45, 0.6, 0.65], [50, 0, 0, -50]);

  return (
    <div ref={containerRef} className="h-[300vh] relative w-full ">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Grids (Kept static across slides) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="topo-bg opacity-[0.03] dark:opacity-[0.07] absolute inset-0 mix-blend-overlay" />
          <div className="grain-overlay opacity-[0.25] dark:opacity-[0.15]" />
        </div>

        {/* SLIDE 1: INTRO */}
        <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute inset-0 flex items-center justify-center px-6 z-10">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
                Hello There!
              </h1>
              <div className="h-[60px] sm:h-[80px] text-[var(--text-muted)] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight flex items-center overflow-hidden">
                I'm&nbsp;
                <AnimatePresence mode="wait">
                  <motion.div
                    key={titleIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-[var(--text-primary)] relative font-cursive"
                  >
                    {titles[titleIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-4 text-sm pointer-events-auto">
                <a href="#projects" className="btn-bitmap flex items-center gap-2 px-6 py-3 text-xl">
                  /view projects <ChevronDown size={16} />
                </a>
                <a href="#contact" className="btn-bitmap flex items-center gap-2 px-6 py-3 text-xl">
                  Let's talk <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
            
            <div className="relative hidden lg:block h-[450px]">
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-90 mix-blend-screen">
                <img src="/profile.jpg" alt="Profile Pixel Art" className="max-w-full max-h-full object-contain opacity-90" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* SLIDE 2: AI ENTHUSIAST */}
        <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute inset-0 flex items-center justify-center px-6 z-20 pointer-events-none">
          <div className="max-w-5xl mx-auto w-full text-center space-y-8">
            <h2 className="font-mono-custom text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter">
              &gt; [ <span className="text-[var(--accent)]">AI Enthusiast</span> ]_
            </h2>
            <p className="text-xl sm:text-2xl text-[var(--text-muted)] leading-relaxed max-w-3xl mx-auto font-sans-custom">
              Experimenting with <span className="text-[var(--text-primary)] font-bold">autonomous agents</span>, LLM integrations, and modern intelligent workflows to create next-generation digital experiences.
            </p>
          </div>
        </motion.div>

        {/* SLIDE 3: FULL STACK */}
        <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute inset-0 flex items-center justify-center px-6 z-30 pointer-events-none">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 text-left">
              <h2 className="font-mono-custom text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter">
                &gt; [ <span className="text-[var(--accent)]">Full Stack</span> ]_
              </h2>
              <p className="text-lg sm:text-xl text-[var(--text-muted)] leading-relaxed font-sans-custom">
                Building scalable backend architectures and fluid, responsive user interfaces. I turn complex logic problems into clean, high-performance software.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-custom pointer-events-auto">
              <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] border border-[var(--border-color)] hover:-translate-y-1 hover:shadow-lg transition-transform duration-300">
                <div className="text-4xl font-bold text-[var(--text-primary)] mb-2">100%</div>
                <div className="text-sm text-[var(--text-muted)]">Clean Architecture</div>
              </div>
              <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] border border-[var(--border-color)] hover:-translate-y-1 hover:shadow-lg transition-transform duration-300">
                <div className="text-4xl font-bold text-[var(--text-primary)] mb-2">Full</div>
                <div className="text-sm text-[var(--text-muted)]">End-to-End Dev</div>
              </div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [slidesInView, setSlidesInView] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Cycling titles for Hero section
  const heroTitles = [
    "Rithya Jayaram",
    "Aspiring Full Stack Engineer",
    "AI Enthusiast"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroTitles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [heroTitles.length]);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 4 Featured Projects
  const projects = [
    {
      id: "01",
      title: "AI Settlement Auditor",
      subtitle: "Automated Financial & Document Intelligence Platform",
      description: "An AI-powered auditing platform that parses complex settlement agreements, detects discrepancies using LLM logic, and flags compliance risks automatically.",
      tags: ["React", "Python", "FastAPI", "OpenAI", "Tailwind CSS"],
      github: "https://github.com/riti2043",
      demo: "https://github.com/riti2043",
      imageBg: "from-zinc-900 to-zinc-800",
      accentColor: "border-emerald-500/50"
    },
    {
      id: "02",
      title: "Neural Vision Assistant",
      subtitle: "Multimodal AI Agent for Code & UI Generation",
      description: "An agentic system capable of taking rough wireframe sketches and transforming them into accessible, production-ready React components with animated previews.",
      tags: ["TypeScript", "Next.js", "LangChain", "Claude API", "Framer Motion"],
      github: "https://github.com/riti2043",
      demo: "https://github.com/riti2043",
      imageBg: "from-zinc-800 to-zinc-900",
      accentColor: "border-blue-500/50"
    },
    {
      id: "03",
      title: "Sublime Cloud Architecture",
      subtitle: "Distributed Microservices & Analytics Engine",
      description: "High-throughput real-time web telemetry and analytics pipeline designed with containerized Go services, Redis caching, and interactive WebGL dashboarding.",
      tags: ["Go", "Docker", "Redis", "PostgreSQL", "React"],
      github: "https://github.com/riti2043",
      demo: "https://github.com/riti2043",
      imageBg: "from-zinc-900 to-zinc-950",
      accentColor: "border-purple-500/50"
    },
    {
      id: "04",
      title: "Algorithmic Visualizer",
      subtitle: "Interactive Graph & ML Model Explorer",
      description: "An educational visual engine enabling developers to see deep neural network layer activations and pathfinding algorithms in motion.",
      tags: ["React", "Three.js", "Python", "Web Audio API"],
      github: "https://github.com/riti2043",
      demo: "https://github.com/riti2043",
      imageBg: "from-zinc-950 to-zinc-900",
      accentColor: "border-amber-500/50"
    }
  ];

  // Skills
  const skillsCategories = [
    {
      title: "Full Stack Engineering",
      skills: ["React / Next.js", "TypeScript", "JavaScript (ES6+)", "Python", "Node.js / Express", "FastAPI", "REST & GraphQL APIs", "HTML5 & Tailwind CSS"]
    },
    {
      title: "Artificial Intelligence & Data",
      skills: ["LLM Integration", "Prompt Engineering", "OpenAI / Claude APIs", "LangChain / AI Agents", "Vector Databases", "Python Data Stack"]
    },
    {
      title: "Tools & Workflow",
      skills: ["Git & GitHub", "Vite", "Docker", "VS Code", "Vercel / Netlify", "Figma to Code"]
    }
  ];

  return (
    <div className={`min-h-screen relative topo-bg ${darkMode ? 'dark' : ''}`}>
      {/* Bending grid canvas — sits over static CSS grid, behind all content */}
      <GridBackground />

      {/* Subtle Grain Texture Overlay */}
      <div className="grain-overlay" />

      {/* Top Scroll Progress Line */}
      <div 
        className="fixed top-0 left-0 h-[3px] border border-[var(--border-color)] text-[var(--accent)] bg-[var(--bg-secondary)] z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ==================== NAVBAR ==================== */}
      <nav className={`sticky top-0 z-40 bg-transparent transition-all duration-500 pointer-events-none ${slidesInView ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-end">
          
          <div className="flex items-center gap-5">
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-4">
              <a href="#about" className="btn-pixel px-5 py-2.5 text-sm pointer-events-auto">ABOUT</a>
              <a href="#skills" className="btn-pixel px-5 py-2.5 text-sm pointer-events-auto">SKILLS</a>
              <a href="#projects" className="btn-pixel px-5 py-2.5 text-sm pointer-events-auto">PROJECTS</a>
              <a href="#contact" className="btn-pixel px-5 py-2.5 text-sm pointer-events-auto">CONTACT</a>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn-pixel p-2.5 px-4 pointer-events-auto"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Download CV CTA Button */}
            <a 
              href="#contact"
              className="btn-pixel flex items-center gap-2 px-6 py-2.5 text-sm pointer-events-auto"
            >
              <span>DOWNLOAD CV</span>
              <ArrowUpRight size={14} />
            </a>

            {/* Mobile Toggle Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn-pixel p-2 pointer-events-auto"
              >
                {mobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-[var(--border-color)] bg-white dark:bg-zinc-950 px-6 py-6 font-mono-custom flex flex-col gap-4 text-base"
            >
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>/about</a>
              <a href="#skills" onClick={() => setMobileMenuOpen(false)}>/skills</a>
              <a href="#projects" onClick={() => setMobileMenuOpen(false)}>/projects</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>/contact</a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="btn-bitmap mt-2 flex items-center justify-center gap-2 py-3 font-bold"
              >
                <span>Download CV</span>
                <Download size={16} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Profile Dashboard covers the intro now */}
      <ProfileDashboard />

      {/* ── Scroll Info Slides (Sticky Overlay Sequence) ── */}
      <StickySlides onActive={setSlidesInView} />

      <Certifications />

      {/* ==================== SKILLS & GITHUB ACTIVITY SECTION (UNIFIED) ==================== */}
      <section id="skills" className="py-24 border-t border-[var(--border-color)] px-6 max-w-7xl mx-auto">
        <div className="space-y-12">
          
          <div>
            <span className="font-mono-custom text-xs uppercase tracking-widest text-[var(--text-muted)]">02 // SKILLS & ACTIVITY</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 tracking-tight">Technical Stack & Contribution Log</h2>
          </div>

          {/* Categorized Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skillsCategories.map((category, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
                  <Code2 className="text-zinc-700 dark:text-zinc-300" size={20} />
                  <h3 className="font-bold text-lg">{category.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-3 py-1.5 rounded-full text-xs font-mono-custom border border-[var(--border-color)] bg-zinc-100/70 dark:bg-zinc-800/70 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={12} className="text-[var(--accent)]" />
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* GitHub Live Contribution Heatmap Widget (riti2043) */}
          <div className="mt-12 p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <GithubIcon size={24} />
                <div>
                  <h4 className="font-bold font-mono-custom text-base">GitHub Activity Log (@riti2043)</h4>
                  <p className="text-xs text-[var(--text-muted)]">Live contribution commits grid & public repository activity</p>
                </div>
              </div>
              <a 
                href="https://github.com/riti2043" 
                target="_blank" 
                rel="noreferrer"
                className="font-mono-custom text-xs px-4 py-2 rounded-full border border-[var(--border-color)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
              >
                <span>View Profile</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <div className="min-w-fit">
                <GitHubCalendar 
                  username="riti2043" 
                  colorScheme={darkMode ? 'dark' : 'light'}
                  blockSize={14}
                  blockMargin={4}
                  fontSize={12}
                  showWeekdayLabels={true}
                  theme={{
                    light: ['#e8e4db', '#f0a897', '#e87e64', '#e05b38', '#db5435'],
                    dark: ['#1a1210', '#5e2417', '#8f3723', '#c24a2f', '#db5435']
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== PROJECTS SECTION ("SCROLL-TO-SEE" PINNED CARDS) ==================== */}
      <section id="projects" className="py-24 border-t border-[var(--border-color)] px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="font-mono-custom text-xs uppercase tracking-widest text-[var(--text-muted)]">03 // SELECTED WORK</span>
          <h2 className="text-3xl sm:text-5xl font-bold mt-2 tracking-tight">Scroll to Explore Projects</h2>
          <p className="text-[var(--text-muted)] font-mono-custom text-xs mt-2">Sticky scroll card stacking experience ↓</p>
        </div>

        {/* Stacked Sticky Project Showcase Cards */}
        <div className="space-y-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className={`sticky top-28 rounded-3xl border ${project.accentColor} bg-[var(--bg-primary)] shadow-xl overflow-hidden p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-[var(--border-color)]`}
            >
              {/* Project Details Left */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center justify-between font-mono-custom text-xs text-[var(--text-muted)] border-b border-[var(--border-color)] pb-3">
                  <span>PROJECT // {project.id}</span>
                  <span>04 TOTAL</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-4xl font-bold tracking-tight">{project.title}</h3>
                  <p className="font-mono-custom text-sm text-[var(--text-muted)] mt-1">{project.subtitle}</p>
                </div>

                <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      className="px-3 py-1 rounded-full text-xs font-mono-custom border border-[var(--border-color)] bg-zinc-100 dark:bg-zinc-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-4 font-mono-custom text-xs">
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-bitmap px-5 py-2.5 flex items-center gap-1.5 transition-colors font-mono-custom text-sm"
                  >
                    <span>Live Demo</span>
                    <ExternalLink size={14} />
                  </a>
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-bitmap px-5 py-2.5 flex items-center gap-1.5 transition-colors font-mono-custom text-sm"
                  >
                    <span>Source Code</span>
                    <GithubIcon size={14} />
                  </a>
                </div>
              </div>

              {/* Project Card Right Preview Mockup */}
              <div className="lg:col-span-6">
                <div className={`w-full aspect-video rounded-2xl bg-gradient-to-br ${project.imageBg} border border-zinc-700/50 p-6 flex flex-col justify-between relative shadow-inner text-white overflow-hidden group`}>
                  
                  {/* Wireframe Mockup Top Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="font-mono-custom text-[10px] text-white/50">{project.title.toLowerCase().replace(/\s+/g, '-')}.app</span>
                  </div>

                  {/* Wireframe Graphics */}
                  <div className="my-auto space-y-3 font-mono-custom">
                    <div className="h-4 w-3/4 bg-white/20 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-white/10 rounded" />
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="h-12 rounded bg-white/10 border border-white/5" />
                      <div className="h-12 rounded bg-white/10 border border-white/5" />
                      <div className="h-12 rounded bg-white/10 border border-white/5" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono-custom text-white/40">
                    <span>BUILD // OK</span>
                    <span>v1.0.4</span>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </section>

      <KnowledgeGraph />
      <Submissions />

      {/* ==================== CONTACT & FOOTER SECTION ==================== */}
      <section id="contact" className="py-24 border-t border-[var(--border-color)] px-6 max-w-7xl mx-auto">
        <div className="space-y-12 text-center max-w-3xl mx-auto">
          
          <span className="font-mono-custom text-xs uppercase tracking-widest text-[var(--text-muted)]">04 // GET IN TOUCH</span>
          
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Let's build something remarkable.
          </h2>

          <p className="text-[var(--text-muted)] text-lg leading-relaxed">
            Whether you have an upcoming project, engineering opportunity, or just want to discuss full-stack & AI architecture, feel free to reach out!
          </p>

          {/* Big Email CTA Button */}
          <div className="pt-4">
            <a 
              href="mailto:rithyajayaram@gmail.com"
              className="btn-bitmap inline-flex items-center gap-3 px-8 py-4 text-base sm:text-xl font-bold font-mono-custom"
            >
              <Mail size={20} />
              <span>rithyajayaram@gmail.com</span>
              <ArrowUpRight size={18} />
            </a>
          </div>

          {/* Social Links Bar */}
          <div className="flex items-center justify-center gap-6 pt-8 font-mono-custom text-sm">
            <a 
              href="https://github.com/riti2043" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-[var(--text-muted)] transition-colors"
            >
              <GithubIcon size={16} />
              <span>GitHub</span>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-[var(--text-muted)] transition-colors"
            >
              <LinkedinIcon size={16} />
              <span>LinkedIn</span>
            </a>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-custom text-xs text-[var(--text-muted)]">
          <span>© 2026 Rithya Jayaram. All rights reserved.</span>
          <span>Designed with Architectural Monochrome Aesthetics</span>
        </div>
      </section>

    </div>
  );
}
