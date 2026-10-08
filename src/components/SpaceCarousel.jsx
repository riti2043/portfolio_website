import React, { useRef, useState, useEffect } from 'react';
import './space-carousel.css';

export const SpaceCarousel = () => {
  const carouselRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const totalSlides = 4;

  const handleScroll = () => {
    if (carouselRef.current) {
      const index = Math.round(carouselRef.current.scrollLeft / carouselRef.current.offsetWidth);
      setCurrent(index % totalSlides);
    }
  };

  const goToSlide = (index) => {
    const nextIndex = (index + totalSlides) % totalSlides;
    setCurrent(nextIndex);
    if (carouselRef.current && carouselRef.current.children[nextIndex]) {
      carouselRef.current.children[nextIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section id="projects" className="projects-section w-full max-w-7xl mx-auto">
      <div className="projects-top-row">
        <h2 className="projects-heading">Projects</h2>
        <div className="carousel-indicator">
          <div className="indicator-numbers">
            {[0, 1, 2, 3].map((num) => (
              <button
                key={num}
                className={`ind-num ${current === num ? 'active' : ''}`}
                onClick={() => goToSlide(num)}
              >
                0{num + 1}
              </button>
            ))}
          </div>
          <div className="indicator-bar">
            <div
              className="indicator-fill"
              style={{ width: `${((current + 1) / totalSlides) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="carousel-outer">
        <button
          className="carousel-arrow left"
          onClick={() => goToSlide(current - 1)}
        >
          &#9664;
        </button>

        <div className="carousel" id="carousel" ref={carouselRef}>
          {/* Slide 1: Rune AI */}
          <div className={`carousel-slide ${current === 0 ? 'active' : ''}`} id="slide-1">
            <div className="slide-media">
              <div className="slide-img-placeholder flex flex-col items-center justify-center h-[300px] bg-white/5 m-4 rounded-xl border border-white/10">
                <span className="placeholder-icon text-4xl mb-2">📸</span>
                <span className="placeholder-text text-sm opacity-50 font-mono">UI Screenshot</span>
              </div>
            </div>
            <div className="slide-content">
              <span className="slide-label">Agentic AI // 01</span>
              <h3 className="slide-title">Rune <em>AI</em></h3>
              <p className="slide-desc">
                A personal AI assistant powered by a local Ollama model and a Gradio web UI. Rune runs entirely on your machine — no API keys, no data leaks — offering a fast, private, conversational experience with memory and tool-calling capabilities.
              </p>
              <div className="slide-tags">
                <span className="card-tag">Python</span>
                <span className="card-tag">Gradio</span>
                <span className="card-tag">Ollama</span>
                <span className="card-tag">LLM</span>
                <span className="card-tag">Agentic AI</span>
              </div>
              <div className="slide-links">
                <a href="https://huggingface.co/spaces/riti2043/Rune" target="_blank" rel="noreferrer" className="card-btn">🚀 Live Demo</a>
                <a href="https://github.com/riti2043/Personal-AI-assistant" target="_blank" rel="noreferrer" className="card-btn">GitHub</a>
              </div>
            </div>
          </div>

          {/* Slide 2: Sanketa */}
          <div className={`carousel-slide ${current === 1 ? 'active' : ''}`} id="slide-2">
            <div className="slide-media">
              <div className="slide-video-placeholder flex flex-col items-center justify-center h-[300px] bg-white/5 m-4 rounded-xl border border-white/10">
                <span className="placeholder-icon text-4xl mb-2">🎥</span>
                <span className="placeholder-text text-sm opacity-50 font-mono">Demo Video Coming Soon</span>
              </div>
            </div>
            <div className="slide-content">
              <span className="slide-label">Computer Vision // 02</span>
              <h3 className="slide-title">Sanketa <em>Touch</em></h3>
              <p className="slide-desc">
                A fully touchless, sterile medical imaging system for operating theatres. Using a webcam and MediaPipe hand tracking, surgeons control DICOM X-Ray viewers and 3D CT reconstructions through natural gestures — no mouse, no keyboard, no infection risk.
              </p>
              <div className="slide-tags">
                <span className="card-tag">Python</span>
                <span className="card-tag">MediaPipe</span>
                <span className="card-tag">PyQt6</span>
                <span className="card-tag">VTK</span>
                <span className="card-tag">DICOM</span>
                <span className="card-tag">Computer Vision</span>
              </div>
              <div className="slide-links">
                <a href="https://github.com/riti2043/Marvel-GPP" target="_blank" rel="noreferrer" className="card-btn">Source Code</a>
              </div>
            </div>
          </div>

          {/* Slide 3: Peer Learn */}
          <div className={`carousel-slide ${current === 2 ? 'active' : ''}`} id="slide-3">
            <div className="slide-media">
              <div className="slide-img-placeholder coming-soon-media flex flex-col items-center justify-center h-[300px] bg-white/5 m-4 rounded-xl border border-white/10">
                <span className="placeholder-icon text-4xl mb-2">🚧</span>
                <span className="placeholder-text text-sm opacity-50 font-mono">In Development</span>
              </div>
            </div>
            <div className="slide-content">
              <span className="slide-label">Development // 03</span>
              <h3 className="slide-title">Peer <em>Learn</em></h3>
              <p className="slide-desc">
                A collaborative peer-to-peer learning platform currently in development. Stay tuned — links and details will be added once the project launches.
              </p>
              <div className="slide-tags">
                <span className="card-tag">Coming Soon</span>
              </div>
              <div className="slide-links">
                <button className="card-btn opacity-40 cursor-not-allowed">⏳ Not Yet Live</button>
              </div>
            </div>
          </div>

          {/* Slide 4: View More */}
          <div className={`carousel-slide ${current === 3 ? 'active' : ''}`} id="slide-4">
            <div className="slide-content view-more-slide h-[300px] flex flex-col justify-center">
              <span className="slide-label">Explore // 04</span>
              <h3 className="slide-title">View <em>More</em></h3>
              <p className="slide-desc">Browse more projects by category. Click a tag to see what else I've built.</p>
              <div className="view-more-categories mt-4 flex gap-4 flex-wrap">
                <button className="view-more-btn card-btn">
                  <span>Computer Vision</span>
                </button>
                <button className="view-more-btn card-btn">
                  <span>Agentic AI</span>
                </button>
                <button className="view-more-btn card-btn">
                  <span>Development</span>
                </button>
                <button className="view-more-btn card-btn">
                  <span>AI / ML</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          className="carousel-arrow right"
          onClick={() => goToSlide(current + 1)}
        >
          &#9654;
        </button>
      </div>
    </section>
  );
};
