"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { shopifyFetch } from '../../../lib/shopify';

const luxuryEase = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: luxuryEase } }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const LOGIN_MUTATION = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const { body } = await shopifyFetch({
        query: LOGIN_MUTATION,
        variables: { input: { email, password } }
      });

      const response = body?.data?.customerAccessTokenCreate;
      const errors = response?.customerUserErrors;

      if (errors && errors.length > 0) {
        setError(errors[0].message);
      } else if (response?.customerAccessToken?.accessToken) {
        setSuccess(true);
        localStorage.setItem('simpbliss_customer_token', response.customerAccessToken.accessToken);
        setTimeout(() => {
          window.location.href = '/account';
        }, 1500);
      } else {
        setError("Invalid credentials or server response.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9FA] min-h-screen text-[#15091C] pt-[160px] md:pt-[200px] pb-32 flex flex-col justify-center selection:bg-[#C8A97E] selection:text-white relative overflow-hidden">
      
      {/* Background ambient accents */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#ffffff] to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[40vw] h-[60vh] bg-[#C8A97E]/[0.03] blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md mx-auto px-6 w-full relative z-10">
        
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div 
              key="login-form"
              initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.98 }} variants={fadeUp} 
              className="bg-white p-10 md:p-14 rounded-sm shadow-[0_20px_60px_rgba(21,9,28,0.03)] border border-[#15091C]/5"
            >
              <div className="text-center mb-12">
                <span className="text-[#C8A97E] text-[9px] uppercase tracking-[0.5em] mb-4 block font-medium">
                  Client Portal
                </span>
                <h1 className="text-4xl md:text-5xl font-serif italic text-[#15091C] tracking-tight">
                  Welcome Back
                </h1>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-8">
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-50/50 border border-red-200/50 text-red-800 text-[11px] uppercase tracking-[0.2em] font-medium text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-3">
                  <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'email' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>
                    Electronic Mail
                  </label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Enter your email address"
                    className="bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none placeholder:text-[#15091C]/30"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <label className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors duration-300 ${focusedInput === 'password' ? 'text-[#C8A97E]' : 'text-[#15091C]/70'}`}>
                      Password
                    </label>
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Enter your password"
                    className="bg-transparent border-b border-[#15091C]/20 py-3 text-sm font-light outline-none focus:border-[#C8A97E] transition-colors rounded-none placeholder:text-[#15091C]/30"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#15091C] text-white text-[10px] uppercase tracking-[0.4em] font-medium py-5 hover:bg-[#C8A97E] transition-all duration-500 shadow-[0_10px_30px_rgba(21,9,28,0.1)] hover:shadow-[0_15px_40px_rgba(200,169,126,0.2)] w-full mt-4 flex items-center justify-center gap-4 group disabled:opacity-70"
                >
                  {loading ? "Authenticating..." : "Sign In"}
                  {!loading && <span className="text-[#C8A97E] group-hover:translate-x-2 transition-transform duration-500">→</span>}
                </button>

                <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.2em] text-[#15091C]/60 pt-6 mt-2 border-t border-[#15091C]/10">
                  <span>New client?</span>
                  <Link href="/account/register" className="text-[#15091C] font-medium hover:text-[#C8A97E] transition-colors">
                    Create Sanctuary Account
                  </Link>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="login-success"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: luxuryEase }}
              className="bg-white p-16 rounded-sm shadow-[0_20px_60px_rgba(21,9,28,0.03)] border border-[#15091C]/5 text-center flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="w-16 h-16 rounded-full bg-[#C8A97E]/10 flex items-center justify-center mb-8 text-[#C8A97E] text-xl border border-[#C8A97E]/20">
                ✓
              </div>
              <h3 className="text-3xl font-serif italic text-[#15091C] mb-4">Access Granted</h3>
              <p className="text-xs font-light tracking-wide text-[#15091C]/60">Redirecting to your sanctuary...</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}