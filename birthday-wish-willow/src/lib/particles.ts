// ══════════════════════════════════════════════════
// ONE WISH WILLOW — Canvas Particle System
// Embers, stars, sparks, golden dust
// ══════════════════════════════════════════════════

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  type: 'ember' | 'star' | 'spark' | 'dust';
  rotation: number;
  rotationSpeed: number;
}

const COLORS = {
  ember: ['#C41E3A', '#CC4400', '#8B2500', '#D4A853'],
  star: ['#D4A853', '#FFD700', '#B8860B', '#F1E7CF'],
  spark: ['#FFD700', '#FFA500', '#FF6347', '#D4A853'],
  dust: ['#D4A853', '#B8860B', '#8B6914', '#C9A84C'],
};

export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animId: number | null = null;
  private emitting = false;
  private emitType: Particle['type'] = 'star';
  private emitRate = 2;
  private emitArea: { x: number; y: number; w: number; h: number } | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private createParticle(type: Particle['type'], x?: number, y?: number): Particle {
    const colors = COLORS[type];
    const area = this.emitArea;
    return {
      x: x ?? (area ? area.x + Math.random() * area.w : Math.random() * this.canvas.width),
      y: y ?? (area ? area.y + Math.random() * area.h : this.canvas.height + 10),
      vx: (Math.random() - 0.5) * (type === 'spark' ? 3 : 0.8),
      vy: type === 'dust' ? -(Math.random() * 0.3 + 0.1) : -(Math.random() * 1.5 + 0.5),
      size: type === 'star' ? Math.random() * 3 + 1 : Math.random() * 4 + 2,
      life: 0,
      maxLife: type === 'spark' ? 40 + Math.random() * 30 : 80 + Math.random() * 120,
      color: colors[Math.floor(Math.random() * colors.length)],
      type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    };
  }

  private drawParticle(p: Particle): void {
    const progress = p.life / p.maxLife;
    const alpha = progress < 0.1 ? progress / 0.1 : progress > 0.7 ? (1 - progress) / 0.3 : 1;
    
    this.ctx.save();
    this.ctx.globalAlpha = alpha * 0.8;
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);

    if (p.type === 'star') {
      // 4-pointed star
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const outerR = p.size;
        const innerR = p.size * 0.3;
        this.ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
        this.ctx.lineTo(Math.cos(angle + Math.PI / 4) * innerR, Math.sin(angle + Math.PI / 4) * innerR);
      }
      this.ctx.closePath();
      this.ctx.fill();
      // Glow
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = p.size * 2;
      this.ctx.fill();
    } else if (p.type === 'ember') {
      // Glowing circle
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'transparent');
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (p.type === 'spark') {
      // Line spark
      this.ctx.strokeStyle = p.color;
      this.ctx.lineWidth = 1.5;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 4;
      this.ctx.beginPath();
      this.ctx.moveTo(-p.size, 0);
      this.ctx.lineTo(p.size, 0);
      this.ctx.stroke();
    } else {
      // Dust — tiny dot
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  private update(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Emit new particles
    if (this.emitting) {
      for (let i = 0; i < this.emitRate; i++) {
        if (Math.random() < 0.6) {
          this.particles.push(this.createParticle(this.emitType));
        }
      }
    }

    // Update and draw
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      
      // Slight wind
      p.vx += (Math.random() - 0.5) * 0.05;
      
      // Gravity for sparks
      if (p.type === 'spark') p.vy += 0.03;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      } else {
        this.drawParticle(p);
      }
    }

    this.animId = requestAnimationFrame(() => this.update());
  }

  /** Start emitting particles */
  start(type: Particle['type'] = 'star', rate = 2): void {
    this.emitType = type;
    this.emitRate = rate;
    this.emitting = true;
    if (!this.animId) this.update();
  }

  /** Stop emitting (existing particles fade out) */
  stop(): void {
    this.emitting = false;
  }

  /** Set emission area */
  setEmitArea(x: number, y: number, w: number, h: number): void {
    this.emitArea = { x, y, w, h };
  }

  /** Clear emission area (full screen) */
  clearEmitArea(): void {
    this.emitArea = null;
  }

  /** Burst a bunch of particles at once */
  burst(x: number, y: number, count: number, type: Particle['type'] = 'spark'): void {
    for (let i = 0; i < count; i++) {
      const p = this.createParticle(type, x, y);
      p.vx = (Math.random() - 0.5) * 6;
      p.vy = (Math.random() - 0.5) * 6 - 2;
      this.particles.push(p);
    }
    if (!this.animId) this.update();
  }

  /** Complete cleanup */
  destroy(): void {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.animId = null;
    this.particles = [];
    this.emitting = false;
  }
}
