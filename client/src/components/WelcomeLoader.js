import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './WelcomeLoader.css';

// ══════════════════════════════════════════════════════
//  KATANA ANIME CANVAS  (performance-optimised)
// ══════════════════════════════════════════════════════
const KatanaCanvas = ({ onClash }) => {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const onClashRef = useRef(onClash);  // stable ref so effect doesn't reinstall
  onClashRef.current = onClash;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // ── scene state ──────────────────────────────────
    let t = 0;
    let sword1P = 0;   // 0→1 progress
    let sword2P = 0;
    let clashDone        = false;
    let speedLinesAlpha  = 0;
    let flashAlpha       = 0;
    let clashFired       = false;

    // Sparks
    const MAX_SPARKS = 80;
    const sparks = [];

    // Sakura petals (simple, no 5-lobe — performance)
    const PETAL_COUNT = 50;
    const petals = Array.from({ length: PETAL_COUNT }, () => ({
      x:   Math.random() * W,
      y:   Math.random() * H,
      r:   Math.random() * 5 + 3,
      rot: Math.random() * Math.PI * 2,
      rotV:(Math.random() - 0.5) * 0.05,
      vx:  Math.random() * 0.9 + 0.3,
      vy:  Math.random() * 1.0 + 0.5,
    }));

    // ── helpers ──────────────────────────────────────
    const lerp = (a, b, p) => a + (b - a) * p;

    const ease = (p) => p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;

    // ── Moon (drawn once-ish, very cheap) ────────────
    const drawMoon = () => {
      const mx = W * 0.5, my = H * 0.2;
      // soft halo — simple radial gradient, NO ctx.filter
      const halo = ctx.createRadialGradient(mx, my, 50, mx, my, 180);
      halo.addColorStop(0,   'rgba(255,240,200,0.22)');
      halo.addColorStop(0.5, 'rgba(255,220,150,0.06)');
      halo.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(mx, my, 180, 0, Math.PI * 2); ctx.fill();

      // Moon body
      const mg = ctx.createRadialGradient(mx - 18, my - 18, 8, mx, my, 68);
      mg.addColorStop(0,   '#fffde0');
      mg.addColorStop(0.7, '#f5e090');
      mg.addColorStop(1,   '#c8a050');
      ctx.fillStyle = mg;
      ctx.beginPath(); ctx.arc(mx, my, 68, 0, Math.PI * 2); ctx.fill();
    };

    // ── Sakura petals ─────────────────────────────────
    const drawPetals = () => {
      ctx.fillStyle = 'rgba(255,184,197,0.82)';
      petals.forEach(p => {
        p.x  += p.vx + Math.sin(t * 0.7 + p.y * 0.015) * 0.4;
        p.y  += p.vy;
        p.rot+= p.rotV;
        if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
        if (p.x > W + 20)  p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = 0.8;
        // simple ellipse — fast
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    // ── Draw a sword ──────────────────────────────────
    // tip at (tx,ty) pointing toward (bx,by)
    const drawSword = (tipX, tipY, baseX, baseY) => {
      const dx    = baseX - tipX;
      const dy    = baseY - tipY;
      const angle = Math.atan2(dy, dx);
      const len   = Math.sqrt(dx * dx + dy * dy);

      ctx.save();
      ctx.translate(tipX, tipY);
      ctx.rotate(angle);

      // Blade gradient
      const bg = ctx.createLinearGradient(0, -3, 0, 3);
      bg.addColorStop(0,   '#e8f4ff');
      bg.addColorStop(0.5, '#b0cce8');
      bg.addColorStop(1,   '#607898');
      ctx.fillStyle = bg;

      ctx.beginPath();
      ctx.moveTo(0, 0);              // tip
      ctx.lineTo(len * 0.88, -2);
      ctx.lineTo(len, 2);
      ctx.lineTo(len * 0.88, 3);
      ctx.closePath();
      ctx.fill();

      // Blood groove
      ctx.strokeStyle = 'rgba(140,180,220,0.55)';
      ctx.lineWidth   = 0.7;
      ctx.beginPath();
      ctx.moveTo(8, 0.5); ctx.lineTo(len * 0.78, 0.5); ctx.stroke();

      // Guard (tsuba)
      ctx.fillStyle = '#c89010';
      ctx.beginPath(); ctx.ellipse(len, 0, 7, 13, 0, 0, Math.PI * 2); ctx.fill();

      // Handle
      ctx.fillStyle = '#3a1a08';
      ctx.fillRect(len, -4, 58, 8);
      ctx.strokeStyle = '#7a5020'; ctx.lineWidth = 1.4;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(len + 5 + i * 7, -4);
        ctx.lineTo(len + 9 + i * 7,  4);
        ctx.stroke();
      }

      ctx.restore();
    };

    // ── Spawn sparks at clash ──────────────────────────
    const spawnSparks = (cx, cy) => {
      sparks.length = 0;
      for (let i = 0; i < MAX_SPARKS; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd   = Math.random() * 10 + 3;
        sparks.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 5,
          life: 1,
          decay: Math.random() * 0.03 + 0.018,
          size: Math.random() * 3 + 1,
          warm: Math.random() < 0.6,
        });
      }
    };

    // ── Draw sparks (no shadowBlur — perf) ────────────
    const drawSparks = () => {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy;
        s.vy += 0.28;
        s.vx *= 0.97;
        s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }

        const r = Math.max(0, s.size * s.life);
        ctx.globalAlpha = Math.max(0, s.life * 0.9);
        ctx.fillStyle   = s.warm ? '#ffe066' : '#ff8c00';
        ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill();

        // Streak
        ctx.strokeStyle = s.warm ? '#ffcc00' : '#ff6600';
        ctx.lineWidth   = Math.max(0.1, s.size * 0.4 * s.life);
        ctx.globalAlpha = s.life * 0.6;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 1.8, s.y - s.vy * 1.8);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    // ── Speed lines ────────────────────────────────────
    const drawSpeedLines = (cx, cy, alpha) => {
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const r0    = 60 + (i % 4) * 15;
        const r1    = Math.hypot(W, H);
        ctx.globalAlpha = alpha * ((i % 3 === 0) ? 0.45 : 0.2);
        ctx.lineWidth   = (i % 5 === 0) ? 1.5 : 0.7;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * r0, cy + Math.sin(angle) * r0);
        ctx.lineTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
        ctx.stroke();
      }
      ctx.restore();
    };

    // ── Main loop ──────────────────────────────────────
    let last = performance.now();

    const render = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t   += dt;

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0,   '#04010e');
      bg.addColorStop(0.5, '#090520');
      bg.addColorStop(1,   '#060318');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      drawMoon();
      drawPetals();

      // Clash center—midpoint of screen, at 55% height
      const cx = W * 0.5, cy = H * 0.55;

      // Sword 1 travels from top-left → clash centre
      const s1sx = -W * 0.08, s1sy = -H * 0.05;
      // Sword 2 travels from top-right → clash centre
      const s2sx = W * 1.08,  s2sy = -H * 0.05;

      if (!clashDone) {
        // Speed up approach — ease function
        sword1P = Math.min(1, sword1P + dt * 2.4);
        if (sword1P > 0.25) sword2P = Math.min(1, sword2P + dt * 2.4);

        const s1x = lerp(s1sx, cx, ease(sword1P));
        const s1y = lerp(s1sy, cy, ease(sword1P));
        drawSword(s1x, s1y, s1sx, s1sy);

        if (sword2P > 0) {
          const s2x = lerp(s2sx, cx, ease(sword2P));
          const s2y = lerp(s2sy, cy, ease(sword2P));
          drawSword(s2x, s2y, s2sx, s2sy);
        }

        if (sword1P >= 1 && sword2P >= 1 && !clashFired) {
          clashFired      = true;
          clashDone       = true;
          flashAlpha      = 1;
          speedLinesAlpha = 1;
          spawnSparks(cx, cy);
          onClashRef.current && onClashRef.current();
        }
      } else {
        // Keep swords locked at clash position
        drawSword(cx, cy, s1sx, s1sy);
        drawSword(cx, cy, s2sx, s2sy);
      }

      // Speed lines fade
      if (speedLinesAlpha > 0) {
        drawSpeedLines(cx, cy, speedLinesAlpha);
        speedLinesAlpha = Math.max(0, speedLinesAlpha - dt * 2.2);
      }

      drawSparks();

      // Screen flash
      if (flashAlpha > 0) {
        ctx.globalAlpha = flashAlpha * 0.75;
        ctx.fillStyle   = '#ffffff';
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
        flashAlpha = Math.max(0, flashAlpha - dt * 5.5);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []); // stable — never reinstalls

  return <canvas ref={canvasRef} className="katana-canvas" />;
};

