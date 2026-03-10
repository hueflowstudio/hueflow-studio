'use client';

import { useState, useRef, useEffect } from 'react';
import BlueprintCanvas from './BlueprintCanvas';

export default function HeroSection() {
  const [followOpen, setFollowOpen] = useState(false);
  const followRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (followRef.current && !followRef.current.contains(e.target as Node)) {
        setFollowOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <>
      <style>{`
        .hero-wrap { position:relative; width:100%; height:100vh; display:flex; align-items:center; justify-content:center; overflow:hidden; background:#F2EBE3; }
        .hero-content { position:relative;z-index:2;text-align:center; }
        .hero-title { font-family:'Cormorant Garamond',serif;font-weight:300;font-size:clamp(2.8rem,6vw,5.5rem);line-height:1.05;letter-spacing:0.04em;color:#5C3420;margin:0 0 1.5rem; }
        .w-design { font-style:normal;font-weight:700;color:#5C3420; }
        .w-ai { font-weight:700;color:#5C3420; }
        .hero-cta { font-family:'Montserrat',sans-serif;font-size:0.65rem;letter-spacing:0.3em;text-transform:uppercase;color:#5C3D2E;text-decoration:none;opacity:0.5;border-bottom:1px solid rgba(44,24,16,0.3);padding-bottom:2px; }
        .hero-nav { position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:1.25rem 3rem;background:transparent; }
        .hero-nav-logo { font-family:'Cormorant Garamond',serif;font-weight:300;letter-spacing:0.35em;color:#2C1810;font-size:1.125rem;text-transform:uppercase;text-decoration:none; }
        .hero-nav-menu { display:flex;gap:2.5rem;list-style:none;margin:0;padding:0; }
        .hero-nav-menu a { font-family:'Montserrat',sans-serif;font-weight:300;letter-spacing:0.25em;color:#2C1810;font-size:0.75rem;text-transform:uppercase;text-decoration:none; }
        .hero-nav-follow-wrap { position:relative; }
        .hero-nav-follow-btn { font-family:'Montserrat',sans-serif;font-weight:300;letter-spacing:0.25em;color:#2C1810;font-size:0.75rem;text-transform:uppercase;background:none;border:none;cursor:pointer;padding:0; }
        .hero-nav-follow-btn:hover { color:#C9A96E; }
        .hero-nav-dropdown { position:absolute;top:100%;right:0;margin-top:0.5rem;min-width:180px;background:#F2EBE3;border:1px solid rgba(44,24,16,0.15);box-shadow:0 8px 24px rgba(44,24,16,0.12); padding:0.5rem 0; }
        .hero-nav-dropdown a { display:block;font-family:'Montserrat',sans-serif;font-weight:300;letter-spacing:0.2em;font-size:0.7rem;text-transform:uppercase;color:#2C1810;text-decoration:none;padding:0.5rem 1rem; }
        .hero-nav-dropdown a:hover { color:#C9A96E; }
      `}</style>
      <nav className="hero-nav">
        <a href="#" className="hero-nav-logo">Hueflow Studio</a>
        <ul className="hero-nav-menu">
          <li><a href="#portfolio">Portfolio</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#lectures">Lecture</a></li>
          <li><a href="#contact">Contact</a></li>
          <li>
            <div className="hero-nav-follow-wrap" ref={followRef}>
              <button type="button" className="hero-nav-follow-btn" onClick={() => setFollowOpen((v) => !v)} aria-expanded={followOpen} aria-haspopup="true">
                Follow
              </button>
              {followOpen && (
                <div className="hero-nav-dropdown" role="menu">
                  <a href="https://www.instagram.com/hueflow_studio" target="_blank" rel="noopener noreferrer" role="menuitem">Instagram</a>
                  <a href="https://www.threads.net/@hueflow_studio" target="_blank" rel="noopener noreferrer" role="menuitem">Threads</a>
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>
      <section className="hero-wrap">
        <BlueprintCanvas />
        <div className="hero-content">
          <h1 className="hero-title">
            We <span className="w-design">design</span> space.<br/>
            <span className="w-ai">AI</span> refines it.
          </h1>
          <a href="#portfolio" className="hero-cta">View Work →</a>
        </div>
      </section>
    </>
  );
}

