"use client"
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

class ParticleImpl implements Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  canvasWidth: number;
  canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1; // Increased minimum size
  }

  update(): void {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.canvasWidth) this.vx = -this.vx;
    if (this.y < 0 || this.y > this.canvasHeight) this.vy = -this.vy;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Increased opacity and changed to white
    ctx.fill();
  }
}

const NetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      if (!canvas) return;

      // Set to window's inner dimensions
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);
      createParticles();
    };

    const createParticles = () => {
      if (!canvas) return;
      particles = [];
      // Increased number of particles
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000);
      console.log(`Creating ${numberOfParticles} particles`);

      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new ParticleImpl(canvas.width, canvas.height));
      }
    };

    const drawConnections = () => {
      if (!ctx) return;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Increased opacity and changed to white
      ctx.lineWidth = 0.5; // Added line width

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) { // Increased connection distance
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = 1 - (distance / 150);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0"
      style={{
        background: 'transparent',
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    />
  );
};

export default NetworkBackground;
