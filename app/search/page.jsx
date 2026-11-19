"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { shopifyFetch } from '../../lib/shopify';

const SEARCH_QUERY = `
  query searchProducts($query: String!) {
    products(first: 12, query: $query) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
            }
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Focus input automatically on mount
  useEffect(() => {
    document.getElementById('search-input')?.focus();
  }, []);

  // Debounce the search term to prevent spamming the Shopify API
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch results when debounced term changes
  useEffect(() => {
    async function fetchResults() {
      if (!debouncedTerm.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { body } = await shopifyFetch({
          query: SEARCH_QUERY,
          variables: { query: `title:*${debouncedTerm}*` }
        });
        setResults(body?.data?.products?.edges || []);
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setIsSearching(false);
      }
    }

    fetchResults();
  }, [debouncedTerm]);

  return (
    <div className="bg-[#15091C] min-h-screen text-white pt-32 pb-24 selection:bg-[#C8A97E] selection:text-white relative overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#C8A97E]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Search Header */}
        <div className="flex flex-col items-center justify-center mb-16 md:mb-24 w-full max-w-4xl mx-auto">
          <span className="text-[#C8A97E] text-[10px] uppercase tracking-[0.4em] mb-6 font-medium">
            Search The Archive
          </span>
          
          <div className="relative w-full">
            <input 
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Discover your essence..."
              className="w-full bg-transparent border-b-2 border-white/20 pb-4 md:pb-6 text-4xl md:text-6xl lg:text-7xl font-serif italic text-white placeholder-white/20 focus:outline-none focus:border-[#C8A97E] transition-colors duration-700 text-center tracking-tight"
            />
            {/* Clear Button */}
            <AnimatePresence>
              {searchTerm && (
                <motion.button 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mt-2 md:-mt-3 text-[9px] uppercase tracking-[0.3em] text-white/50 hover:text-[#C8A97E] transition-colors p-4"
                >
                  Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="h-12 flex items-center justify-center mb-8">
          <AnimatePresence>
            {isSearching && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-[#C8A97E] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#C8A97E] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-1.5 h-1.5 bg-[#C8A97E] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16">
          <AnimatePresence>
            {results.map(({ node }, i) => {
              const currentPrice = parseFloat(node.priceRange.minVariantPrice.amount);
              const mainImage = node.images.edges[0]?.node?.url || '/simpblisslogoji.png';
              
              return (
                <motion.div 
                  key={node.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group flex flex-col items-center"
                >
                  <Link href={`/products/${node.handle}`} className="w-full">
                    <div className="relative aspect-[3/4] overflow-hidden bg-white/5 rounded-sm mb-5 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                      <Image 
                        src={mainImage} 
                        alt={node.title} 
                        fill 
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)]" 
                      />
                    </div>
                    <div className="text-center px-2">
                      <h3 className="font-serif italic text-lg md:text-xl text-white mb-2 group-hover:text-[#C8A97E] transition-colors duration-500 tracking-tight line-clamp-1">
                        {node.title}
                      </h3>
                      <span className="text-[11px] md:text-sm font-sans font-light tracking-[0.1em] text-white/70">
                        ₹{currentPrice.toFixed(0)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!isSearching && debouncedTerm && results.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-white/40 uppercase tracking-[0.3em] text-[10px] font-medium">
            No essences match your search.
          </motion.div>
        )}

      </div>
    </div>
  );
}