// ══════════════════════════════════════════════════════
//  MAIN WELCOME LOADER
// ══════════════════════════════════════════════════════
const WelcomeLoader = ({ onComplete }) => {
  const [textStage, setTextStage] = useState(null);
  const clashHandled = useRef(false);

  // Called exactly ONCE when swords clash
  const handleClash = useCallback(() => {
    if (clashHandled.current) return;
    clashHandled.current = true;

    setTextStage('welcome');

    setTimeout(() => setTextStage('namaste'), 2200);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 4400);
  }, [onComplete]);

  // Safety fallback (if canvas somehow stalls)
  useEffect(() => {
    const fb = setTimeout(handleClash, 1600);
    return () => clearTimeout(fb);
  }, [handleClash]);

  const containerV = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
    exit:   { opacity: 0, y: -18, filter: 'blur(5px)', transition: { duration: 0.3 } },
  };
  const letterV = {
    hidden: { opacity: 0, y: 55, rotateX: -80 },
    show:   { opacity: 1, y: 0,  rotateX: 0,
              transition: { type: 'spring', damping: 14, stiffness: 110 } },
  };

  const WELCOME = "WELCOME".split('');
  const NAMASTE = "NAMASTE".split('');

  return (
    <div className="katana-loader">
      <KatanaCanvas onClash={handleClash} />

      <AnimatePresence mode="wait">
        {textStage === 'welcome' && (
          <motion.div key="w" className="katana-text-wrap"
            variants={containerV} initial="hidden" animate="show" exit="exit">
            <div className="katana-text-row">
              {WELCOME.map((c, i) => (
                <motion.span key={i} variants={letterV} className="katana-char">{c}</motion.span>
              ))}
            </div>
            <motion.div className="katana-jp"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.55 }}>
              ようこそ
            </motion.div>
          </motion.div>
        )}
        {textStage === 'namaste' && (
          <motion.div key="n" className="katana-text-wrap"
            variants={containerV} initial="hidden" animate="show" exit="exit">
            <div className="katana-text-row">
              {NAMASTE.map((c, i) => (
                <motion.span key={i} variants={letterV} className="katana-char">{c}</motion.span>
              ))}
            </div>
            <motion.div className="katana-jp"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.55 }}>
              ナマステ
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeLoader;
