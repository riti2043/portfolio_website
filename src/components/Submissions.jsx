import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const submissions = [
  { 
    id: 1, 
    type: "COVER", 
    title: "MISSION DOSSIER", 
    subtitle: "RITHYA JAYARAM // HACKATHON ARCHIVES" 
  },
  { 
    id: 2, 
    type: "DOSSIER", 
    title: "Razorpay Buildathon", 
    date: "Aug 2026", 
    status: "FINALIST", 
    tech: "React, Node, AI", 
    desc: "Built an AI-powered payment settlement auditor." 
  },
  { 
    id: 3, 
    type: "DOSSIER", 
    title: "Global Hack Week", 
    date: "May 2026", 
    status: "WINNER", 
    tech: "Docker, Go, Redis", 
    desc: "Developed a distributed containerized microservice." 
  },
  { 
    id: 4, 
    type: "DOSSIER", 
    title: "UVCE Marvel Level 3", 
    date: "July 2026", 
    status: "COMPLETED", 
    tech: "PyTorch, HuggingFace", 
    desc: "Implemented advanced neural networks and RAG systems." 
  },
  { 
    id: 5, 
    type: "END", 
    title: "END OF FILE" 
  }
];

// Page component must be forwardRef for react-pageflip
const Page = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage bg-[var(--bg-secondary)] border-r-2 border-l-2 border-[var(--border-color)] overflow-hidden shadow-inner relative" ref={ref}>
      {/* Binding styling for realism */}
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
          > Submissions.log
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
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-8">
                      <span className="font-mono-custom bg-[var(--accent)] text-[var(--bg-primary)] px-2 py-1 text-sm font-bold">
                        {sub.status}
                      </span>
                      <span className="font-mono-custom text-sm">{sub.date}</span>
                    </div>
                    
                    <h3 className="text-3xl font-bold uppercase mb-4 leading-tight">{sub.title}</h3>
                    
                    <div className="mt-auto space-y-6">
                      <div>
                        <p className="font-mono-custom text-xs opacity-60 mb-1">TECH_STACK</p>
                        <p className="font-mono-custom border-l-2 border-[var(--accent)] pl-2">{sub.tech}</p>
                      </div>
                      
                      <div>
                        <p className="font-mono-custom text-xs opacity-60 mb-1">EXECUTION_SUMMARY</p>
                        <p className="text-lg leading-relaxed">{sub.desc}</p>
                      </div>
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
