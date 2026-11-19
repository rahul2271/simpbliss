"use client";
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProductDetails({ product }) {
  const images = product.images.edges.map(edge => edge.node);
  const variants = product.variants.edges.map(edge => edge.node);
  
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [mainImage, setMainImage] = useState(images[0]);

  const handleAddToCart = () => {
    alert(`Added ${product.title} to cart!`);
  };

  return (
    <div className="bg-brand-dark min-h-screen pt-32 pb-24 px-4 md:px-12 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[60vw] h-[60vw] rounded-full bg-brand-purple/20 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 relative z-10">
        
        {/* Left: Glass Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col-reverse md:flex-row gap-6"
        >
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 hide-scrollbar">
            {images.map((img, index) => (
              <button 
                key={index}
                onClick={() => setMainImage(img)}
                className={`relative w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-white/[0.02] border transition-all duration-300 ${mainImage.url === img.url ? 'border-brand-gold opacity-100 shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-white/10 opacity-60 hover:opacity-100'}`}
              >
                <Image src={img.url} alt={img.altText || 'Thumbnail'} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Main Image Container */}
          <div className="relative w-full aspect-[4/5] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 flex items-center justify-center shadow-2xl">
            {mainImage && (
              <Image 
                src={mainImage.url} 
                alt={mainImage.altText || product.title} 
                fill 
                className="object-contain p-8 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-float"
                priority
              />
            )}
          </div>
        </motion.div>

        {/* Right: Info & Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <span className="text-brand-gold tracking-[0.3em] uppercase text-xs mb-4 font-medium border border-brand-gold/30 rounded-full px-4 py-1.5 bg-brand-gold/10 w-fit">
            Pure Perfume Oil
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-gold-light mb-4">
            {product.title}
          </h1>
          <p className="text-2xl font-serif text-brand-gold mb-8">
            ₹{parseFloat(selectedVariant.price.amount).toFixed(0)}
          </p>

          <div 
            className="prose prose-sm prose-invert text-white/70 font-light leading-relaxed mb-10"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />

          {/* Variant Selector */}
          {variants.length > 1 && (
            <div className="mb-10">
              <span className="block text-xs uppercase tracking-widest text-white/50 mb-4">Select Volume</span>
              <div className="flex flex-wrap gap-4">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!variant.availableForSale}
                    className={`px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 ${
                      selectedVariant.id === variant.id 
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                        : 'bg-white/[0.02] text-white border border-white/10 hover:border-brand-gold/50'
                    } ${!variant.availableForSale && 'opacity-30 cursor-not-allowed'}`}
                  >
                    {variant.title} {variant.availableForSale ? '' : '(Sold Out)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Premium Gold Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={!selectedVariant.availableForSale}
            className="w-full bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-dark font-medium py-5 rounded-2xl uppercase tracking-[0.2em] text-sm hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedVariant.availableForSale ? 'Add to Cart' : 'Out of Stock'}
          </button>
          
          {/* Trust Badges */}
          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-[10px] uppercase tracking-widest text-white/40 text-center">
            <div className="flex flex-col items-center gap-2"><span className="text-xl text-brand-gold">🚚</span> Free Shipping</div>
            <div className="flex flex-col items-center gap-2"><span className="text-xl text-brand-gold">🌿</span> 100% Natural</div>
            <div className="flex flex-col items-center gap-2"><span className="text-xl text-brand-gold">🔒</span> Secure Pay</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
