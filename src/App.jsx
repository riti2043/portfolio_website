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
      {/* Subtle Grain Texture Overlay */}
      <div className="grain-overlay" />

      {/* Top Scroll Progress Line */}
      <div 
        className="fixed top-0 left-0 h-[3px] border border-[var(--border-color)] text-[var(--accent)] bg-[var(--bg-secondary)] z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ==================== NAVBAR ==================== */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-[var(--border-color)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <a href="#hero" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full border border-[var(--border-color)] text-[var(--accent)] bg-[var(--bg-secondary)] flex items-center justify-center text-white dark:text-[var(--text-primary)] font-bold text-xs font-mono-custom group-hover:scale-105 transition-transform">
              RJ
            </div>
            <span className="font-bold tracking-tight text-lg group-hover:opacity-80 transition-opacity">
              Rithya Jayaram
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 font-mono-custom text-sm">
            <a href="#about" className="hover:text-[var(--text-muted)] dark:hover:text-[var(--text-muted)] transition-colors">/about</a>
            <a href="#skills" className="hover:text-[var(--text-muted)] dark:hover:text-[var(--text-muted)] transition-colors">/skills</a>
            <a href="#projects" className="hover:text-[var(--text-muted)] dark:hover:text-[var(--text-muted)] transition-colors">/projects</a>
            <a href="#contact" className="hover:text-[var(--text-muted)] dark:hover:text-[var(--text-muted)] transition-colors">/contact</a>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-[var(--border-color)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-zinc-700" />}
            </button>

            {/* Download CV CTA Button */}
            <a 
              href="#contact"
              className="btn-bitmap flex items-center gap-2 px-4 py-2 text-xs font-bold"
            >
              <span>Download CV</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-[var(--border-color)]"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-zinc-700" />}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-primary)]"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
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

      {/* Hero Scroll Section covers 0-60% */}
      <HeroScrollSequence />
      
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
