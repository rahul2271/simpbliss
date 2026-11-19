"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1];

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease } },
};

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export default function CollectionGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-24 text-sm text-[#15091C]/50">
        No essences found here yet.
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-10 lg:gap-x-14 gap-y-14 md:gap-y-24"
    >
      {products.map(({ node }) => {
        const { id, title, handle, priceRange, images } = node;
        const price = parseFloat(priceRange.minVariantPrice.amount);
        const main = images.edges[0]?.node?.url || '/simpblisslogoji.png';
        const alt = images.edges[1]?.node?.url || main;

        return (
          <motion.div key={id} variants={reveal} className="group">
            <Link href={`/products/${handle}`} className="relative block w-full aspect-[4/5] bg-[#F3EFF5] overflow-hidden mb-6 md:mb-8">
              <Image
                src={main} alt={title} fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 30vw"
                className="object-cover mix-blend-multiply transition-all duration-[1.4s] ease-luxe md:group-hover:opacity-0 md:group-hover:scale-105"
              />
              <Image
                src={alt} alt={`${title}, alternate view`} fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 30vw"
                className="hidden md:block object-cover mix-blend-multiply absolute inset-0 opacity-0 scale-110 md:group-hover:opacity-100 md:group-hover:scale-100 transition-all duration-[1.6s] ease-luxe"
              />
              <div className="hidden md:flex absolute inset-x-0 bottom-0 justify-center pb-8 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-luxe">
                <span className="text-[10px] uppercase tracking-[0.32em] text-[#15091C] bg-white/90 backdrop-blur px-7 py-3">View essence</span>
              </div>
            </Link>

            <div className="text-center px-1">
              <Link
                href={`/products/${handle}`}
                className="block font-serif text-xl md:text-3xl leading-tight text-[#15091C] mb-2 md:mb-3 hover:text-[#8a6d43] transition-colors duration-500 line-clamp-1"
              >
                {title}
              </Link>
              <p className="text-[10px] md:text-[11px] tracking-[0.2em] text-[#15091C]/60 font-light">
                Perfume oil &nbsp;|&nbsp; ₹{inr.format(price)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
