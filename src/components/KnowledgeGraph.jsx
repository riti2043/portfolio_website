import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Core Data (Clickable)
const coreNodes = [
  { id: 'Brain', val: 20, name: 'AI/ML Brain', desc: 'The central hub mapping my entire artificial intelligence and machine learning journey.' },
  { id: 'CV', val: 12, name: 'Computer Vision', desc: 'Extracting meaning and features from visual data using deep learning.' },
  { id: 'NLP', val: 12, name: 'NLP', desc: 'Natural Language Processing: Understanding and generating human language.' },
  { id: 'GenAI', val: 12, name: 'Generative AI', desc: 'Creating new data, images, and text using adversarial and transformer models.' },
  { id: 'ClassML', val: 12, name: 'Classical ML', desc: 'Foundational statistical machine learning algorithms and data preprocessing.' },
  { id: 'CNN', val: 8, name: 'CNNs & Transfer Learning', desc: 'UVCE Marvel Task 7: Built Convolutional Neural Networks from scratch and fine-tuned ResNet models on CIFAR-10.' },
  { id: 'KMeans', val: 8, name: 'K-Means Image Clustering', desc: 'UVCE Marvel Task 4: Applied unsupervised K-Means clustering to MNIST handwritten digit images.' },
  { id: 'LSTM', val: 8, name: 'RNN & LSTM', desc: 'UVCE Marvel Task 8: Modeled sequential data and solved vanishing gradient problems using Long Short-Term Memory networks.' },
  { id: 'DistilBERT', val: 8, name: 'Transformer NLP', desc: 'UVCE Marvel Task 9: Fine-tuned modern HuggingFace DistilBERT transformers for sentiment analysis.' },
  { id: 'GAN', val: 8, name: 'Generative Adversarial Networks', desc: 'UVCE Marvel Task 10: Designed Generator and Discriminator networks to synthesize fake images from random noise.' },
  { id: 'RAG', val: 8, name: 'LangChain RAG', desc: 'UVCE Marvel Task 11: Built a Retrieval-Augmented Generation system to answer questions directly from PDF documents.' },
  { id: 'Bayes', val: 8, name: 'Naive Bayes Classifier', desc: 'UVCE Marvel Task 1: Implemented probabilistic classification from scratch using Bayes theorem and NumPy.' },
  { id: 'Ensemble', val: 8, name: 'XGBoost & Trees', desc: 'UVCE Marvel Task 2: Trained Random Forest, GBM, and XGBoost models on Titanic data for high-accuracy predictions.' },
  { id: 'Torch', val: 12, name: 'PyTorch Fundamentals', desc: 'UVCE Marvel Task 5: Mastered tensors, Autograd, and custom neural network training loops on GPUs.' },
];

const coreLinks = [
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
];

// Generate dense background "constellation" nodes to mimic the reference image
const generateGraphData = () => {
  const nodes = [...coreNodes];
  const links = [...coreLinks];

  // Add 100 random background particles for the dense constellation look
  for (let i = 0; i < 100; i++) {
    const bgId = `bg_${i}`;
    nodes.push({ id: bgId, val: 1.5, isBackground: true });
    
    // Randomly link to another background node or a random core node to build a web
    if (i > 0) {
      const connectToBg = Math.random() > 0.3;
      const target = connectToBg 
        ? `bg_${Math.floor(Math.random() * i)}` 
        : coreNodes[Math.floor(Math.random() * coreNodes.length)].id;
      
      links.push({ source: bgId, target, isBackground: true });
    }
  }

  return { nodes, links };
};

const graphData = generateGraphData();

