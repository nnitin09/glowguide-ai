import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export function AnimatedBackground() {
  const [particles, setParticles] = useState<any[]>([]);
  const [diamonds, setDiamonds] = useState<any[]>([]);

  useEffect(() => {
    // Generate 20 twinkling dots
    const dots = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 2.5 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
    setParticles(dots);

    // Generate 10 diamonds
    const gems = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 3,
    }));
    setDiamonds(gems);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#08030a]">
      {/* Aurora Waves */}
      <motion.div
        className="absolute top-[-20%] left-[-20%] w-[100vw] h-[100vw] rounded-[40%_60%_70%_50%] opacity-[0.12] blur-[100px]"
        style={{ background: 'radial-gradient(circle, #e8609a 0%, transparent 70%)' }}
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-[10%] right-[-30%] w-[120vw] h-[120vw] rounded-[60%_40%_50%_70%] opacity-[0.12] blur-[120px]"
        style={{ background: 'radial-gradient(circle, #f5a8c8 0%, transparent 60%)' }}
        animate={{ rotate: -360, scale: [1, 1.2, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-[-40%] left-[10%] w-[110vw] h-[110vw] rounded-[50%_70%_40%_60%] opacity-[0.12] blur-[110px]"
        style={{ background: 'radial-gradient(circle, #c0407a 0%, transparent 65%)' }}
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[10%] w-[90vw] h-[90vw] rounded-[70%_50%_60%_40%] opacity-[0.12] blur-[90px]"
        style={{ background: 'radial-gradient(circle, #f8d0a0 0%, transparent 70%)' }}
        animate={{ rotate: -360, scale: [1, 1.15, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating Orbs */}
      <motion.div className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] max-w-lg max-h-lg rounded-full bg-[#e8609a] opacity-20 blur-[80px]"
        animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] max-w-md max-h-md rounded-full bg-[#f5a8c8] opacity-20 blur-[80px]"
        animate={{ x: [0, -40, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-[30%] left-[40%] w-[35vw] h-[35vw] max-w-lg max-h-lg rounded-full bg-[#c0407a] opacity-20 blur-[80px]"
        animate={{ x: [0, 30, 0], y: [0, -50, 0], scale: [1, 1.15, 1] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-[10%] right-[40%] w-[25vw] h-[25vw] max-w-sm max-h-sm rounded-full bg-[#f8d0a0] opacity-15 blur-[60px]"
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.05, 1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute top-[10%] left-[10%] w-[20vw] h-[20vw] max-w-xs max-h-xs rounded-full bg-[#f5a8c8] opacity-15 blur-[60px]"
        animate={{ x: [0, 20, 0], y: [0, 60, 0], scale: [1, 1.1, 1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Expanding Ripple Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 2, 4].map((delay) => (
          <motion.div
            key={`ripple-${delay}`}
            className="absolute w-64 h-64 border-[1px] border-[#f5a8c8] rounded-full opacity-0"
            animate={{ scale: [1, 4], opacity: [0.15, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Horizontal Scanline */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e8609a] to-transparent opacity-[0.35]"
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Particles */}
      {particles.map(p => (
        <motion.div key={p.id}
          className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)]"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ opacity: [0, 1, 0], y: [0, -30] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Diamonds */}
      {diamonds.map(d => (
        <motion.div key={d.id}
          className="absolute w-1 h-1 bg-[#f5b8d4] shadow-[0_0_6px_rgba(245,184,212,0.8)]"
          style={{ left: `${d.x}%`, top: `${d.y}%`, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
          animate={{ opacity: [0, 0.8, 0], y: [0, -20], rotate: [0, 180] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}
