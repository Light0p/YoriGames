"use client"

import React, { useEffect, useRef, useState } from 'react';
import { X, Rocket, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PixelButton } from '@/components/pixel/PixelButton';

interface TransmissionModalProps {
  isOpen: boolean;
  status: "SUCCESS" | "ERROR" | "SENDING";
  error?: string;
  onClose: () => void;
}

export const TransmissionModal = ({ isOpen, status, error, onClose }: TransmissionModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !canvasRef.current || status === "SENDING") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    // Animation state
    let frameId: number;
    let progress = 0;
    const particles: any[] = [];

    const createExplosion = (x: number, y: number) => {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1,
          color: Math.random() > 0.5 ? '#FF4FD8' : '#FFD34D'
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      progress += 0.02;

      if (status === "SUCCESS") {
        // Rocket Launch Animation
        const y = canvas.height - (progress * progress * 500);
        const x = canvas.width / 2;
        
        if (y > -50) {
          // Draw Rocket (Simple Pixel Style)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x - 5, y, 10, 20);
          ctx.fillStyle = '#A855F7';
          ctx.fillRect(x - 5, y + 20, 10, 5);
          
          // Flame
          ctx.fillStyle = progress % 0.1 > 0.05 ? '#EC4899' : '#FFD34D';
          ctx.fillRect(x - 3, y + 25, 6, 8);
        }
      } else if (status === "ERROR") {
        // Collision Animation
        const rx = canvas.width / 2;
        const ry = canvas.height / 2;
        const mx = canvas.width - (progress * 400);
        const my = (progress * 200);

        if (progress < 0.8) {
          // Draw Rocket
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(rx - 5, ry, 10, 20);
          // Draw Meteor
          ctx.fillStyle = '#FF4FD8';
          ctx.beginPath();
          ctx.arc(mx, my, 8, 0, Math.PI * 2);
          ctx.fill();
        } else if (progress >= 0.8 && progress < 0.85) {
          createExplosion(rx, ry);
        }

        // Draw particles
        particles.forEach((p, i) => {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fillRect(p.x, p.y, 4, 4);
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.02;
          if (p.life <= 0) particles.splice(i, 1);
        });
        ctx.globalAlpha = 1;
      }

      frameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [isOpen, status]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`relative w-full max-w-lg bg-[#140A2E] border-4 border-[#1B123D] shadow-[12px_12px_0_0_#000] overflow-hidden transition-all duration-500 transform ${showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-4 border-[#1B123D] bg-[#09061B]">
          <span className="font-pixel text-[8px] text-muted-foreground uppercase tracking-widest">System Notification</span>
          <button 
            onClick={onClose}
            className="text-white hover:text-neon-pink transition-colors p-1"
            aria-label="Close notification"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Animation Canvas Layer */}
        <div className="relative h-64 w-full bg-[#09061B] overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
            {status === "SENDING" ? (
              <div className="flex flex-col items-center gap-4">
                <Rocket className="w-12 h-12 text-neon-purple animate-bounce" />
                <h2 id="modal-title" className="font-pixel text-xl text-white uppercase">Initializing Launch...</h2>
              </div>
            ) : status === "SUCCESS" ? (
              <div className="animate-in zoom-in fade-in delay-500 duration-500 fill-mode-both">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 id="modal-title" className="font-pixel text-xl text-white uppercase mb-2">Uplink Established!</h2>
                <p className="font-body text-sm text-muted">Your message has cleared the atmosphere.</p>
              </div>
            ) : (
              <div className="animate-in zoom-in fade-in delay-700 duration-500 fill-mode-both">
                <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                <h2 id="modal-title" className="font-pixel text-xl text-white uppercase mb-2">Transmission Lost</h2>
                <p className="font-body text-sm text-muted px-4">{error || "An anomaly interrupted the signal."}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#140A2E] flex justify-center">
          <PixelButton variant={status === "ERROR" ? "secondary" : "primary"} onClick={onClose}>
            {status === "SUCCESS" ? "RETURN TO BASE" : "CLOSE TERMINAL"}
          </PixelButton>
        </div>

        {/* Decorative corner pixels */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-neon-purple/20" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-neon-purple/20" />
      </div>
    </div>
  );
};
