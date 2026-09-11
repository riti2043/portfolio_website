import React, { useEffect, useRef, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const graphData = {
  nodes: [
    { id: 'Brain', group: 1, val: 20, label: 'AI/ML Brain' },
    { id: 'CV', group: 2, val: 12, label: 'Computer Vision' },
    { id: 'NLP', group: 3, val: 12, label: 'NLP' },
    { id: 'GenAI', group: 4, val: 12, label: 'Generative AI' },
    { id: 'ClassML', group: 5, val: 12, label: 'Classical ML' },
    { id: 'CNN', group: 2, val: 6, label: 'CNNs & Transfer Learning (Marvel Task 7)' },
    { id: 'KMeans', group: 2, val: 6, label: 'K-Means Image Clustering (Marvel Task 4)' },
    { id: 'LSTM', group: 3, val: 6, label: 'RNN & LSTM (Marvel Task 8)' },
    { id: 'DistilBERT', group: 3, val: 6, label: 'Transformer NLP (Marvel Task 9)' },
    { id: 'GAN', group: 4, val: 6, label: 'GANs (Marvel Task 10)' },
    { id: 'RAG', group: 4, val: 6, label: 'PDF Q&A LangChain RAG (Marvel Task 11)' },
    { id: 'Bayes', group: 5, val: 6, label: 'Naive Bayes (Marvel Task 1)' },
    { id: 'Ensemble', group: 5, val: 6, label: 'XGBoost & Trees (Marvel Task 2)' },
    { id: 'Torch', group: 6, val: 8, label: 'PyTorch Basics (Marvel Task 5)' },
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
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isClient, setIsClient] = useState(false);

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
            [Interactive Mode]: Drag nodes to explore the UVCE Marvel Level 3 topology and broader ML knowledge base.
          </p>
        </div>
        
        <div 
          ref={containerRef} 
          className="w-full h-[600px] border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] relative overflow-hidden"
          style={{ cursor: 'crosshair' }}
        >
          <div className="absolute top-4 left-4 z-10 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2 font-mono-custom text-xs">
            STATUS: ONLINE // PHYSICS: ACTIVE
          </div>

          {isClient && (
            <ForceGraph2D
              width={dimensions.width}
              height={dimensions.height}
              graphData={graphData}
              backgroundColor="transparent"
              nodeColor={() => getThemeColor()}
              linkColor={() => getThemeColor()}
              nodeRelSize={6}
              linkWidth={2}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.005}
              linkDirectionalParticleColor={() => getThemeColor()}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.label;
                const fontSize = 12/globalScale;
                ctx.font = `${fontSize}px "VT323", monospace`;
                
                // Draw Node (Square pixel style)
                const size = node.val * 1.5;
                ctx.fillStyle = getThemeColor();
                ctx.fillRect(node.x - size/2, node.y - size/2, size, size);

                // Draw Text
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = getThemeColor();
                ctx.fillText(label, node.x, node.y + size + 4);
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
};
