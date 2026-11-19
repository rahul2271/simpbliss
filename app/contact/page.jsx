"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

const luxuryEase = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: luxuryEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FCFBFC] min-h-screen text-[#15091C] pt-[140px] md:pt-[180px] pb-32 selection:bg-[#C8A97E] selection:text-white overflow-hidden relative">
      
      {/* Background ambient accents */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#FAF9FA] to-transparent pointer-events-none"></div>
      <div className="absolute top-40 right-0 w-[40vw] h-[60vh] bg-[#C8A97E]/[0.02] blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-[#C8A97E]/30"></span>
            <span className="text-[#C8A97E] text-[9px] md:text-[11px] uppercase tracking-[0.5em] font-medium">
              Client Concierge
            </span>
            <span className="w-12 h-[1px] bg-[#C8A97E]/30"></span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[5rem] font-serif italic tracking-tight text-[#15091C] mb-8 leading-[1.1]">
            We are at your service.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm md:text-base font-light text-[#15091C]/60 tracking-wide leading-[1.9] max-w-2xl mx-auto">
            Whether you seek guidance on an olfactory chapter, require bespoke curation, or have inquiries regarding your ritual shipment, our concierge responds with absolute discretion.
          </motion.p>
        </motion.div>

        {/* Split Grid */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch bg-white rounded-sm shadow-[0_20px_60px_rgba(21,9,28,0.03)] border border-[#15091C]/5 overflow-hidden"
        >
          
          {/* Left: Contact Info & Hours */}
          <motion.div variants={fadeUp} className="lg:col-span-5 flex flex-col justify-between bg-[#15091C] text-white p-10 md:p-16 relative overflow-hidden">
            {/* Subtle background glow for dark section */}
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#C8A97E]/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="relative z-10">
              <span className="text-[#C8A97E] text-[9px] uppercase tracking-[0.4em] block mb-4 font-medium">Direct Channels</span>
              <h2 className="text-4xl font-serif italic text-white mb-6 tracking-tight">Inquiries & Care</h2>
              <p className="text-xs font-light text-white/60 leading-[2] max-w-sm mb-12">
                Our atelier in Delhi is open to assist you from Monday through Saturday, 10:00 AM to 7:00 PM IST.
              </p>

              <div className="space-y-10">
                <div className="group">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 block mb-2 transition-colors group-hover:text-white/60">Electronic Mail</span>
                  <a href="mailto:care@vedicnature.in" className="text-lg font-serif italic text-white hover:text-[#C8A97E] transition-colors inline-block relative">
                    care@vedicnature.in
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C8A97E] transition-all duration-500 group-hover:w-full"></span>
                  </a>
                </div>

                <div className="group">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 block mb-2 transition-colors group-hover:text-white/60">Telephone & WhatsApp</span>
                  <a href="tel:+919210303276" className="text-lg font-serif italic text-white hover:text-[#C8A97E] transition-colors inline-block relative">
                    +91 (0) 92103 03276
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C8A97E] transition-all duration-500 group-hover:w-full"></span>
                  </a>
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 block mb-2">Atelier Headquarters</span>
                  <p className="text-sm font-light text-white/80 leading-relaxed max-w-[250px]">
                    Mayur Vihar Phase 1,<br />Delhi, India
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 flex items-center gap-6 relative z-10">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Follow</span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/80 hover:text-[#C8A97E] transition-colors">Instagram</a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/80 hover:text-[#C8A97E] transition-colors">Pinterest</a>
            </div>
          </motion.div>

          {/* Right: The Form */}
          <motion.div variants={fadeUp} className="lg:col-span-7 p-10 md:p-16 lg:p-20 relative">
            {submitted ? (
              <div className="h-full min-h-[500px] text-center flex flex-col items-center justify-center animate-in fade-in duration-1000">
                <div className="w-16 h-16 rounded-full bg-[#C8A97E]/10 flex items-center justify-center mb-8 text-[#C8A97E] text-xl border border-[#C8A97E]/20">
                  ✓
                </div>
                <h3 className="text-4xl font-serif italic text-[#15091C] mb-4">Message Received</h3>
                <p className="text-sm font-light text-[#15091C]/60 tracking-wider max-w-md mx-auto leading-[1.8] mb-10">
                  Thank you for reaching out. A concierge from our atelier will review your transmission and respond within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="group flex items-center gap-4 text-[9px] uppercase tracking-[0.4em] font-medium text-[#15091C] transition-colors"
                >
                  <span className="w-8 h-[1px] bg-[#15091C] group-hover:w-12 transition-all duration-500"></span>
                  <span className="group-hover:text-[#C8A97E] transition-colors duration-500">Send Another Inquiry</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-10 h-full justify-center">
                <div>
                  <h3 className="text-3xl font-serif italic text-[#15091C] mb-3 tracking-tight">Send a Transmission</h3>
                  <p className="text-xs font-light text-[#15091C]/50 tracking-wide">Please complete the fields below with your request.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'name' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                      onFocus={() => setFocusedInput('name')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="Rahul Chauhan"
                      className="bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none placeholder:text-[#15091C]/30"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'email' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>Electronic Mail</label>
                    <input 
                      type="email" 
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="rahul@xyz.com"
                      className="bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none placeholder:text-[#15091C]/30"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'subject' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>Subject of Inquiry</label>
                  <div className="relative">
                    <select 
                      value={formState.subject}
                      onChange={(e) => setFormState({...formState, subject: e.target.value})}
                      onFocus={() => setFocusedInput('subject')}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none cursor-pointer appearance-none"
                    >
                      <option value="General Inquiry">General Olfactory Inquiry</option>
                      <option value="Bespoke Curation">Bespoke Curation & Gifting</option>
                      <option value="Order Tracking">Order & Shipment Assistance</option>
                      <option value="Wholesale / Partnership">Wholesale & Institutional Partnership</option>
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] text-[#15091C]/50 pointer-events-none">▼</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'message' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>Message</label>
                  <textarea 
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    onFocus={() => setFocusedInput('message')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Describe your request or fragrance preference..."
                    className="bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none resize-none placeholder:text-[#15091C]/30"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="bg-[#15091C] text-white text-[10px] uppercase tracking-[0.4em] font-medium py-5 hover:bg-[#C8A97E] transition-all duration-500 shadow-[0_10px_30px_rgba(21,9,28,0.1)] hover:shadow-[0_15px_40px_rgba(200,169,126,0.2)] w-full mt-6 flex items-center justify-center gap-4 group"
                >
                  Submit Transmission
                  <span className="text-[#C8A97E] group-hover:translate-x-2 transition-transform duration-500">→</span>
                </button>
              </form>
            )}
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
}