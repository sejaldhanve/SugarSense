import React, { useEffect, useRef } from 'react';

const FloatingElements: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll('.floating-element');
    
    elements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      
      // Set initial random positions
      htmlElement.style.left = `${Math.random() * 100}%`;
      htmlElement.style.top = `${Math.random() * 100}%`;
      
      // Add random animation delays
      htmlElement.style.animationDelay = `${index * 2}s`;
      htmlElement.style.animationDuration = `${15 + Math.random() * 10}s`;
    });

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      elements.forEach((element) => {
        (element as HTMLElement).style.animation = 'none';
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <div className="floating-element absolute w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full animate-float-slow"></div>
      <div className="floating-element absolute w-16 h-16 bg-gradient-to-br from-teal-400/10 to-emerald-400/10 rounded-full animate-float-medium"></div>
      <div className="floating-element absolute w-12 h-12 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 rounded-full animate-float-fast"></div>
      <div className="floating-element absolute w-24 h-24 bg-gradient-to-br from-teal-300/8 to-emerald-300/8 rounded-full animate-float-slow"></div>
      <div className="floating-element absolute w-8 h-8 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full animate-float-fast"></div>
      <div className="floating-element absolute w-14 h-14 bg-gradient-to-br from-teal-500/12 to-emerald-500/12 rounded-full animate-float-medium"></div>
      
      {/* Organic blob shapes */}
      <div className="floating-element absolute w-32 h-32 bg-gradient-to-br from-emerald-400/5 to-teal-400/5 rounded-full animate-float-slow transform rotate-45"></div>
      <div className="floating-element absolute w-28 h-28 bg-gradient-to-br from-teal-400/8 to-emerald-400/8 rounded-full animate-float-medium transform -rotate-12"></div>
    </div>
  );
};

export default FloatingElements;