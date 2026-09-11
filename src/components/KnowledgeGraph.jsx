import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion, AnimatePresence } from 'framer-motion';

// Core Data
const coreNodes = [
  { id: 'Brain', val: 24, name: 'AI/ML Brain', desc: 'The central hub mapping my entire artificial intelligence and machine learning journey.', fx: 0, fy: 0 }, // fx, fy locks it to the center
  { id: 'CV', val: 14, name: 'Computer Vision', desc: 'Extracting meaning and features from visual data using deep learning.' },
  { id: 'NLP', val: 14, name: 'NLP', desc: 'Natural Language Processing: Understanding and generating human language.' },
  { id: 'GenAI', val: 14, name: 'Generative AI', desc: 'Creating new data, images, and text using adversarial and transformer models.' },
  { id: 'ClassML', val: 14, name: 'Classical ML', desc: 'Foundational statistical machine learning algorithms and data preprocessing.' },
  { id: 'Torch', val: 14, name: 'PyTorch Fundamentals', desc: 'UVCE Marvel Task 5: Mastered tensors, Autograd, and custom neural network training loops on GPUs.' },
  { id: 'CNN', val: 8, name: 'CNNs & Transfer Learning', desc: 'UVCE Marvel Task 7: Built Convolutional Neural Networks from scratch and fine-tuned ResNet models on CIFAR-10.' },
  { id: 'KMeans', val: 8, name: 'K-Means Clustering', desc: 'UVCE Marvel Task 4: Applied unsupervised K-Means clustering to MNIST handwritten digit images.' },
  { id: 'LSTM', val: 8, name: 'RNN & LSTM', desc: 'UVCE Marvel Task 8: Modeled sequential data and solved vanishing gradient problems using Long Short-Term Memory networks.' },
  { id: 'DistilBERT', val: 8, name: 'Transformer NLP', desc: 'UVCE Marvel Task 9: Fine-tuned modern HuggingFace DistilBERT transformers for sentiment analysis.' },
  { id: 'GAN', val: 8, name: 'GANs', desc: 'UVCE Marvel Task 10: Designed Generator and Discriminator networks to synthesize fake images from random noise.' },
  { id: 'RAG', val: 8, name: 'LangChain RAG', desc: 'UVCE Marvel Task 11: Built a Retrieval-Augmented Generation system to answer questions directly from PDF documents.' },
  { id: 'Bayes', val: 8, name: 'Naive Bayes', desc: 'UVCE Marvel Task 1: Implemented probabilistic classification from scratch using Bayes theorem and NumPy.' },
  { id: 'Ensemble', val: 8, name: 'XGBoost & Trees', desc: 'UVCE Marvel Task 2: Trained Random Forest, GBM, and XGBoost models on Titanic data for high-accuracy predictions.' },
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

// Generate dense background "constellation" nodes
const generateGraphData = () => {
  const nodes = [...coreNodes];
  const links = [...coreLinks];

  // Add 80 random background particles
  for (let i = 0; i < 80; i++) {
    const bgId = `bg_${i}`;
    nodes.push({ id: bgId, val: 2, isBackground: true });
    
    // Randomly link to another background node to build a web
    if (i > 0) {
      const target = `bg_${Math.floor(Math.random() * i)}`;
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
  const [selectedNode, setSelectedNode] = useState(null);
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

  // Tune physics for a 360-degree radial burst layout
  useEffect(() => {
    if (fgRef.current) {
      // Massive repulsion so nodes fill the whole vertical/horizontal space
      fgRef.current.d3Force('charge').strength(node => node.isBackground ? -40 : -800); 
      // Very long links for core nodes, very short for background constellation
      fgRef.current.d3Force('link').distance(link => link.isBackground ? 20 : 150);
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
            [Radial Mode]: AI/ML Brain is centered. Exploring full stack topology.
          </p>
        </div>
        
        <div 
          ref={containerRef} 
          className="w-full h-[650px] border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] relative overflow-hidden flex flex-col md:flex-row"
        >
          {/* Status HUD */}
          <div className="absolute top-4 left-4 z-10 bg-[var(--bg-primary)] border border-[var(--border-color)] p-2 font-mono-custom text-xs pointer-events-none shadow-[4px_4px_0px_var(--accent)]">
            LAYOUT: RADIAL_BURST // PARTICLES: 80
          </div>

          {/* Graph Canvas */}
          <div className="flex-grow h-full" style={{ cursor: 'pointer' }}>
            {isClient && (
              <ForceGraph2D
                ref={fgRef}
                width={dimensions.width > 768 ? dimensions.width - 320 : dimensions.width} // Adjust for permanent side panel
                height={dimensions.height > 768 ? dimensions.height : dimensions.height - 250} // Adjust on mobile
                graphData={graphData}
                backgroundColor="transparent"
                nodeRelSize={6}
                linkWidth={link => link.isBackground ? 0.5 : 1.5}
                linkColor={(link) => {
                  const color = getThemeColor();
                  return link.isBackground ? `${color}30` : `${color}80`; // Faint bg, strong core
                }}
                onNodeClick={(node) => {
                  if (!node.isBackground) setSelectedNode(node);
                }}
                onNodeHover={(node) => {
                  if (node && !node.isBackground) setHoverNode(node);
                  else setHoverNode(null);
                }}
                nodeCanvasObject={(node, ctx, globalScale) => {
                  const themeColor = getThemeColor();
                  const bgColor = getBgColor();
                  
                  const isSelected = selectedNode && selectedNode.id === node.id;
                  const isHovered = hoverNode && hoverNode.id === node.id;
                  
                  // 1. Draw Glowing Dot
                  const size = Math.sqrt(node.val) * 1.5;
                  
                  ctx.shadowBlur = node.isBackground ? 2 : 12;
                  ctx.shadowColor = themeColor;
                  
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                  ctx.fillStyle = node.isBackground ? `${themeColor}60` : (isSelected || isHovered ? bgColor : themeColor);
                  ctx.fill();
                  
                  if (!node.isBackground) {
                    ctx.lineWidth = 2 / globalScale;
                    ctx.strokeStyle = themeColor;
                    ctx.stroke();
                  }

                  // Reset shadow for text
                  ctx.shadowBlur = 0;

                  // 2. Draw Permanent Labels ONLY for core nodes
                  if (!node.isBackground) {
                    const label = node.name;
                    const fontSize = (isSelected || isHovered ? 16 : 14) / globalScale;
                    ctx.font = `${fontSize}px "VT323", monospace`;
                    
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);
                    
                    // Draw text background below the node
                    const yPos = node.y + size + 6;
                    
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(
                      node.x - bckgDimensions[0] / 2,
                      yPos - (bckgDimensions[1] / 2),
                      bckgDimensions[0],
                      bckgDimensions[1]
                    );

                    // Text itself
                    ctx.fillStyle = themeColor;
                    ctx.fillText(label, node.x, yPos);
                  }
                }}
              />
            )}
          </div>

          {/* Permanent Side Info Panel */}
          <div className="w-full md:w-80 h-64 md:h-full bg-[var(--bg-primary)] border-t-2 md:border-t-0 md:border-l-2 border-[var(--border-color)] flex flex-col z-20 shrink-0">
            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--accent)] text-[var(--bg-primary)]">
              <span className="font-mono-custom font-bold uppercase tracking-wider">
                {selectedNode ? "Node_Data_Extracted" : "Mission_Briefing"}
              </span>
            </div>
            
            <div className="p-6 flex-grow flex flex-col gap-6 overflow-y-auto custom-scrollbar relative">
              <AnimatePresence mode="wait">
                {selectedNode ? (
                  <motion.div
                    key={selectedNode.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col h-full gap-6"
                  >
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
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col h-full gap-4"
                  >
                    <div>
                      <h3 className="text-2xl font-bold uppercase leading-tight mb-2">AI/ML Journey</h3>
                      <div className="w-full h-px bg-[var(--border-color)] opacity-30" />
                    </div>
                    
                    <p className="text-lg leading-relaxed">
                      This graph represents my technical learning path and skill tree in Artificial Intelligence and Machine Learning.
                    </p>
                    <p className="text-lg leading-relaxed">
                      Many of the specific leaf nodes map directly to tasks completed during my <strong>UVCE Marvel</strong> engineering program.
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-[var(--border-color)] border-dashed">
                      <p className="font-mono-custom text-sm font-bold text-[var(--accent)] animate-pulse">
                        &gt; SELECT ANY NODE TO VIEW DETAILS
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
