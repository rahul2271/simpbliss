"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useCart } from '../context/CartContext';

// Ultra-smooth, slow ease for high-end luxury feel
const luxuryEase = [0.25, 1, 0.5, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] } }
};

const staggerLayout = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

// Parallax Image Component for Smooth Desktop Scrolling
const ParallaxImage = ({ src, alt, priority }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden bg-[#F4F3F5]">
      <motion.div style={{ y, scale }} className="absolute inset-0 w-full h-full">
        <Image src={src} alt={alt} fill className="object-cover mix-blend-multiply" priority={priority} />
      </motion.div>
      <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(21,9,28,0.03)] pointer-events-none"></div>
    </div>
  );
};

// Ultra-Minimalist Animated Accordion
const Accordion = ({ title, children, isOpen, onClick, idx }) => (
  <div className="border-b border-[#15091C]/10 overflow-hidden">
    <button onClick={onClick} className="w-full py-6 md:py-8 flex justify-between items-center text-left focus:outline-none group relative">
      <div className="flex items-center gap-4 md:gap-6">
        <span className="text-[11px] md:text-[12px] uppercase tracking-[0.3em] font-medium text-[#15091C]/90 group-hover:text-[#C8A97E] transition-colors duration-700">{title}</span>
      </div>
      <div className="relative w-4 h-4 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-700">
        <span className={`absolute w-full h-[1px] bg-[#15091C] transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'rotate-180 bg-[#C8A97E]' : 'rotate-0'}`}></span>
        <span className={`absolute w-full h-[1px] bg-[#15091C] transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'rotate-180 opacity-0' : 'rotate-90'}`}></span>
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.8, ease: luxuryEase }}>
          <div className="pb-8 md:pb-10 text-[13px] md:text-[14px] font-light text-[#15091C]/60 leading-[2] md:leading-[2.2] pr-4 md:pr-12">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// High-End Data Visualization for Scent Profile
const ScentMeter = ({ label, percentage }) => (
  <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8">
    <div className="flex justify-between items-end">
      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#15091C]/70 font-medium">{label}</span>
    </div>
    <div className="w-full h-[1px] bg-[#15091C]/10 relative overflow-hidden">
      <motion.div 
        initial={{ width: 0 }} 
        whileInView={{ width: `${percentage}%` }} 
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.3, ease: luxuryEase }}
        className="absolute top-0 left-0 h-full bg-[#C8A97E]"
      />
    </div>
  </div>
);

