import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ArrowLeft, ArrowRight, ExternalLink, Github } from 'lucide-react';

const submissions = [
  { 
    id: 1, 
    type: "COVER", 
    title: "HACKATHON & BUILDATHON ARCHIVES", 
    subtitle: "RITHYA JAYARAM // DOSSIER" 
  },
  { 
    id: 2, 
    type: "DOSSIER", 
    title: "AI Settlement Auditor", 
    subtitle: "Razorpay Buildathon",
    date: "Aug 2026", 
    status: "FINALIST", 
    tech: "React, Python, FastAPI, OpenAI, Tailwind CSS", 
    desc: "An AI-powered auditing platform that parses complex settlement agreements, detects discrepancies using LLM logic, and flags compliance risks automatically.",
    github: "https://github.com/riti2043/AI_settlement_auditor",
    demo: "https://ai-settlement-auditor.vercel.app",
    image: "https://raw.githubusercontent.com/riti2043/AI_settlement_auditor/main/screenshot.png"
  },
  { 
    id: 3, 
    type: "DOSSIER", 
    title: "SIH 2026", 
    subtitle: "AI/NLP Pipeline for Oil Precursors",
    date: "Sep 2026", 
    status: "SUBMITTED", 
    tech: "Python, NLP, GenAI, React, FastAPI", 
    desc: "An automated web application designed to research and identify non-conventional, cost-effective bio-precursors for aviation lubricating oil using advanced NLP models and web scraping.",
    github: "https://github.com/riti2043/sih_2026",
    demo: null,
    image: null
  },
  { 
    id: 4, 
    type: "DOSSIER", 
    title: "Pursuit", 
    subtitle: "Hack2Sprnt Manipal Hackathon",
    date: "2026", 
    status: "COMPLETED", 
    tech: "React, Node.js, AI/ML", 
    desc: "An innovative application built during the Hack2Sprnt Manipal Hackathon, focusing on gamified productivity and task execution.",
    github: "https://github.com/riti2043/pursuit",
    demo: null,
    image: null
  },
  { 
    id: 5, 
    type: "END", 
    title: "END OF ARCHIVES" 
  }
];

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage bg-[var(--bg-secondary)] border-r-2 border-l-2 border-[var(--border-color)] overflow-hidden shadow-inner relative" ref={ref}>
      <div className="absolute top-0 bottom-0 left-0 w-4 bg-[var(--bg-primary)] border-r border-[var(--border-color)] opacity-50 z-10" />
      <div className="p-8 h-full flex flex-col justify-between ml-2">
        {props.children}
        <div className="flex justify-between items-end border-t border-[var(--border-color)] pt-4 mt-8 font-mono-custom text-sm">
          <span>PAGE // {props.number}</span>
          <span>{props.type === "COVER" ? "CLASSIFIED" : "ARCHIVE"}</span>
        </div>
      </div>
    </div>
  );
});

export const Submissions = () => {
  const book = useRef();

  return (
    <section className="py-24 px-6 relative z-10 w-full border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-mono-custom mb-4 uppercase border-b-2 border-[var(--border-color)] inline-block pb-2 w-full text-left">
          &gt; Submissions.log
        </h2>
        
        <div className="w-full flex justify-between items-center mb-12 font-mono-custom">
          <p className="opacity-70 max-w-md">
            Click corners or use arrows to navigate the dossier.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => book.current.pageFlip().flipPrev()}
              className="p-2 border border-[var(--border-color)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <button 
              onClick={() => book.current.pageFlip().flipNext()}
              className="p-2 border border-[var(--border-color)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] transition-colors"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center perspective-1000">
          <HTMLFlipBook 
            width={400} 
            height={550} 
            size="stretch"
            minWidth={300}
            maxWidth={500}
            minHeight={400}
            maxHeight={600}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            ref={book}
            className="border-4 border-[var(--accent)] bg-[var(--bg-primary)] shadow-[16px_16px_0px_var(--accent)]"
          >
            {submissions.map((sub, idx) => (
              <Page key={sub.id} number={idx + 1} type={sub.type}>
                {sub.type === "COVER" ? (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-8 border-4 border-[var(--accent)] p-8">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest">{sub.title}</h1>
                    <div className="w-full h-[2px] bg-[var(--accent)]" />
                    <p className="font-mono-custom text-xl">{sub.subtitle}</p>
                    <div className="w-24 h-24 border-4 border-[var(--accent)] rounded-full flex items-center justify-center mt-8">
                      <span className="font-mono-custom font-bold">TOP<br/>SECRET</span>
                    </div>
                  </div>
                ) : sub.type === "END" ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <h1 className="text-3xl font-bold uppercase tracking-widest">{sub.title}</h1>
                  </div>
                ) : (
                  <div className="flex flex-col h-full overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                      <span className="font-mono-custom bg-[var(--accent)] text-[var(--bg-primary)] px-2 py-1 text-xs font-bold">
                        {sub.status}
                      </span>
                      <span className="font-mono-custom text-xs opacity-70">{sub.date}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold uppercase mb-1 leading-tight">{sub.title}</h3>
                    <h4 className="text-sm font-mono-custom text-[var(--accent)] mb-4">{sub.subtitle}</h4>
                    
                    {sub.image && (
                        <div className="mb-4 border border-[var(--border-color)] p-1 bg-[#111]">
                            <div className="aspect-video w-full bg-[#222] flex items-center justify-center overflow-hidden">
                                <span className="text-xs opacity-50">UI_IMAGE_PLACEHOLDER</span>
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-4 mb-4">
                      <div>
                        <p className="font-mono-custom text-xs opacity-60 mb-1">TECH_STACK</p>
                        <p className="font-mono-custom text-sm border-l-2 border-[var(--accent)] pl-2">{sub.tech}</p>
                      </div>
                      
                      <div>
                        <p className="font-mono-custom text-xs opacity-60 mb-1">EXECUTION_SUMMARY</p>
                        <p className="text-sm leading-relaxed">{sub.desc}</p>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-[var(--border-color)]">
                        {sub.github && (
                            <a href={sub.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-mono-custom border border-[var(--border-color)] px-2 py-1 hover:bg-[var(--accent)] hover:text-[#000] transition-colors">
                                <Github size={12} /> REPOSITORY
                            </a>
                        )}
                        {sub.demo && (
                            <a href={sub.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-mono-custom border border-[var(--border-color)] px-2 py-1 hover:bg-[var(--accent)] hover:text-[#000] transition-colors">
                                <ExternalLink size={12} /> DEPLOYMENT
                            </a>
                        )}
                    </div>
                  </div>
                )}
              </Page>
            ))}
          </HTMLFlipBook>
        </div>
      </div>
    </section>
  );
};
