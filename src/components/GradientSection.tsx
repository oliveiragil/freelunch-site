'use client';

import { useEffect, useState } from 'react';

export default function GradientSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate gradient progress
  const firstSectionHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const gradientStartScroll = firstSectionHeight;
  const gradientEndScroll = firstSectionHeight * 2;
  
  let gradientProgress = 0;
  if (scrollY > gradientStartScroll && scrollY < gradientEndScroll) {
    const rawProgress = (scrollY - gradientStartScroll) / (gradientEndScroll - gradientStartScroll);
    gradientProgress = Math.floor(rawProgress * 20) / 20; // 5% increments
  } else if (scrollY >= gradientEndScroll) {
    gradientProgress = 1;
  }

  const blueIntensity = gradientProgress * 0.12; // Subtle blue up to 12%

  return (
    <div 
      className="h-screen"
      style={{
        background: gradientProgress > 0 
          ? `linear-gradient(to bottom, black 0%, hsl(220, 100%, ${blueIntensity * 100}%) 100%)`
          : 'black'
      }}
    />
  );
}
