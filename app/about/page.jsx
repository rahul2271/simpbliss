"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Premium fluid easing
const luxuryEase = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: luxuryEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
};

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="bg-[#FCFBFC] min-h-screen text-[#15091C] selection:bg-[#C8A97E] selection:text-white overflow-hidden">
      
      {/* 1. EDITORIAL HEADER & PARALLAX HERO INTEGRATED */}
      <section ref={heroRef} className="relative w-full h-[90vh] md:h-[110vh] bg-[#15091C] flex items-center justify-center overflow-hidden mb-24 md:mb-40">
        
        {/* Parallax Background Image */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
          <Image 
            src="/about4.webp" 
            alt="Botanical Extraction" 
            fill 
            sizes="100vw"
            className="object-cover mix-blend-screen opacity-40 md:opacity-60"
            priority
          />
          {/* Gradients to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#15091C]/80 via-[#15091C]/40 to-[#15091C]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(21,9,28,0.7)_100%)] pointer-events-none"></div>
        </motion.div>

        {/* Foreground Content */}
        <div className="relative z-10 text-center px-6 md:px-12 max-w-[1400px] mx-auto mt-20 md:mt-0">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.span variants={fadeUp} className="block text-[#C8A97E] text-[9px] md:text-[11px] uppercase tracking-[0.5em] mb-8 font-medium">
              The SIMPBLISS Story
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[7.5rem] font-serif italic tracking-tight leading-[1.05] text-white mb-10 max-w-5xl mx-auto">
              A return to absolute purity.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-sm md:text-base font-light tracking-wide text-white/80 max-w-2xl mx-auto leading-[2]">
              In a world of synthetic sprays and fleeting aromas, we chose the slower path. No alcohol, no compromises. Just the profound, enduring essence of nature, captured drop by drop.
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none"
        >
          <span className="text-[8px] uppercase tracking-[0.4em] text-white/50 font-medium">Discover</span>
          <div className="w-[1px] h-12 bg-white/20 overflow-hidden">
            <motion.div animate={{ y: [0, 48, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-full h-1/2 bg-[#C8A97E]" />
          </div>
        </motion.div>

      </section>

      {/* 3. THE MANIFESTO (Split Layout) */}
      <section className="py-20 md:py-32 max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="flex flex-col lg:flex-row gap-16 md:gap-24 items-start"
        >
          <div className="w-full lg:w-1/2 lg:sticky lg:top-40">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif italic text-[#15091C] leading-[1.3] tracking-tight mb-8">
              The modern fragrance industry relies on alcohol to project loudly. We rely on the skin to whisper.
            </motion.h2>
            <motion.div variants={fadeUp} className="w-16 h-[1px] bg-[#C8A97E]">
            </motion.div>
          </div>
          
          <div className="w-full lg:w-1/2 flex flex-col gap-12 text-sm md:text-[15px] font-light text-[#15091C]/70 leading-[2.2]">
            <motion.p variants={fadeUp}>
              SIMPBLISS was born out of a desire to reclaim the ancient Indian art of attar-making and bring it into the modern luxury space. For centuries, royalty anointed themselves with pure botanical oils—not just to smell pleasant, but to shift their emotional state.
            </motion.p>
            <motion.p variants={fadeUp}>
              By eliminating alcohol entirely, our perfumes do not evaporate into the air within an hour. Instead, they sink into your pores, melding with your unique body chemistry. The scent you wear becomes exclusively yours—a bespoke signature that evolves from dawn until dusk.
            </motion.p>
            <motion.p variants={fadeUp}>
              We source our ingredients meticulously: wild-harvested Oud from Assam, hydro-distilled Damask Roses from Kannauj, and earthy Vetiver from Mysore. Every bottle is a tribute to the earth it came from.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* 4. THE PROCESS (Dark Mode Immersion) */}
      <section className="bg-[#15091C] text-white py-32 md:py-48 relative overflow-hidden mt-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C8A97E]/5 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-24 md:mb-40">
            <motion.span variants={fadeUp} className="text-[#C8A97E] text-[9px] uppercase tracking-[0.4em] mb-6 block font-medium">Our Methodology</motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-serif italic tracking-tight">The Three Pillars</motion.h2>
          </motion.div>

          <div className="space-y-32 md:space-y-48 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-[#C8A97E]/30 before:to-transparent">
            {[
              {
                step: "01",
                title: "The Soil",
                subtitle: "Ethical & Indigenous Sourcing",
                desc: "We bypass commercial essence brokers, working directly with multi-generational farming families across India. We wait for the precise season to harvest, ensuring the botanicals are brimming with natural oils.",
                img: "/about1.webp"
              },
              {
                step: "02",
                title: "The Heat",
                subtitle: "Traditional Deg-Bhapka Distillation",
                desc: "Using the centuries-old hydro-distillation method, the botanicals are heated gently over wood fires in copper stills (Degs). The pure vapor travels through bamboo pipes into receivers (Bhapkas) resting in cold water, slowly turning into liquid gold.",
                img: "/about2.webp"
              },
              {
                step: "03",
                title: "The Time",
                subtitle: "Maturation & Blending",
                desc: "True luxury cannot be rushed. Our blends are aged in leather bottles (Kuppis) to evaporate excess moisture and allow the complex notes to marry perfectly. Only when the master blender decrees it ready, is it bottled for you.",
                img: "/about3.webp"
              }
            ].map((pillar, idx) => {
              const isEven = idx % 2 !== 0;
              return (
                <motion.div 
                  key={pillar.step}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                  className={`relative flex flex-col md:flex-row items-center gap-12 md:gap-24 ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-5 md:left-1/2 w-4 h-4 rounded-full bg-[#15091C] border-2 border-[#C8A97E] -translate-x-[7px] md:-translate-x-1/2 z-10 shadow-[0_0_20px_rgba(200,169,126,0.5)]"></div>

                  <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                    <motion.span variants={fadeUp} className="text-[12px] md:text-[14px] font-serif italic text-[#C8A97E] block mb-3 opacity-60">Phase {pillar.step}</motion.span>
                    <motion.h3 variants={fadeUp} className="text-3xl md:text-5xl font-serif text-white mb-3 tracking-tight">{pillar.title}</motion.h3>
                    <motion.h4 variants={fadeUp} className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium text-white/50 mb-6">{pillar.subtitle}</motion.h4>
                    <motion.p variants={fadeUp} className="text-[13px] md:text-[15px] font-light text-white/70 leading-[2.2] md:max-w-md inline-block">
                      {pillar.desc}
                    </motion.p>
                  </div>

                  <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-16' : 'md:pl-16'}`}>
                    <motion.div variants={fadeUp} className="relative w-full aspect-square md:aspect-[4/3] rounded-sm overflow-hidden bg-black/40">
                      <Image 
                        src={pillar.img} 
                        alt={pillar.title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-32 md:py-48 px-6 text-center bg-white border-b border-[#15091C]/5">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-3xl mx-auto">
          <motion.span variants={fadeUp} className="block text-[#C8A97E] text-[10px] uppercase tracking-[0.4em] mb-8 font-medium">
            The Invitation
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-serif italic text-[#15091C] mb-12 tracking-tight">
            Experience the distillation of luxury.
          </motion.h2>
          <motion.div variants={fadeUp}>
            <Link href="/collections/all" className="inline-block bg-[#15091C] text-white text-[10px] uppercase tracking-[0.4em] font-medium px-12 py-5 hover:bg-[#C8A97E] transition-colors duration-500 shadow-xl">
              Explore The Archive
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
