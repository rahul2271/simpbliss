"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const luxuryEase = [0.25, 1, 0.5, 1];

const questions = [
  {
    id: 1,
    subtitle: "Chapter I",
    question: "Where does your mind wander when seeking absolute tranquility?",
    options: [
      { label: "A dense, smoky Himalayan cedar forest at dawn", note: "Oud & Woody", handle: "oud-woody" },
      { label: "A sun-drenched courtyard filled with blooming Damask roses", note: "Floral & Botanical", handle: "floral-botanical" },
      { label: "A warm, spice-laden pavilion draped in rich silks", note: "Oriental & Gourmand", handle: "oriental-gourmand" },
      { label: "An untouched riverbank kissed by morning mist and wild musk", note: "Musk & Amber", handle: "musk-amber" }
    ]
  },
  {
    id: 2,
    subtitle: "Chapter II",
    question: "What emotional cadence do you wish to project to those closest to you?",
    options: [
      { label: "Magnetic, mysterious, and deeply grounding", note: "Oud & Woody", handle: "oud-woody" },
      { label: "Ethereal, romantic, and effortlessly graceful", note: "Floral & Botanical", handle: "floral-botanical" },
      { label: "Opulent, warm, and unapologetically sensual", note: "Oriental & Gourmand", handle: "oriental-gourmand" },
      { label: "Intimate, clean, and second-skin pure", note: "Musk & Amber", handle: "musk-amber" }
    ]
  },
  {
    id: 3,
    subtitle: "Chapter III",
    question: "At what hour of the day does your true spirit awaken?",
    options: [
      { label: "Midnight, beneath a canopy of stars and ancient smoke", note: "Oud & Woody", handle: "oud-woody" },
      { label: "The golden hour of late afternoon as shadows lengthen", note: "Floral & Botanical", handle: "floral-botanical" },
      { label: "Deep twilight during festive celebration and candlelit feasts", note: "Oriental & Gourmand", handle: "oriental-gourmand" },
      { label: "The absolute stillness of absolute dawn before the world wakes", note: "Musk & Amber", handle: "musk-amber" }
    ]
  }
];

export default function ScentFinderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState(null);

  const calculateResult = (finalAnswers) => {
    // Count frequencies of selected families
    const counts = finalAnswers.reduce((acc, curr) => {
      acc[curr.note] = (acc[curr.note] || 0) + 1;
      return acc;
    }, {});

    // Find the family with the highest count
    const topNote = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    
    // Find the corresponding handle to link them to the right collection
    const winningOption = questions[0].options.find(opt => opt.note === topNote);
    
    setResult({
      title: topNote,
      handle: winningOption.handle,
      description: `Based on your intuitive selections, your body chemistry harmonizes best with the profound depth of ${topNote}.`
    });
  };

  const handleSelect = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(newAnswers);
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers([]);
    setCompleted(false);
    setResult(null);
  };

  return (
    <div className="bg-[#15091C] min-h-screen text-white pt-[140px] md:pt-[180px] pb-32 selection:bg-[#C8A97E] selection:text-[#15091C] relative overflow-hidden flex flex-col justify-between">
      
      {/* Editorial Ambient Lighting - Matched to Brand Theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C8A97E]/5 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 w-full relative z-10 my-auto flex-grow flex flex-col justify-center">
        
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
              transition={{ duration: 1.2, ease: luxuryEase }}
              className="flex flex-col items-center text-center max-w-4xl mx-auto w-full"
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[1px] bg-[#C8A97E]/30"></span>
                <span className="text-[#C8A97E] text-[9px] md:text-[11px] uppercase tracking-[0.6em] font-medium">
                  {questions[currentStep].subtitle}
                </span>
                <span className="w-12 h-[1px] bg-[#C8A97E]/30"></span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-serif italic tracking-tight leading-[1.15] text-white mb-20 max-w-3xl">
                {questions[currentStep].question}
              </h1>

              <div className="flex flex-col w-full max-w-2xl gap-4">
                {questions[currentStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(option)}
                    className="group relative text-left py-6 px-8 border-b border-white/10 hover:border-[#C8A97E]/50 transition-all duration-700 flex flex-col justify-center overflow-hidden w-full bg-transparent hover:bg-white/[0.02]"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full relative z-10 gap-4">
                      <p className="font-serif text-xl md:text-2xl text-white/70 group-hover:text-white transition-colors duration-700 tracking-tight italic">
                        "{option.label}"
                      </p>
                      <span className="text-[8px] uppercase tracking-[0.4em] text-[#C8A97E] opacity-0 group-hover:opacity-100 transition-opacity duration-700 md:text-right shrink-0">
                        Select —
                      </span>
                    </div>
                    {/* Hover reveal line */}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C8A97E] transition-all duration-[1s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:w-full"></span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, ease: luxuryEase }}
              className="flex flex-col items-center text-center max-w-3xl mx-auto py-12"
            >
              <div className="w-20 h-20 border border-[#C8A97E]/30 rounded-full flex items-center justify-center mb-10 relative">
                <div className="absolute inset-2 border border-[#C8A97E]/10 rounded-full animate-pulse"></div>
                <span className="text-[#C8A97E] text-2xl font-serif italic">S</span>
              </div>

              <span className="text-[#C8A97E] text-[9px] uppercase tracking-[0.6em] mb-6 font-medium">
                Your Signature Chapter
              </span>
              <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif italic text-white mb-8 tracking-tight leading-[1.1]">
                {result.title}
              </h2>
              <p className="text-base font-light text-white/60 leading-[2] tracking-wide mb-16 max-w-xl mx-auto">
                {result.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center">
                <Link 
                  href={`/collections/${result.handle}`} 
                  className="bg-white text-[#15091C] text-[10px] uppercase tracking-[0.4em] font-medium px-12 py-5 hover:bg-[#C8A97E] hover:text-white transition-all duration-700 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(200,169,126,0.3)] flex items-center gap-4 group"
                >
                  Explore The Collection
                  <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>
                </Link>
                <button 
                  onClick={handleRestart}
                  className="bg-transparent text-white/50 text-[9px] uppercase tracking-[0.4em] font-medium px-8 py-5 hover:text-[#C8A97E] transition-colors duration-500 flex items-center gap-3 group"
                >
                  <span className="w-6 h-[1px] bg-white/20 group-hover:w-10 group-hover:bg-[#C8A97E] transition-all duration-500"></span>
                  Retake Diagnostic
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Progress & Footer Bar */}
      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10 mt-20">
        <div className="flex justify-between items-center text-[8px] uppercase tracking-[0.4em] text-white/40 pb-6">
          <span>Olfactory Consultation</span>
          <span>{completed ? "Complete" : `Chapter 0${currentStep + 1} / 03`}</span>
        </div>
        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#C8A97E]"
            initial={{ width: 0 }}
            animate={{ width: completed ? '100%' : `${((currentStep) / 3) * 100}%` }}
            transition={{ duration: 1, ease: luxuryEase }}
          />
        </div>
      </div>

    </div>
  );
}
