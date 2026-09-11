import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award } from 'lucide-react';

const certifications = [
  { id: 1, title: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2025", image: "https://via.placeholder.com/600x400/0b0b0b/db5435?text=AWS+Certificate" },
  { id: 2, title: "Deep Learning Specialization", issuer: "Coursera", date: "2024", image: "https://via.placeholder.com/600x400/0b0b0b/db5435?text=Deep+Learning+Cert" },
  { id: 3, title: "UVCE Marvel Level 3", issuer: "UVCE", date: "2026", image: "https://via.placeholder.com/600x400/0b0b0b/db5435?text=UVCE+Marvel" }
];

export const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section className="py-24 px-6 relative z-10 w-full border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-5xl font-mono-custom mb-12 uppercase border-b-2 border-[var(--border-color)] inline-block pb-2">
          > Certifications.exe
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCert(cert)}
              className="cursor-pointer border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 flex flex-col items-start gap-4 transition-colors hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] group"
            >
              <Award className="w-8 h-8 group-hover:stroke-[var(--bg-primary)] stroke-[var(--accent)]" />
              <div>
                <h3 className="font-bold text-xl uppercase tracking-wider">{cert.title}</h3>
                <p className="font-mono-custom text-sm opacity-80">{cert.issuer} // {cert.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full border-2 border-[var(--accent)] bg-[var(--bg-primary)] p-2 shadow-[8px_8px_0px_var(--accent)]"
            >
              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute -top-4 -right-4 bg-[var(--bg-primary)] border-2 border-[var(--accent)] text-[var(--accent)] p-2 hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="border border-[var(--border-color)] p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                  <h3 className="font-mono-custom text-2xl uppercase">{selectedCert.title}</h3>
                  <span className="font-mono-custom bg-[var(--accent)] text-[var(--bg-primary)] px-2 py-1">VERIFIED</span>
                </div>
                <img 
                  src={selectedCert.image} 
                  alt={selectedCert.title} 
                  className="w-full h-auto object-cover border border-[var(--border-color)] grayscale contrast-150 hover:grayscale-0 transition-all duration-500"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