export default function SmoothProduct({ product }) {
  const { addToCart } = useCart();
  const [activeAccordion, setActiveAccordion] = useState('benefits');
  const [quantity, setQuantity] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Monitor scroll for mobile sticky buy button
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- DYNAMIC DATA EXTRACTION ---
  const title = product?.title || "Luxury Scent";
  const currentPrice = parseFloat(product?.priceRange?.minVariantPrice?.amount || 0);
  const compareAtPrice = parseFloat(product?.compareAtPriceRange?.maxVariantPrice?.amount || 0);
  const isDiscounted = compareAtPrice > currentPrice;
  
  const variantNodes = product?.variants?.edges?.map(e => e.node) || product?.variants?.nodes || [];
  const variant = variantNodes.find(v => v.availableForSale !== false) || null;
  const soldOut = !variant;

  const images = product?.images?.edges?.map(e => ({
    url: e.node.url,
    alt: e.node.altText || title
  })) || [];

  const topNotes = product?.topNotes?.value || "Unspecified";
  const heartNotes = product?.heartNotes?.value || "Unspecified";
  const baseNotes = product?.baseNotes?.value || "Unspecified";
  const ingredients = product?.ingredients?.value || "100% Pure Botanical Extracts. Free from Alcohol & Synthetics.";
  const subtitle = product?.shortSubtitle?.value || "A distillation of a memory. Intensely concentrated, melting into the skin.";
  
  const keyBenefits = product?.keyBenefits?.value || "";
  const keyFeatures = product?.keyFeatures?.value || "";
  const howToUse = product?.howToUse?.value || "";

  // Helper function to beautifully render bulleted lists
  const renderList = (text) => {
    if (!text) return null;
    return (
      <ul className="space-y-4 md:space-y-5 pt-2">
        {text.split('\n').map((line, i) => {
          const cleanLine = line.replace(/^-/, '').trim();
          if (!cleanLine) return null;
          return (
            <li key={i} className="flex items-start gap-4 md:gap-5 text-[13px] md:text-[14px] font-light text-[#15091C]/70 leading-relaxed group">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 rotate-45 bg-[#C8A97E]/50 group-hover:bg-[#C8A97E] mt-2 flex-shrink-0 transition-colors duration-700"></div>
              <span>{cleanLine}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-[#F9F7FA] min-h-screen text-[#15091C] font-sans selection:bg-[#C8A97E] selection:text-white relative">
      
      {/* 
        PREMIUM HEADER SOLUTION:
        Instead of a solid black block that clashes with a white page, we use a sophisticated, 
        glassmorphism-inspired dark fade that specifically protects the navbar text while 
        blending beautifully into the white page below.
      */}
      <div className="absolute top-0 left-0 w-full h-[140px] md:h-[180px] bg-gradient-to-b from-[#15091C]/95 via-[#15091C]/60 to-transparent pointer-events-none z-0 mix-blend-multiply"></div>

      {/* MOBILE TOP BREADCRUMB */}
      <div className="block lg:hidden absolute top-[70px] left-0 w-full px-6 py-4 z-10 border-b border-[#15091C]/5 bg-[#F9F7FA]/95 backdrop-blur-md">
        <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.3em] text-[#15091C]/50 font-medium">
          <Link href="/" className="hover:text-[#C8A97E] transition-colors">Home</Link>
          <span className="w-3 h-[1px] bg-[#15091C]/20"></span>
          <Link href="/collections/all" className="hover:text-[#C8A97E] transition-colors">Archive</Link>
          <span className="w-3 h-[1px] bg-[#15091C]/20"></span>
          <span className="text-[#C8A97E] truncate">{title}</span>
        </div>
      </div>

      {/* 1. EDITORIAL SPLIT HERO */}
      <section className="max-w-[1600px] mx-auto lg:px-12 relative z-10 pt-[115px] md:pt-[120px]">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-24">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="w-full lg:w-[50%] flex flex-col relative lg:pt-16 lg:pb-40">
            
            {/* MOBILE SWIPER (Enhanced UI) */}
            <div className="block lg:hidden w-full relative overflow-hidden bg-[#F4F3F5] shadow-sm">
              <div 
                className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full aspect-square"
                onScroll={(e) => {
                  const scrollLeft = e.target.scrollLeft;
                  const width = e.target.clientWidth;
                  setCurrentSlide(Math.round(scrollLeft / width));
                }}
              >
                {images.length > 0 ? (
                  images.map((img, idx) => (
                    <div key={idx} className="w-full flex-shrink-0 snap-center relative aspect-square">
                      <Image src={img.url} alt={img.alt} fill className="object-cover mix-blend-multiply" priority={idx === 0} />
                    </div>
                  ))
                ) : (
                  <div className="w-full flex-shrink-0 snap-center flex items-center justify-center text-xs uppercase tracking-widest text-[#15091C]/40">No Images Found</div>
                )}
              </div>
              
              {/* Refined Mobile Swiper Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-5 left-0 w-full flex justify-center gap-2.5 z-20">
                  {images.map((_, idx) => (
                    <div key={idx} className={`h-[2px] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${currentSlide === idx ? 'w-10 bg-[#15091C]' : 'w-4 bg-[#15091C]/20'}`}></div>
                  ))}
                </div>
              )}
            </div>

            {/* DESKTOP STACKING GALLERY */}
            <div className="hidden lg:flex flex-col">
              {images.length > 0 ? (
                images.map((img, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 40 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.5, ease: luxuryEase }}
                    className="relative w-full aspect-square lg:sticky lg:top-32 bg-[#F4F3F5] rounded-sm overflow-hidden shadow-[0_10px_40px_rgba(21,9,28,0.04)] mb-12 lg:mb-20 p-2 lg:p-6 group"
                  >
                    <ParallaxImage src={img.url} alt={img.alt} priority={idx === 0} />
                    <div className="absolute bottom-10 left-10 text-[9px] uppercase tracking-[0.4em] font-medium text-[#15091C]/60 z-20 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                      0{idx + 1} / 0{images.length}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="w-full aspect-square lg:sticky lg:top-32 bg-[#F4F3F5] flex items-center justify-center text-xs uppercase tracking-widest text-[#15091C]/40">No Images Found</div>
              )}
            </div>
          </div>

          {/* RIGHT: Typography-Driven Product Details */}
          <div className="w-full lg:w-[50%] flex flex-col justify-start px-6 lg:px-8 xl:px-12 pt-10 lg:pt-20 pb-32 relative">
            <motion.div initial="hidden" animate="visible" variants={staggerLayout} className="w-full max-w-lg mx-auto lg:mx-0">
              
              {/* DESKTOP Breadcrumbs */}
              <motion.div variants={fadeUp} className="hidden lg:flex items-center gap-4 text-[9px] uppercase tracking-[0.4em] text-[#15091C]/50 mb-14 font-medium">
                <Link href="/" className="hover:text-[#C8A97E] transition-colors duration-500">Home</Link>
                <span className="w-5 h-[1px] bg-[#15091C]/20"></span>
                <Link href="/collections/all" className="hover:text-[#C8A97E] transition-colors duration-500">Archive</Link>
                <span className="w-5 h-[1px] bg-[#15091C]/20"></span>
                <span className="text-[#C8A97E]">{title}</span>
              </motion.div>

              {/* Title & Subtitle */}
              <motion.div variants={fadeUp} className="mb-14 md:mb-16 relative">
                <div className="inline-flex items-center gap-3 border border-[#C8A97E]/30 px-5 py-2 mb-8 md:mb-10 rounded-full bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(200,169,126,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E] animate-pulse"></span>
                  <p className="text-[8px] md:text-[9px] font-medium text-[#15091C]/90 tracking-[0.3em] uppercase pt-0.5">Pure Perfume Oil</p>
                </div>
                
                {/* Refined, Highly-Legible Title Scaling */}
                <h1 className="text-[2.75rem] leading-[1.1] md:text-[3.5rem] lg:text-[4.5rem] lg:leading-[1.05] font-serif text-[#15091C] italic mb-8 md:mb-10 tracking-tight">{title}</h1>
                
                <p className="text-[14px] md:text-[15px] font-light text-[#15091C]/70 leading-[1.9] md:leading-[2] tracking-wide border-l-[2px] border-[#C8A97E]/50 pl-5 md:pl-6 ml-1 ">
                  "{subtitle}"
                </p>
              </motion.div>

              {/* Scent Profile Data Visualization */}
              <motion.div variants={fadeUp} className="mb-14 md:mb-16 bg-white p-8 md:p-12 border border-[#15091C]/5 shadow-[0_20px_60px_rgba(21,9,28,0.02)] rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A97E]/5 blur-3xl rounded-full group-hover:bg-[#C8A97E]/10 transition-colors duration-1000"></div>
                <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#15091C]/50 mb-8 md:mb-10 font-medium">Olfactory Profile</h3>
                <ScentMeter label="Intensity" percentage={85} />
                <ScentMeter label="Longevity" percentage={95} />
                <ScentMeter label="Sillage" percentage={70} />
              </motion.div>

              {/* Price & Magnetic Buy Block */}
              <motion.div variants={fadeUp} className="mb-14 md:mb-16">
                <div className="flex items-end gap-4 md:gap-6 mb-8 md:mb-10 border-b border-[#15091C]/5 pb-8 md:pb-10">
                  {isDiscounted && (
                    <span className="text-sm md:text-base font-sans text-[#15091C]/40 line-through tracking-[0.2em]">₹{compareAtPrice.toFixed(0)}</span>
                  )}
                  <span className="text-[2.5rem] md:text-5xl font-sans text-[#15091C]/90 font-light tracking-[0.1em] leading-none">₹{currentPrice.toFixed(0)}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between bg-white border border-[#15091C]/10 px-6 py-4 w-full sm:w-1/3 hover:border-[#C8A97E]/50 transition-colors duration-700 shadow-sm rounded-sm">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#15091C]/40 hover:text-[#C8A97E] text-lg p-2 transition-colors duration-500">-</button>
                    <span className="text-[14px] md:text-[15px] font-serif italic text-[#15091C]/80">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-[#15091C]/40 hover:text-[#C8A97E] text-lg p-2 transition-colors duration-500">+</button>
                  </div>
                  
                  {/* Luxury Add to Cart */}
                  <button 
                    disabled={soldOut}
                    onClick={() => variant && addToCart({
                      id: variant.id,
                      title: title,
                      price: currentPrice,
                      image: images[0]?.url || "/simpblisslogoji.png"
                    }, quantity)}
                    className="relative w-full sm:w-2/3 bg-[#15091C] text-white overflow-hidden group py-5 px-8 shadow-[0_15px_40px_rgba(21,9,28,0.15)] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 w-full h-full bg-[#C8A97E] translate-y-full group-hover:translate-y-0 transition-transform duration-[0.8s] ease-[cubic-bezier(0.25,1,0.5,1)]"></div>
                    <div className="relative z-10 flex justify-between items-center w-full group-hover:text-[#15091C] transition-colors duration-[0.8s]">
                      <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-medium">{soldOut ? 'Sold out' : 'Add to cart'}</span>
                      <span className="text-[10px] md:text-[11px] tracking-[0.2em] font-light opacity-70 group-hover:opacity-100 transition-opacity duration-700">— ₹{(currentPrice * quantity).toFixed(0)}</span>
                    </div>
                  </button>
                </div>
              </motion.div>

              {/* DYNAMIC EDITORIAL ACCORDIONS */}
              <motion.div variants={fadeUp} className="border-t border-[#15091C]/10 pt-4">
                
                {keyBenefits && (
                  <Accordion idx="1" title="Key Benefits" isOpen={activeAccordion === 'benefits'} onClick={() => setActiveAccordion(activeAccordion === 'benefits' ? '' : 'benefits')}>
                    {renderList(keyBenefits)}
                  </Accordion>
                )}

                {keyFeatures && (
                  <Accordion idx="2" title="Key Features" isOpen={activeAccordion === 'features'} onClick={() => setActiveAccordion(activeAccordion === 'features' ? '' : 'features')}>
                    {renderList(keyFeatures)}
                  </Accordion>
                )}

                {howToUse && (
                  <Accordion idx="3" title="How to Use" isOpen={activeAccordion === 'how_to_use'} onClick={() => setActiveAccordion(activeAccordion === 'how_to_use' ? '' : 'how_to_use')}>
                    {renderList(howToUse)}
                  </Accordion>
                )}

                {topNotes !== "Unspecified" && (
                  <Accordion idx="4" title="Olfactory Notes" isOpen={activeAccordion === 'notes'} onClick={() => setActiveAccordion(activeAccordion === 'notes' ? '' : 'notes')}>
                    <div className="grid grid-cols-[100px_1fr] gap-y-6 text-[13px] md:text-[14px] tracking-wide pt-2">
                      <span className="text-[#C8A97E] uppercase tracking-widest text-[10px] pt-1 font-medium">Top</span>
                      <span className="text-[#15091C]/70 leading-relaxed font-light">{topNotes}</span>
                      <span className="text-[#C8A97E] uppercase tracking-widest text-[10px] pt-1 font-medium">Heart</span>
                      <span className="text-[#15091C]/70 leading-relaxed font-light">{heartNotes}</span>
                      <span className="text-[#C8A97E] uppercase tracking-widest text-[10px] pt-1 font-medium">Base</span>
                      <span className="text-[#15091C]/70 leading-relaxed font-light">{baseNotes}</span>
                    </div>
                  </Accordion>
                )}
                
                <Accordion idx="5" title="Ingredients" isOpen={activeAccordion === 'ingredients'} onClick={() => setActiveAccordion(activeAccordion === 'ingredients' ? '' : 'ingredients')}>
                  <div className="leading-[2.2] md:leading-[2.4] text-[#15091C]/70 font-light whitespace-pre-wrap pt-2">
                    {ingredients}
                  </div>
                </Accordion>

              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MOBILE APP-LIKE STICKY CART BAR (Glassmorphism) */}
      <AnimatePresence>
        {scrolled && (
          <motion.div 
            initial={{ y: 120 }} animate={{ y: 0 }} exit={{ y: 120 }} transition={{ duration: 0.8, ease: luxuryEase }}
            className="fixed bottom-0 left-0 w-full z-50 lg:hidden bg-white/80 backdrop-blur-2xl border-t border-[#15091C]/5 p-5 pb-8 shadow-[0_-10px_50px_rgba(21,9,28,0.06)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[12px] md:text-[13px] font-serif italic text-[#15091C] leading-none mb-1.5 line-clamp-1">{title}</span>
                <span className="text-[14px] md:text-[15px] font-sans text-[#15091C]/80 font-light tracking-[0.1em]">₹{(currentPrice * quantity).toFixed(0)}</span>
              </div>
              <button 
                disabled={soldOut}
                onClick={() => variant && addToCart({
                  id: variant.id,
                  title: title,
                  price: currentPrice,
                  image: images[0]?.url || "/simpblisslogoji.png"
                }, quantity)}
                className="bg-[#15091C] text-white text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium py-4 px-6 active:scale-95 transition-all duration-300 w-[50%] md:w-[55%] rounded-sm shadow-xl disabled:opacity-50"
              >
                {soldOut ? 'Sold out' : 'Add to cart'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. THE OLFACTORY PYRAMID (Smooth Parallax Timeline) */}
      {topNotes !== "Unspecified" && (
        <section className="py-24 md:py-48 bg-[#15091C] text-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] md:h-[800px] bg-[#C8A97E]/5 blur-[200px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerLayout} className="text-center mb-24 md:mb-40">
              <motion.span variants={fadeUp} className="block text-[#C8A97E] text-[9px] md:text-[11px] uppercase tracking-[0.5em] mb-4 md:mb-6 font-medium opacity-80">Evolution on Skin</motion.span>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-[5rem] lg:text-[6rem] font-serif text-white italic tracking-tight leading-[1.1] md:leading-[1]">The Architecture</motion.h2>
            </motion.div>

            <div className="relative">
              <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#C8A97E]/30 to-transparent md:-translate-x-1/2"></div>
              
              <div className="space-y-20 md:space-y-40 relative">
                {[
                  { phase: "The Opening", notes: topNotes, time: "0 - 15 Minutes", desc: "The initial, fleeting impression that hooks the senses. Vibrant and immediate.", align: "right" },
                  { phase: "The Core", notes: heartNotes, time: "15 Min - 4 Hours", desc: "The true personality of the fragrance emerges as it warms with your pulse.", align: "left" },
                  { phase: "The Memory", notes: baseNotes, time: "4 - 12+ Hours", desc: "Deep, resinous notes that linger intimately on the skin, leaving a lasting trail.", align: "right" }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className={`flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-32 w-full ${item.align === 'left' ? 'md:flex-row-reverse text-left md:text-right' : 'text-left'}`}>
                    <div className="w-full md:w-1/2 pl-14 md:pl-0">
                      <span className="text-[9px] uppercase tracking-[0.4em] text-[#C8A97E]/80 block mb-4 md:mb-5 font-medium">{item.time}</span>
                      <h3 className="text-3xl md:text-5xl lg:text-[4rem] font-serif italic text-white mb-4 md:mb-6 tracking-tight leading-[1]">{item.phase}</h3>
                      <h4 className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-white/70 mb-4 md:mb-5 font-medium">{item.notes}</h4>
                      <p className="text-[13px] md:text-[14px] font-light text-white/50 tracking-wide max-w-sm md:mx-auto md:mr-0 leading-[1.8] md:leading-[1.9]">{item.desc}</p>
                    </div>
                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#C8A97E]/20 bg-[#15091C] flex items-center justify-center z-10 shadow-[0_0_50px_rgba(200,169,126,0.05)]">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#C8A97E] animate-pulse opacity-70"></div>
                    </div>
                    <div className="hidden md:block w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. THE RITUAL */}
      <section className="bg-[#F9F7FA] text-[#15091C] border-t border-[#15091C]/5">
        <div className="flex flex-col lg:flex-row min-h-[80vh] md:min-h-screen">
          <div className="w-full lg:w-1/2 relative min-h-[40vh] md:min-h-[50vh] lg:min-h-full overflow-hidden bg-[#15091C]">
            <Image src="/howtooapply.webp" alt="The Ritual" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-[10s] hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#FCFBFC]/30 lg:hidden"></div>
          </div>
          
          <div className="w-full lg:w-1/2 p-8 md:p-20 lg:p-28 flex flex-col justify-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerLayout} className="max-w-md mx-auto lg:mx-0">
              <motion.span variants={fadeUp} className="block text-[#C8A97E] text-[9px] md:text-[11px] uppercase tracking-[0.4em] mb-6 md:mb-8 font-medium">Application</motion.span>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl lg:text-[5.5rem] font-serif text-[#15091C] italic mb-14 md:mb-20 tracking-tight leading-[1]">The Art of the Oil</motion.h2>

              <div className="space-y-12 md:space-y-20">
                {[
                  { step: "01", title: "The Pulse", desc: "Swipe the glass applicator gently across your pulse points—inner wrists, nape of the neck, behind earlobes." },
                  { step: "02", title: "The Rest", desc: "Allow the oil to settle. Resist rubbing your wrists together, as this bruises the delicate top notes." },
                  { step: "03", title: "The Evolution", desc: "Unlike alcohol-based sprays, our oils require body warmth to bloom, revealing new dimensions hour after hour." }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex gap-6 md:gap-10 group">
                    <span className="font-serif text-4xl md:text-5xl md:text-6xl text-[#C8A97E]/20 italic group-hover:text-[#C8A97E]/60 transition-colors duration-1000">{item.step}</span>
                    <div className="border-l-[1px] border-[#15091C]/10 pl-5 md:pl-6 group-hover:border-[#C8A97E]/50 transition-colors duration-1000 py-1">
                      <h4 className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-medium text-[#15091C]/80 mb-2 md:mb-3">{item.title}</h4>
                      <p className="text-[12px] md:text-[14px] font-light text-[#15091C]/60 leading-[1.8] md:leading-[2] max-w-xs">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
