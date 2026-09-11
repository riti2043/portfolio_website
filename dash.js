const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const replacement = \const ProfileDashboard = () => {
  return (
    <section id="hero" className="min-h-screen pt-32 pb-16 px-4 flex flex-col items-center justify-center relative">
      <div className="max-w-[1000px] w-full mx-auto relative z-10">
        
        {/* BIG NAME HEADER */}
        <h1 className="text-5xl md:text-7xl font-mono-custom text-glow text-center mb-6 uppercase tracking-widest">
          RITHYA JAYARAM
        </h1>

        {/* DASHBOARD CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 hud-glow bg-[#0b0b0b]/90 backdrop-blur-md">
          
          {/* COL 1: PHOTO (spans 4/12) */}
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r hud-divider p-4 flex flex-col">
            <h2 className="text-xs font-mono-custom text-glow mb-4 uppercase">PHOTO</h2>
            <div className="flex-1 w-full relative min-h-[300px] flex items-center justify-center overflow-hidden hud-glow">
               <img src="/profile.jpg" alt="Profile" className="object-cover w-full h-full opacity-90 mix-blend-screen" />
            </div>
          </div>

          {/* COL 2: DATA (spans 5/12) */}
          <div className="md:col-span-5 border-b md:border-b-0 md:border-r hud-divider flex flex-col">
            
            {/* STATS (top half) */}
            <div className="p-6 border-b hud-divider space-y-2 font-mono-custom text-sm">
               <div className="flex">
                 <span className="text-[var(--accent)] w-32 text-glow">age:</span> 
                 <span className="text-[var(--text-primary)]">20</span>
               </div>
               <div className="flex">
                 <span className="text-[var(--accent)] w-32 text-glow">role:</span> 
                 <span className="text-[var(--text-primary)]">AI Enthusiast</span>
               </div>
               <div className="flex">
                 <span className="text-[var(--accent)] w-32 text-glow">base:</span> 
                 <span className="text-[var(--text-primary)]">College</span>
               </div>
               <div className="flex">
                 <span className="text-[var(--accent)] w-32 text-glow">location:</span> 
                 <span className="text-[var(--text-primary)]">Earth</span>
               </div>
            </div>
            
            {/* CHARTS (bottom half) */}
            <div className="p-6 flex-1 flex flex-col gap-6">
               <div className="flex justify-between items-end h-full">
                 {/* Radar */}
                 <div className="relative flex items-center justify-center w-[120px] h-[120px] mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                       <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-80">
                          {/* Hexagon Grid */}
                          <polygon points="50,5 93,25 93,75 50,95 7,75 7,25" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
                          <polygon points="50,25 73,38 73,62 50,75 27,62 27,38" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
                          {/* Data Polygon */}
                          <polygon points="50,15 80,45 60,85 40,70 15,35" fill="rgba(219,84,53,0.3)" stroke="var(--accent)" strokeWidth="1.5" className="drop-shadow-[0_0_4px_var(--accent)]" />
                       </svg>
                    </div>
                    {/* Labels */}
                    <span className="absolute -top-4 text-[10px] text-glow font-mono-custom">problem-solving</span>
                    <span className="absolute -left-6 text-[10px] text-glow font-mono-custom">comms</span>
                    <span className="absolute -right-4 text-[10px] text-glow font-mono-custom">speed</span>
                    <span className="absolute -bottom-4 text-[10px] text-glow font-mono-custom">creativity</span>
                 </div>
                 
                 {/* Progress Bars */}
                 <div className="flex flex-col justify-end gap-4 font-mono-custom text-xs w-[120px] mb-4">
                    <div>
                       <div className="mb-1 text-glow">AI / ML</div>
                       <div className="h-3 w-full border border-[var(--accent)] p-[1px]">
                          <div className="h-full bg-[var(--accent)] w-[85%] shadow-[0_0_8px_var(--accent)]"></div>
                       </div>
                    </div>
                    <div>
                       <div className="mb-1 text-glow">development</div>
                       <div className="h-3 w-full border border-[var(--accent)] p-[1px]">
                          <div className="h-full bg-[var(--accent)] w-[75%] shadow-[0_0_8px_var(--accent)]"></div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* COL 3: ABOUT (spans 3/12) */}
          <div className="md:col-span-3 flex flex-col">
            <div className="p-4 flex-1 border-b hud-divider">
               <h2 className="text-xs font-mono-custom text-glow mb-4 uppercase">about me text</h2>
               {/* Ruled lines overlay */}
               <div className="relative font-mono-custom text-[11px] leading-[24px] text-[var(--text-primary)]" 
                    style={{ 
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, rgba(219,84,53,0.3) 24px)',
                      backgroundSize: '100% 24px'
                    }}>
                 <p className="pt-1">
                   A passionate AI & ML developer focused on integrating deep learning with modern generative architecture. I love solving complex problems with robust code.
                 </p>
               </div>
            </div>
            
            <div className="p-4 flex flex-col gap-3">
               <a href="#projects" className="btn-pixel w-full text-center py-2 text-xs">VIEW PROJECTS</a>
               <a href="#contact" className="btn-pixel w-full text-center py-2 text-xs">LET'S TALK</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};\;

const lines = app.split('\n');
const start = lines.findIndex(l => l.includes('const HeroScrollSequence = () => {'));
let end = start;
let bracketCount = 0;
let foundStart = false;

for (let i = start; i < lines.length; i++) {
  if (lines[i].includes('{')) {
    bracketCount += (lines[i].match(/\{/g) || []).length;
    foundStart = true;
  }
  if (lines[i].includes('}')) {
    bracketCount -= (lines[i].match(/\}/g) || []).length;
  }
  
  if (foundStart && bracketCount === 0) {
    end = i;
    break;
  }
}

lines.splice(start, end - start + 1, replacement);
app = lines.join('\n');
app = app.replace('<HeroScrollSequence />', '<ProfileDashboard />');
fs.writeFileSync('src/App.jsx', app);
