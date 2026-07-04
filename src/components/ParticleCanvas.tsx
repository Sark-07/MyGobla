// ══════════════════════════════════════════════════
// ONE WISH WILLOW — Particle Canvas Component
// ══════════════════════════════════════════════════

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { ParticleSystem } from '../lib/particles';

export interface ParticleCanvasRef {
  system: ParticleSystem | null;
}

export const ParticleCanvas = forwardRef<ParticleCanvasRef>((_props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<ParticleSystem | null>(null);

  useImperativeHandle(ref, () => ({
    get system() { return systemRef.current; },
  }));

  useEffect(() => {
    if (canvasRef.current && !systemRef.current) {
      systemRef.current = new ParticleSystem(canvasRef.current);
    }
    return () => {
      systemRef.current?.destroy();
      systemRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" />;
});

ParticleCanvas.displayName = 'ParticleCanvas';