export const KnowledgeGraph = () => {
  const containerRef = useRef();
  const fgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isClient, setIsClient] = useState(false);
  
  // Interaction State
  const [hoverNode, setHoverNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

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
      fgRef.current.d3Force('charge').strength(-150); // Milder repel for denser constellation
      fgRef.current.d3Force('link').distance(link => link.isBackground ? 20 : 80); // Core links longer, bg links tight
    }
  }, [isClient]);

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
            &gt; Neural_Map.exe
          </h2>
          <p className="font-mono-custom opacity-70 max-w-sm text-right mt-4 md:mt-0">
            [Constellation Mode]: Click major nodes to extract sector data.
          </p>
        </div>
        
        <div 
          ref={containerRef} 
          className="w-full h-[600px] border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] relative overflow-hidden flex"
        >
          {/* Status HUD */}
          <div className="absolute top-4 left-4 z-10 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2 font-mono-custom text-xs pointer-events-none">
            STATUS: ONLINE // PARTICLES: 100+
          </div>

          {/* Graph Canvas */}
          <div className="flex-grow h-full" style={{ cursor: hoverNode && !hoverNode.isBackground ? 'pointer' : 'crosshair' }}>
            {isClient && (
              <ForceGraph2D
                ref={fgRef}
                width={selectedNode && dimensions.width > 768 ? dimensions.width - 320 : dimensions.width} // Shrink graph if panel is open on desktop
                height={dimensions.height}
                graphData={graphData}
                backgroundColor="transparent"
                nodeRelSize={6}
                linkWidth={link => link.isBackground ? 0.5 : 1.5} // Extremely thin background lines
                linkColor={(link) => {
                  const color = getThemeColor();
                  return link.isBackground ? `${color}40` : `${color}80`; // 40% and 80% opacity
                }}
                onNodeHover={(node) => {
                  if (node && !node.isBackground) setHoverNode(node);
                  else setHoverNode(null);
                }}
                onNodeClick={(node) => {
                  if (!node.isBackground) setSelectedNode(node);
                }}
                nodeCanvasObject={(node, ctx, globalScale) => {
                  const themeColor = getThemeColor();
                  const bgColor = getBgColor();
                  
                  // Draw Glowing Dot
                  const size = Math.sqrt(node.val);
                  
                  // Add Glow Effect
                  ctx.shadowBlur = node.isBackground ? 5 : 15;
                  ctx.shadowColor = themeColor;
                  
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                  ctx.fillStyle = node.isBackground ? `${themeColor}80` : themeColor;
                  ctx.fill();
                  
                  // Reset shadow for text
                  ctx.shadowBlur = 0;

                  // Draw text ONLY for the hovered node
                  if (hoverNode === node && !node.isBackground) {
                    const label = node.name;
                    const fontSize = 16 / globalScale;
                    ctx.font = `${fontSize}px "VT323", monospace`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

                    // Solid background behind text
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(
                      node.x - bckgDimensions[0] / 2, 
                      node.y + size + 4, 
                      bckgDimensions[0], 
                      bckgDimensions[1]
                    );
                    
                    // Thin Border
                    ctx.strokeStyle = themeColor;
                    ctx.lineWidth = 1 / globalScale;
                    ctx.strokeRect(
                      node.x - bckgDimensions[0] / 2, 
                      node.y + size + 4, 
                      bckgDimensions[0], 
                      bckgDimensions[1]
                    );

                    // Text
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = themeColor;
                    ctx.fillText(label, node.x, node.y + size + 4 + (bckgDimensions[1] / 2));
                  }
                }}
              />
            )}
          </div>

          {/* Side Info Panel (Opens on Click) */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 w-full md:w-80 h-full bg-[var(--bg-primary)] border-l-2 border-[var(--border-color)] flex flex-col z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
              >
                <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--accent)] text-[var(--bg-primary)]">
                  <span className="font-mono-custom font-bold uppercase tracking-wider">Node_Data_Extracted</span>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="hover:scale-110 transition-transform"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 flex-grow flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                  <div>
                    <h3 className="text-2xl font-bold uppercase leading-tight mb-2">{selectedNode.name}</h3>
                    <div className="w-full h-px bg-[var(--border-color)] opacity-30" />
                  </div>
                  
                  <div>
                    <p className="font-mono-custom text-xs opacity-60 mb-2">SECTOR_DESCRIPTION</p>
                    <p className="text-lg leading-relaxed">{selectedNode.desc}</p>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-[var(--border-color)] border-dashed">
                    <p className="font-mono-custom text-xs opacity-60 mb-2">STATUS</p>
                    <div className="font-mono-custom border border-[var(--accent)] px-3 py-1 inline-block">
                      INTEGRATION_COMPLETE
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
