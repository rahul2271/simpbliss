"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const luxuryEase = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: luxuryEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

export default function BulkOrdersPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'India',
    companyName: '',
    orderQuantity: '',
    purpose: 'Resale',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate high-end submission for bulk inquiry
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="bg-[#FCFBFC] min-h-screen text-[#15091C] pt-[140px] md:pt-[180px] pb-32 selection:bg-[#C8A97E] selection:text-white relative overflow-hidden">
      
      {/* Background ambient accents */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#FAF9FA] to-transparent pointer-events-none"></div>
      <div className="absolute top-60 right-0 w-[40vw] h-[60vh] bg-[#C8A97E]/[0.02] blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-[#C8A97E]/30"></span>
            <span className="text-[#C8A97E] text-[9px] md:text-[11px] uppercase tracking-[0.5em] font-medium">
              Institutional & Wholesale
            </span>
            <span className="w-12 h-[1px] bg-[#C8A97E]/30"></span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[5rem] font-serif italic tracking-tight text-[#15091C] mb-8 leading-[1.1]">
            Bulk Requisitions
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm md:text-base font-light text-[#15091C]/60 tracking-wide leading-[1.9] max-w-2xl mx-auto">
            Partner with SIMPBLISS for corporate gifting, private label distribution, or wholesale boutique curation of our alcohol-free luxury perfume oils.
          </motion.p>
        </motion.div>

        {/* Form Container */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="bg-white p-8 md:p-16 lg:p-20 rounded-sm shadow-[0_20px_60px_rgba(21,9,28,0.03)] border border-[#15091C]/5"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: luxuryEase }}
                className="py-24 text-center flex flex-col items-center justify-center min-h-[500px]"
              >
                <div className="w-16 h-16 rounded-full bg-[#C8A97E]/10 flex items-center justify-center mb-8 text-[#C8A97E] text-xl border border-[#C8A97E]/20">
                  ✓
                </div>
                <h3 className="text-4xl font-serif italic text-[#15091C] mb-4">Requisition Transmitted</h3>
                <p className="text-sm font-light text-[#15091C]/60 tracking-wider max-w-md mx-auto leading-[1.8] mb-10">
                  Thank you for your wholesale request. Our corporate partnership concierge will review your requirements and reach out within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="group flex items-center gap-4 text-[9px] uppercase tracking-[0.4em] font-medium text-[#15091C] transition-colors"
                >
                  <span className="w-8 h-[1px] bg-[#15091C] group-hover:w-12 transition-all duration-500"></span>
                  <span className="group-hover:text-[#C8A97E] transition-colors duration-500">Submit Another Requisition</span>
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8, ease: luxuryEase }}
                onSubmit={handleSubmit} className="flex flex-col gap-10"
              >
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  <div className="flex flex-col gap-3">
                    <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'name' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>
                      Primary Contact Name
                    </label>
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
                    <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'email' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>
                      Electronic Mail
                    </label>
                    <input 
                      type="email" 
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="rahul@rctechsolutions.com"
                      className="bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none placeholder:text-[#15091C]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  <div className="flex flex-col gap-3">
                    <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'phone' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>
                      Telephone
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState({...formState, phone: e.target.value})}
                      onFocus={() => setFocusedInput('phone')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="+91 98888 88888"
                      className="bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none placeholder:text-[#15091C]/30"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'country' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>
                      Operating Country
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formState.country}
                      onChange={(e) => setFormState({...formState, country: e.target.value})}
                      onFocus={() => setFocusedInput('country')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="India"
                      className="bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none placeholder:text-[#15091C]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  <div className="flex flex-col gap-3">
                    <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'companyName' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>
                      Entity / Company Name
                    </label>
                    <input 
                      type="text" 
                      value={formState.companyName}
                      onChange={(e) => setFormState({...formState, companyName: e.target.value})}
                      onFocus={() => setFocusedInput('companyName')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="RC Tech Solutions"
                      className="bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none placeholder:text-[#15091C]/30"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'orderQuantity' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>
                      Estimated Volume
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formState.orderQuantity}
                      onChange={(e) => setFormState({...formState, orderQuantity: e.target.value})}
                      onFocus={() => setFocusedInput('orderQuantity')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="e.g. 500 units"
                      className="bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none placeholder:text-[#15091C]/30"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'purpose' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>
                    Primary Purpose
                  </label>
                  <div className="relative">
                    <select 
                      value={formState.purpose}
                      onChange={(e) => setFormState({...formState, purpose: e.target.value})}
                      onFocus={() => setFocusedInput('purpose')}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none cursor-pointer appearance-none"
                    >
                      <option value="Resale">Resale / Boutique Distribution</option>
                      <option value="Corporate Gifting">Corporate Gifting</option>
                      <option value="Private Label">Private Label / Custom Batch</option>
                      <option value="Other">Other Purpose</option>
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] text-[#15091C]/50 pointer-events-none">▼</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'message' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>
                    Additional Details
                  </label>
                  <textarea 
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    onFocus={() => setFocusedInput('message')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Share details regarding your timeline, specific fragrance profiles, or custom volume requirements..."
                    className="bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none resize-none placeholder:text-[#15091C]/30"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#15091C] text-white text-[10px] uppercase tracking-[0.4em] font-medium py-5 hover:bg-[#C8A97E] transition-all duration-500 shadow-[0_10px_30px_rgba(21,9,28,0.1)] hover:shadow-[0_15px_40px_rgba(200,169,126,0.2)] w-full mt-6 flex items-center justify-center gap-4 group disabled:opacity-70"
                >
                  {loading ? "Transmitting..." : "Submit Requisition"}
                  {!loading && <span className="text-[#C8A97E] group-hover:translate-x-2 transition-transform duration-500">→</span>}
                </button>

              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}