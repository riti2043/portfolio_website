import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const graphData = {
  nodes: [
    { id: 'Brain', group: 1, val: 30, name: 'AI/ML Brain' },
    { id: 'CV', group: 2, val: 15, name: 'Computer Vision' },
    { id: 'NLP', group: 3, val: 15, name: 'NLP' },
    { id: 'GenAI', group: 4, val: 15, name: 'Generative AI' },
    { id: 'ClassML', group: 5, val: 15, name: 'Classical ML' },
    { id: 'CNN', group: 2, val: 5, name: 'CNNs & Transfer Learning (Task 7)' },
    { id: 'KMeans', group: 2, val: 5, name: 'K-Means Image Clustering (Task 4)' },
    { id: 'LSTM', group: 3, val: 5, name: 'RNN & LSTM (Task 8)' },
    { id: 'DistilBERT', group: 3, val: 5, name: 'Transformer NLP (Task 9)' },
    { id: 'GAN', group: 4, val: 5, name: 'GANs (Task 10)' },
    { id: 'RAG', group: 4, val: 5, name: 'LangChain RAG (Task 11)' },
    { id: 'Bayes', group: 5, val: 5, name: 'Naive Bayes (Task 1)' },
    { id: 'Ensemble', group: 5, val: 5, name: 'XGBoost & Trees (Task 2)' },
    { id: 'Torch', group: 6, val: 10, name: 'PyTorch Basics (Task 5)' },
  ],
  links: [
    { source: 'Brain', target: 'CV' },
    { source: 'Brain', target: 'NLP' },
    { source: 'Brain', target: 'GenAI' },
    { source: 'Brain', target: 'ClassML' },
    { source: 'Brain', target: 'Torch' },
    { source: 'CV', target: 'CNN' },
    { source: 'CV', target: 'KMeans' },
    { source: 'NLP', target: 'LSTM' },
    { source: 'NLP', target: 'DistilBERT' },
    { source: 'GenAI', target: 'GAN' },
    { source: 'GenAI', target: 'RAG' },
    { source: 'ClassML', target: 'Bayes' },
    { source: 'ClassML', target: 'Ensemble' },
    { source: 'Torch', target: 'CNN' },
    { source: 'Torch', target: 'GAN' }
  ]
};

export const KnowledgeGraph = () => {
  const containerRef = useRef();
  const fgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isClient, setIsClient] = useState(false);
  const [hoverNode, setHoverNode] = useState(null);

  useEffect(() => {
    setIsClient(true);
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: 600
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 600
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Spread the nodes out once mounted
  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-400); // Repels nodes further apart
      fgRef.current.d3Force('link').distance(60);     // Makes links longer
    }
  }, [isClient]);

  // Use accent color from CSS variables, fallback to hex if not mounted
  const getThemeColor = () => {
    if (typeof window !== 'undefined') {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      return color || '#db5435';
    }
    return '#db5435';
  };

  const getBgColor = () => {
    if (typeof window !== 'undefined') {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
      return color || '#0b0b0b';
    }
    return '#0b0b0b';
  };

  return (
    <section className="py-24 px-6 relative z-10 w-full border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <h2 className="text-3xl md:text-5xl font-mono-custom uppercase border-b-2 border-[var(--border-color)] inline-block pb-2">
            > Neural_Map.exe
          </h2>
          <p className="font-mono-custom opacity-70 max-w-sm text-right mt-4 md:mt-0">
            [Interactive Mode]: Hover nodes to read data. Drag nodes to manipulate topology.
          </p>
        </div>
        
        <div 
          ref={containerRef} 
          className="w-full h-[600px] border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] relative overflow-hidden"
          style={{ cursor: 'crosshair' }}
        >
          <div className="absolute top-4 left-4 z-10 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2 font-mono-custom text-xs">
            STATUS: ONLINE // PHYSICS: SPREAD
          </div>

          {isClient && (
            <ForceGraph2D
              ref={fgRef}
              width={dimensions.width}
              height={dimensions.height}
              graphData={graphData}
              backgroundColor="transparent"
              nodeColor={() => getThemeColor()}
              linkColor={() => getThemeColor()}
              nodeRelSize={6}
              linkWidth={1.5}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.005}
              linkDirectionalParticleWidth={3}
              linkDirectionalParticleColor={() => getThemeColor()}
              onNodeHover={setHoverNode}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const themeColor = getThemeColor();
                const bgColor = getBgColor();
                
                // 1. Draw Node as a PERFECT DOT (Circle)
                const size = Math.sqrt(node.val) * 1.2;
                ctx.beginPath();
                ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                ctx.fillStyle = themeColor;
                ctx.fill();

                // 2. Draw text ONLY for the main Brain node or the hovered node
                if (hoverNode === node || node.id === 'Brain') {
                  const label = node.name;
                  const fontSize = 16 / globalScale;
                  ctx.font = `${fontSize}px "VT323", monospace`;
                  const textWidth = ctx.measureText(label).width;
                  const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4); // padding

                  // Draw background box for text to prevent overlap readability issues
                  ctx.fillStyle = bgColor;
                  ctx.fillRect(
                    node.x - bckgDimensions[0] / 2, 
                    node.y + size + 4, 
                    bckgDimensions[0], 
                    bckgDimensions[1]
                  );
                  // Draw text box border
                  ctx.strokeStyle = themeColor;
                  ctx.lineWidth = 1 / globalScale;
                  ctx.strokeRect(
                    node.x - bckgDimensions[0] / 2, 
                    node.y + size + 4, 
                    bckgDimensions[0], 
                    bckgDimensions[1]
                  );

                  // Draw Text
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = themeColor;
                  ctx.fillText(label, node.x, node.y + size + 4 + (bckgDimensions[1] / 2));
                }
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
};
