'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface AmbientGoldParticlesProps {
  count?: number;
  className?: string;
}

export const AmbientGoldParticles: React.FC<AmbientGoldParticlesProps> = ({
  count = 18,
  className = '',
}) => {
  // Generate random positions once on mount
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 19) % 100}%`,
      top: `${(i * 27) % 95}%`,
      size: (i % 3) + 2,
      duration: 5 + (i % 5) * 2,
      delay: (i % 4) * 1.2,
      opacity: 0.2 + (i % 4) * 0.15,
      driftX: ((i % 5) - 2) * 25,
      driftY: -40 - (i % 3) * 20,
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-tr from-gold-300 via-amber-200 to-yellow-100 shadow-[0_0_8px_rgba(212,175,55,0.8)]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            x: [0, p.driftX, 0],
            y: [0, p.driftY, 0],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.3],
            scale: [1, 1.4, 0.9],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

