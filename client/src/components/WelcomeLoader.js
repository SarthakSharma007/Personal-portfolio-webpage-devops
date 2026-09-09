import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import loaderVideo from '../assets/gradient-loader.webm';
import './WelcomeLoader.css';

// ══════════════════════════════════════════════════════
//  WELCOME LOADER — Dark violet-blue · WebM video center
//  Displays for 1 second then calls onComplete
// ══════════════════════════════════════════════════════
const WelcomeLoader = ({ onComplete }) => {
  const called  = useRef(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (!called.current) {
          called.current = true;
          if (onComplete) onComplete();
        }
      }, 500);
    }, 3500);
    return () => clearTimeout(exitTimer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="wl-wrap"
          key="wl"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Centered WebM video */}
          <div className="wl-center">
            <video
              className="wl-video"
              src={loaderVideo}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeLoader;
