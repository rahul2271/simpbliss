"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { usePathname } from 'next/navigation';

const luxuryEase = [0.25, 1, 0.5, 1];

export default function NavbarClient({ menuItems }) {
  const { openCart, cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);
  const [mobileExpandedItem, setMobileExpandedItem] = useState(null);
  const [mobileExpandedSubItem, setMobileExpandedSubItem] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.__lenis) { window.__lenis.scrollTo(0, { immediate: true }); }
    else { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
  }, [pathname]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.__lenis?.stop();
    } else {
      document.body.style.overflow = 'unset';
      window.__lenis?.start();
    }
    return () => { document.body.style.overflow = 'unset'; window.__lenis?.start(); };
  }, [mobileMenuOpen]);

  const getPath = (url) => {
    if (!url) return '#';
    try {
      const { pathname } = new URL(url);
      return pathname;
    } catch (e) {
      return url.startsWith('/') ? url : `/${url}`;
    }
  };

  const isHomePage = pathname === '/';
  const isLightBg = isHomePage && scrolled; 

  let navBgClass = 'bg-[#15091C]/95 backdrop-blur-2xl border-b border-[#C8A97E]/15'; 
  if (isHomePage) {
    navBgClass = scrolled 
      ? 'bg-[#F9F7FA]/85 backdrop-blur-2xl border-b border-[#C8A97E]/20' 
      : 'bg-gradient-to-b from-[#15091C]/80 via-[#15091C]/20 to-transparent';
  }

  const textColorClass = isLightBg ? 'text-[#15091C]' : 'text-white/90';
  const hoverColorClass = 'hover:text-[#C8A97E]';
  const logoFilterClass = isLightBg ? 'brightness-0' : '';
  const hamburgerBgClass = isLightBg ? 'bg-[#15091C]' : 'bg-white';

  return (
    <>
      <header className={`fixed w-full top-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${navBgClass}`}>
        
        <div className={`w-full bg-[#15091C] text-[#C8A97E] text-[9px] uppercase tracking-[0.3em] text-center font-light transition-all duration-500 overflow-hidden flex items-center justify-center ${
          scrolled ? 'h-0 opacity-0' : 'h-10 opacity-100 hidden md:flex'
        }`}>
          Complimentary Shipping on Orders Above ₹1000
        </div>

        <nav className={`transition-all duration-700 w-full ${scrolled ? 'py-4' : 'py-4 md:py-6'}`}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between w-full">
            
            <div className="flex-none w-32 md:w-48 flex justify-start items-center">
              <Link href="/" className="relative h-12 w-full md:h-16 block group" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/simpblisslogoji.png"
                  alt="SIMPBLISS Natural Perfume Oils"
                  fill
                  sizes="(max-width: 768px) 144px, 192px"
                  className={`object-contain object-left transition-all duration-700 opacity-90 group-hover:opacity-100 ${logoFilterClass}`}
                  priority
                />
              </Link>
            </div>

            {/* DESKTOP CENTER: Main Menu with Multi-level Dropdowns */}
            <div className={`hidden lg:flex flex-auto justify-center gap-x-6 xl:gap-x-8 text-[10px] tracking-[0.24em] uppercase font-sans font-light whitespace-nowrap flex-nowrap transition-colors duration-500 px-4 ${textColorClass}`}>
              {menuItems.map((item) => {
                const hasChildren = item.items && item.items.length > 0;
                
                return (
                  <div 
                    key={item.id} 
                    className="relative py-2 group cursor-pointer"
                    onMouseEnter={() => {
                      if (hasChildren) setActiveDropdown(item.id);
                    }}
                    onMouseLeave={() => {
                      if (hasChildren) {
                        setActiveDropdown(null);
                        setActiveSubDropdown(null);
                      }
                    }}
                  >
                    <Link href={getPath(item.url)} className="flex items-center gap-1.5">
                      <span className={`${hoverColorClass} transition-colors duration-500`}>{item.title}</span>
                      {hasChildren && (
                        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" stroke="currentColor" strokeWidth="0.8" className="opacity-60 group-hover:rotate-180 transition-transform duration-500"><path d="M.5.5 4 4 7.5.5"/></svg>
                      )}
                    </Link>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C8A97E] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"></span>

                    {/* First-Level Desktop Dropdown */}
                    {hasChildren && activeDropdown === item.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: luxuryEase }}
                        className="absolute top-full left-0 pt-2 w-64 z-50"
                      >
                        <div className="bg-[#15091C]/95 border border-[#C8A97E]/20 shadow-[0_30px_80px_rgba(0,0,0,0.45)] py-4 px-5 flex flex-col gap-1 backdrop-blur-xl">
                          {item.items.map((subItem) => {
                            const hasSubChildren = subItem.items && subItem.items.length > 0;

                            return (
                              <div 
                                key={subItem.id} 
                                className="relative group/sub"
                                onMouseEnter={() => hasSubChildren && setActiveSubDropdown(subItem.id)}
                                onMouseLeave={() => hasSubChildren && setActiveSubDropdown(null)}
                              >
                                <Link 
                                  href={getPath(subItem.url)}
                                  className="flex justify-between items-center text-[9px] uppercase tracking-[0.2em] text-white/70 hover:text-[#C8A97E] transition-colors py-2 px-2 hover:bg-white/5"
                                >
                                  <span>{subItem.title}</span>
                                  {hasSubChildren && <svg width="5" height="8" viewBox="0 0 5 8" fill="none" stroke="currentColor" strokeWidth="0.8"><path d=".5.5 4 4 .5 7.5"/></svg>}
                                </Link>

                                {/* Second-Level (Sub-Sub) Desktop Dropdown */}
                                {hasSubChildren && activeSubDropdown === subItem.id && (
                                  <div className="absolute top-0 left-full pl-2 w-64 z-50">
                                    <div className="bg-[#15091C]/95 border border-[#C8A97E]/20 shadow-[0_30px_80px_rgba(0,0,0,0.45)] py-4 px-5 flex flex-col gap-1 backdrop-blur-xl">
                                      {subItem.items.map((subSubItem) => (
                                        <Link
                                          key={subSubItem.id}
                                          href={getPath(subSubItem.url)}
                                          className="text-[9px] uppercase tracking-[0.2em] text-white/70 hover:text-[#C8A97E] transition-colors py-2 px-2 hover:bg-white/5"
                                        >
                                          {subSubItem.title}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className={`hidden lg:flex flex-none w-56 justify-end gap-8 text-[10px] tracking-[0.24em] uppercase font-sans font-light items-center transition-colors duration-500 ${textColorClass}`}>
              <Link href="/account" className="group relative py-2">
                <span className={`${hoverColorClass} transition-colors duration-500`}>Account</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C8A97E] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"></span>
              </Link>
              <Link href="/search" className="group relative py-2">
                <span className={`${hoverColorClass} transition-colors duration-500`}>Search</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C8A97E] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"></span>
              </Link>
              
              <button onClick={openCart} className="flex items-center gap-1.5 group py-2">
                <span className={`group-hover:text-[#C8A97E] transition-colors duration-500`}>Cart</span>
                <span className="font-light group-hover:text-[#C8A97E] transition-colors duration-500">({cartCount})</span>
              </button>
            </div>

            <div className={`lg:hidden flex flex-1 justify-end items-center gap-5 ${textColorClass}`}>
              <button onClick={openCart} className="text-[9px] tracking-[0.2em] uppercase font-medium flex items-center gap-1">
                Cart <span className="font-light text-[#C8A97E]">({cartCount})</span>
              </button>

              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-1 focus:outline-none flex flex-col justify-center items-end w-8 h-8 relative group"
                aria-label="Open Menu"
              >
                <span className={`block w-6 h-[1px] transition-all duration-300 mb-1.5 group-hover:w-8 group-hover:bg-[#C8A97E] ${hamburgerBgClass}`}></span>
                <span className={`block w-4 h-[1px] transition-all duration-300 group-hover:w-6 group-hover:bg-[#C8A97E] ${hamburgerBgClass}`}></span>
              </button>
            </div>

          </div>
        </nav>
      </header>

      {/* FULL-SCREEN MOBILE MENU WITH MULTI-LEVEL ACCORDION SUPPORT */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.8, ease: luxuryEase }}
            className="fixed inset-0 w-full h-[100dvh] bg-[#15091C] z-[100] flex flex-col px-6 pt-8 pb-12 overflow-y-auto"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[#C8A97E]/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="flex justify-between items-center relative z-10 w-full mb-8 shrink-0">
              <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-[#C8A97E]/70">
                Menu
              </span>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 -mr-2 flex items-center justify-center group"
              >
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <span className="absolute w-6 h-[1px] bg-white/80 rotate-45 group-hover:bg-[#C8A97E] transition-colors duration-500"></span>
                  <span className="absolute w-6 h-[1px] bg-white/80 -rotate-45 group-hover:bg-[#C8A97E] transition-colors duration-500"></span>
                </div>
              </button>
            </div>

            <div className="flex flex-col gap-4 relative z-10 mt-2 px-2 shrink-0">
              {menuItems.map((item, i) => {
                const hasChildren = item.items && item.items.length > 0;
                const isExpanded = mobileExpandedItem === item.id;

                return (
                  <div key={item.id} className="border-b border-white/5 pb-3">
                    <div className="flex justify-between items-center w-full">
                      {hasChildren ? (
                        // If it has children, clicking the whole word toggles the accordion
                        <button 
                          onClick={() => setMobileExpandedItem(isExpanded ? null : item.id)}
                          className="flex items-baseline gap-4 group w-full py-1 text-left flex-1"
                        >
                          <span className="text-[2.25rem] sm:text-[3.25rem] font-serif font-light text-white/90 group-hover:text-[#C8A97E] transition-colors duration-500 tracking-tight leading-none">
                            {item.title}
                          </span>
                        </button>
                      ) : (
                        // If no children, it works as a normal link that closes the menu
                        <Link 
                          href={getPath(item.url)} 
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-baseline gap-4 group w-full py-1 text-left flex-1"
                        >
                          <span className="text-[2.25rem] sm:text-[3.25rem] font-serif font-light text-white/90 group-hover:text-[#C8A97E] transition-colors duration-500 tracking-tight leading-none">
                            {item.title}
                          </span>
                        </Link>
                      )}

                      {/* We keep the +/- indicator for visual clarity, and it also toggles */}
                      {hasChildren && (
                        <button 
                          onClick={() => setMobileExpandedItem(isExpanded ? null : item.id)}
                          className="text-[#C8A97E] text-xs px-4 py-2 uppercase tracking-widest font-medium shrink-0"
                        >
                          {isExpanded ? '−' : '+'}
                        </button>
                      )}
                    </div>

                    {/* Mobile Level 1 Submenu */}
                    {hasChildren && isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-3 pl-6 pt-3 pb-2 border-l border-[#C8A97E]/20 ml-3"
                      >
                        {item.items.map((subItem) => {
                          const hasSubChildren = subItem.items && subItem.items.length > 0;
                          const isSubExpanded = mobileExpandedSubItem === subItem.id;

                          return (
                            <div key={subItem.id} className="flex flex-col">
                              <div className="flex justify-between items-center py-1 w-full">
                                
                                {hasSubChildren ? (
                                  <button
                                    onClick={() => setMobileExpandedSubItem(isSubExpanded ? null : subItem.id)}
                                    className="text-[10px] uppercase tracking-[0.25em] text-white/70 hover:text-[#C8A97E] transition-colors text-left flex-1"
                                  >
                                    — {subItem.title}
                                  </button>
                                ) : (
                                  <Link
                                    href={getPath(subItem.url)}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-[10px] uppercase tracking-[0.25em] text-white/70 hover:text-[#C8A97E] transition-colors text-left flex-1"
                                  >
                                    — {subItem.title}
                                  </Link>
                                )}

                                {hasSubChildren && (
                                  <button
                                    onClick={() => setMobileExpandedSubItem(isSubExpanded ? null : subItem.id)}
                                    className="text-[#C8A97E] text-xs px-3 py-1 shrink-0"
                                  >
                                    {isSubExpanded ? '−' : '+'}
                                  </button>
                                )}
                              </div>

                              {/* Mobile Level 2 (Sub-Sub) Submenu */}
                              {hasSubChildren && isSubExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="flex flex-col gap-2 pl-6 pt-2 border-l border-white/10 ml-2"
                                >
                                  {subItem.items.map((subSubItem) => (
                                    <Link
                                      key={subSubItem.id}
                                      href={getPath(subSubItem.url)}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="text-[9px] uppercase tracking-[0.2em] text-white/50 hover:text-[#C8A97E] transition-colors py-1 w-full"
                                    >
                                      • {subSubItem.title}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5, duration: 0.8, ease: luxuryEase }}
              className="mt-12 mb-6 relative z-10 w-full px-2 shrink-0"
            >
              <div className="w-full h-[1px] bg-white/10 mb-8"></div>
              
              <div className="grid grid-cols-2 gap-y-8 gap-x-4 text-[9px] tracking-[0.3em] uppercase font-sans text-white/60 font-medium">
                <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C8A97E] transition-colors w-fit">Account</Link>
                <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C8A97E] transition-colors w-fit">Search</Link>
                
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(openCart, 500);
                  }} 
                  className="hover:text-[#C8A97E] transition-colors text-left flex gap-1.5 w-fit"
                >
                  Cart <span className="text-[#C8A97E]">({cartCount})</span>
                </button>
                
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C8A97E] transition-colors w-fit">Contact</Link>
              </div>
              
              <div className="mt-12 flex justify-between items-center text-[8px] text-white/30 uppercase tracking-[0.3em]">
                <span>© SIMPBLISS</span>
                <span>Essence of Nature</span>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
