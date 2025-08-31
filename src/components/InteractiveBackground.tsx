'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  connectionDistance: number;
}

interface MousePosition {
  x: number;
  y: number;
}

interface InteractiveBackgroundProps {
  height?: string;
}

export default function InteractiveBackground({ height = '100vh' }: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isMouseOnPage, setIsMouseOnPage] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const mouseLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize particles
  useEffect(() => {
    const initParticles = () => {
      const particles: Particle[] = [];
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          connectionDistance: Math.random() * 150 + 100,
        });
      }
      particlesRef.current = particles;
    };

    initParticles();

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse tracking and page leave detection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsMouseOnPage(true);
      setAnimationSpeed(1);
      
      // Clear existing timeout
      if (mouseLeaveTimeoutRef.current) {
        clearTimeout(mouseLeaveTimeoutRef.current);
      }
    };

    const handleMouseLeave = () => {
      setIsMouseOnPage(false);
      
      // Set timeout to slow down animation after 5 seconds
      mouseLeaveTimeoutRef.current = setTimeout(() => {
        setAnimationSpeed(0.1); // Slow down to 10% speed
      }, 5000);
    };

    const handleMouseEnter = () => {
      setIsMouseOnPage(true);
      setAnimationSpeed(1);
      
      // Clear timeout if mouse re-enters
      if (mouseLeaveTimeoutRef.current) {
        clearTimeout(mouseLeaveTimeoutRef.current);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (mouseLeaveTimeoutRef.current) {
        clearTimeout(mouseLeaveTimeoutRef.current);
      }
    };
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient that changes with scroll
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      const scrollProgress = Math.min(scrollY / (document.body.scrollHeight - window.innerHeight), 1);
      const darkBlueIntensity = Math.min(0.03 + scrollProgress * 0.09, 0.12); // Max 12% intensity (40% darker)
      
      gradient.addColorStop(0, `hsl(220, 100%, ${darkBlueIntensity * 100}%)`); // Dark blue
      gradient.addColorStop(1, `hsl(0, 0%, 0%)`); // Black
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Mouse interaction
        const dx = mousePos.x - particle.x;
        const dy = mousePos.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const mouseInfluence = Math.max(0, 200 - distance) / 200;

        // Update particle position with animation speed
        particle.x += (particle.vx + (dx * mouseInfluence * 0.02)) * animationSpeed;
        particle.y += (particle.vy + (dy * mouseInfluence * 0.02)) * animationSpeed;

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 73, 39, ${particle.opacity + mouseInfluence * 0.3})`; // Orange color #F54927
        ctx.fill();

        // Draw connections
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx2 = particle.x - otherParticle.x;
          const dy2 = particle.y - otherParticle.y;
          const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (distance2 < particle.connectionDistance) {
            const opacity = (1 - distance2 / particle.connectionDistance) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(245, 73, 39, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos, scrollY, animationSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 z-0 pointer-events-none"
      style={{ 
        background: 'transparent',
        height: height,
        width: '100%'
      }}
    />
  );
}
