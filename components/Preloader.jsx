"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// The one orchestrated moment on load: logo fades in over deep plum,
// a gold hairline draws, then the curtain lifts. Plays once per session.
export default function Preloader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('sb_intro') === '1'; } catch (e) {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setShow(true);
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => {
      setShow(false);
      document.documentElement.style.overflow = '';
      try { sessionStorage.setItem('sb_intro', '1'); } catch (e) {}
    }, 2600);

    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] bg-[#0E0612] flex flex-col items-center justify-center"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-48 h-20 md:w-64 md:h-24"
          >
            <Image src="/simpblisslogoji.png" alt="" fill className="object-contain" priority />
          </motion.div>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="block w-40 md:w-56 h-px mt-8 origin-center bg-gradient-to-r from-transparent via-[#C8A97E] to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
