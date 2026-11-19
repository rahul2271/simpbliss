"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1];

// One reveal, used sparingly: section headings and grids only.
const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.3, ease } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const PROMISES = [
  'Alcohol-free and skin-friendly',
  'Long-lasting aroma',
  'Unisex fragrance',
  'IFRA-compliant and non-irritating',
];

const BOTANICALS = [
  { title: 'Assam Oud', desc: 'Wild-harvested resinous heartwood with a smoky, grounding warmth.', img: '/Assamoud.webp' },
  { title: 'Kannauj Rose', desc: 'Copper-pot hydro-distilled Damask petals, captured at dawn.', img: '/Kannaujroses.webp' },
  { title: 'Mysore Vetiver', desc: 'Root-deep, earthy layers that fix the scent on skin, naturally.', img: '/mysore.webp' },
];

const MOODS = [
  { title: 'Romantic Date', img: '/romanticdate.webp', offset: '' },
  { title: 'Day Casual', img: '/daycasual.webp', offset: 'md:mt-20' },
  { title: 'Office Wear', img: '/officewear.webp', offset: '' },
  { title: 'Festive Evening', img: '/festiveevening.webp', offset: 'md:mt-20' },
];

// Edit this block to change the quote. Only keep a publication name here
// if the quote was really published there.
const PRESS = {
  quote: 'A revelation in modern perfumery. It lingers not as a shout, but as a deeply intimate secret shared only with those closest to you.',
  source: 'Vogue India',
};

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

function SectionHead({ title, link }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-24 px-6 md:px-16">
      <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-[#15091C]">{title}</h2>
      {link && (
        <Link href={link.href} className="group inline-flex items-center gap-5 text-[10px] uppercase tracking-[0.32em] text-[#15091C]">
          <span>{link.label}</span>
          <span className="w-10 h-px bg-[#15091C] group-hover:w-20 group-hover:bg-[#C8A97E] transition-all duration-700 ease-luxe" />
        </Link>
      )}
    </div>
  );
}

export default function SmoothHome({ products = [], collections = [] }) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 220]);
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0.15]);

  return (
    <div className="bg-[#F9F7FA] text-[#15091C] overflow-x-clip font-sans">

      {/* HERO — the banner is the statement; everything else stays quiet */}
      <section className="relative w-full h-[92svh] md:h-screen bg-[#0E0612] overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <Link href="/collections/all" aria-label="Shop the collection" className="group block absolute inset-0">
            <div className="hidden md:block absolute inset-0">
              <Image src="/bannerblackopium1.webp" alt="SIMPBLISS Black Opium perfume oil" fill priority quality={90} sizes="100vw"
                className="object-cover transition-transform duration-[8s] ease-luxe group-hover:scale-[1.03]" />
            </div>
            <div className="md:hidden absolute inset-0">
              <Image src="/bannerblackopium1mm.webp" alt="SIMPBLISS Black Opium perfume oil" fill priority quality={90} sizes="100vw"
                className="object-cover" />
            </div>
          </Link>
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(14,6,18,0.55)_100%)]" />
          <div className="absolute top-0 inset-x-0 h-44 pointer-events-none bg-gradient-to-b from-[#0E0612]/85 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-56 pointer-events-none bg-gradient-to-t from-[#0E0612]/80 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 1.4, ease }}
          className="absolute bottom-10 md:bottom-14 inset-x-0 flex flex-col items-center gap-6 z-20"
        >
          <Link href="/collections/all"
            className="border border-[#C8A97E]/60 text-[#F3E7D3] text-[10px] uppercase tracking-[0.36em] px-10 py-4 backdrop-blur-sm bg-[#15091C]/20 hover:bg-[#C8A97E] hover:text-[#15091C] hover:border-[#C8A97E] transition-colors duration-700">
            Discover the collection
          </Link>
          <div className="w-px h-12 bg-white/15 overflow-hidden pointer-events-none">
            <motion.div animate={{ y: [-48, 48] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }} className="w-full h-1/2 bg-[#C8A97E]" />
          </div>
        </motion.div>
      </section>

      {/* PROMISES — slow marquee instead of four stranded labels */}
      <section className="marquee overflow-hidden border-b border-[#15091C]/10 bg-[#F9F7FA] py-7" aria-label="Our promises">
        <div className="marquee-track flex items-center">
          {[...PROMISES, ...PROMISES, ...PROMISES, ...PROMISES].map((t, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="px-10 md:px-16 font-serif text-xl md:text-2xl text-[#15091C]/75 whitespace-nowrap">{t}</span>
              <span className="w-1 h-1 rotate-45 bg-[#C8A97E]" />
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="py-28 md:py-40">
        <div className="max-w-[1600px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={reveal}>
            <SectionHead title="The collections" />
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger}
            className="flex md:flex-wrap md:justify-center gap-10 md:gap-24 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-6 md:px-16 pb-4"
          >
            {collections.length > 0 ? collections.map(({ node }) => (
              <motion.div key={node.id} variants={reveal} className="shrink-0 snap-center w-[38vw] md:w-48">
                <Link href={`/collections/${node.handle}`} className="group flex flex-col items-center">
                  <div className="relative w-full aspect-square rounded-full overflow-hidden bg-[#EFEAF2] mb-7 ring-1 ring-[#C8A97E]/0 group-hover:ring-[#C8A97E]/70 ring-offset-[10px] ring-offset-[#F9F7FA] transition-all duration-700 ease-luxe">
                    {node.image ? (
                      <Image src={node.image.url} alt={node.title} fill sizes="(max-width: 768px) 38vw, 192px"
                        className="object-cover transition-transform duration-[2s] ease-luxe group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif text-3xl">{node.title.charAt(0)}</div>
                    )}
                  </div>
                  <span className="font-serif text-xl md:text-2xl text-center text-[#15091C] group-hover:text-[#8a6d43] transition-colors duration-500">{node.title}</span>
                </Link>
              </motion.div>
            )) : (
              <p className="w-full text-center text-sm text-[#15091C]/50 py-6">Collections are being curated.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* THE ARCHIVE — product grid */}
      <section className="bg-white py-28 md:py-40 border-y border-[#15091C]/5">
        <div className="max-w-[1800px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={reveal}>
            <SectionHead title="The archive" link={{ href: '/collections/all', label: 'View all essences' }} />
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-20 overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar px-6 md:px-16 pb-6"
          >
            {products.length > 0 ? products.map(({ node }) => {
              const price = parseFloat(node.priceRange.minVariantPrice.amount);
              const main = node.images?.edges?.[0]?.node?.url || '/simpblisslogoji.png';
              const alt = node.images?.edges?.[1]?.node?.url || main;
              return (
                <motion.div key={node.id} variants={reveal} className="group shrink-0 snap-center w-[72vw] sm:w-[46vw] md:w-auto">
                  <Link href={`/products/${node.handle}`} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EFF5] mb-7">
                      <Image src={main} alt={node.title} fill sizes="(max-width: 768px) 72vw, 25vw"
                        className="object-cover mix-blend-multiply transition-all duration-[1.4s] ease-luxe md:group-hover:opacity-0 md:group-hover:scale-105" />
                      <Image src={alt} alt={`${node.title}, alternate view`} fill sizes="(max-width: 768px) 72vw, 25vw"
                        className="hidden md:block object-cover mix-blend-multiply absolute inset-0 opacity-0 scale-110 md:group-hover:opacity-100 md:group-hover:scale-100 transition-all duration-[1.6s] ease-luxe" />
                      <div className="hidden md:flex absolute inset-x-0 bottom-0 justify-center pb-7 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-luxe">
                        <span className="text-[10px] uppercase tracking-[0.32em] text-[#15091C] bg-white/90 backdrop-blur px-7 py-3">View essence</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-serif text-2xl md:text-[1.75rem] leading-tight text-[#15091C] mb-3 line-clamp-1 group-hover:text-[#8a6d43] transition-colors duration-500">{node.title}</h3>
                      <p className="text-[11px] tracking-[0.2em] text-[#15091C]/60 font-light">Perfume oil &nbsp;|&nbsp; ₹{inr.format(price)}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            }) : (
              <p className="w-full text-center py-20 text-sm text-[#15091C]/50 col-span-4">New essences arriving soon.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* THE CRAFT — split */}
      <section className="bg-[#F9F7FA]">
        <div className="flex flex-col lg:flex-row min-h-[85vh] max-w-[1800px] mx-auto">
          <div className="w-full lg:w-[44%] px-8 py-20 md:px-20 lg:px-28 flex flex-col justify-center order-2 lg:order-1">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={reveal} className="font-serif text-5xl md:text-7xl leading-[1] tracking-tight mb-10">
                Slow by choice,<br />precise by nature.
              </motion.h2>
              <motion.p variants={reveal} className="font-light text-[15px] md:text-base text-[#15091C]/70 leading-[1.9] max-w-md">
                Crafted with age-old distillation, where the heart of the fragrance is the botanical itself, holding the pure scent of Indian heritage. No alcohol, no synthetics. Just enduring sillage.
              </motion.p>
              <motion.div variants={reveal} className="pt-12">
                <Link href="/about" className="group inline-flex items-center gap-5 text-[10px] uppercase tracking-[0.32em] text-[#15091C]">
                  <span>Our process</span>
                  <span className="w-10 h-px bg-[#C8A97E] group-hover:w-20 transition-all duration-700 ease-luxe" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <div className="w-full lg:w-[56%] relative h-[60vh] lg:h-auto order-1 lg:order-2 overflow-hidden bg-[#EFEAF2]">
            <Image src="/rightimg.webp" alt="SIMPBLISS ingredients and distillation" fill sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover transition-transform duration-[5s] ease-luxe hover:scale-[1.04]" />
          </div>
        </div>
      </section>

      {/* RARE BOTANICALS — dark chapter */}
      <section className="py-28 md:py-40 bg-[#15091C] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#C8A97E]/[0.06] blur-[140px] rounded-full pointer-events-none" />
        <div className="max-w-[1600px] mx-auto px-6 md:px-16 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={reveal}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24 pb-10 border-b border-white/10">
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight">The rare botanicals</h2>
            <p className="text-sm text-white/55 font-light max-w-sm leading-[1.9]">
              Sourced directly from growers across India and aged to maturity before distillation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {BOTANICALS.map((item) => (
              <div key={item.title} className="group relative aspect-[3/4] overflow-hidden bg-black/40">
                <Image src={item.img} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-70 group-hover:opacity-45 group-hover:scale-[1.06] transition-all duration-[2.5s] ease-luxe" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#15091C] via-[#15091C]/30 to-transparent" />
                <div className="absolute inset-3 md:inset-5 border border-[#C8A97E]/0 group-hover:border-[#C8A97E]/40 transition-colors duration-1000 pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 p-8 md:p-10">
                  <h3 className="font-serif text-4xl md:text-[2.6rem] leading-none mb-4">{item.title}</h3>
                  <p className="text-[13px] font-light text-white/65 leading-[1.8] md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-1000 ease-luxe max-w-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS QUOTE */}
      <section className="py-32 md:py-48 bg-[#F9F7FA] border-b border-[#15091C]/5">
        <motion.figure initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}
          className="max-w-[1000px] mx-auto px-6 md:px-12 text-center">
          <div className="gold-line w-24 mx-auto mb-14" />
          <blockquote className="font-serif text-3xl md:text-5xl leading-[1.4] md:leading-[1.35] text-[#15091C]">
            &ldquo;{PRESS.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-14 text-[10px] uppercase tracking-[0.4em] text-[#15091C]/70">{PRESS.source}</figcaption>
        </motion.figure>
      </section>

      {/* MOODS */}
      <section className="py-28 md:py-40 max-w-[1800px] mx-auto overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={reveal}>
          <SectionHead title="Scents for every mood" />
        </motion.div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
          className="flex md:grid md:grid-cols-4 gap-5 md:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-6 md:px-16 pb-16"
        >
          {MOODS.map((m) => (
            <motion.div key={m.title} variants={reveal} className={`h-[62vh] md:h-[72vh] w-[78vw] md:w-auto shrink-0 snap-center ${m.offset}`}>
              <Link href="/collections/all" className="group block relative w-full h-full overflow-hidden bg-[#15091C]">
                <Image src={m.img} alt={m.title} fill sizes="(max-width: 768px) 78vw, 25vw"
                  className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-[2.5s] ease-luxe" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#15091C]/85 via-transparent to-transparent" />
                <div className="absolute bottom-9 inset-x-8">
                  <h3 className="text-white font-serif text-3xl md:text-4xl leading-tight mb-5">{m.title}</h3>
                  <span className="block w-8 h-px bg-[#C8A97E] group-hover:w-20 transition-all duration-700 ease-luxe" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SCENT FINDER CTA */}
      <section className="bg-[#0E0612] text-white py-32 md:py-44 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,28,71,0.55),transparent_70%)] pointer-events-none" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-[900px] mx-auto relative z-10">
          <motion.h2 variants={reveal} className="font-serif text-5xl md:text-8xl leading-[0.98] tracking-tight mb-10">Unsure of your signature note?</motion.h2>
          <motion.p variants={reveal} className="font-light text-base text-white/65 leading-[1.9] max-w-lg mx-auto mb-14">
            Answer a few questions and we will guide you to the oil that suits your mood and your skin.
          </motion.p>
          <motion.div variants={reveal}>
            <Link href="/scent-finder"
              className="inline-block border border-[#C8A97E]/70 text-[#F3E7D3] text-[10px] uppercase tracking-[0.36em] px-12 py-5 hover:bg-[#C8A97E] hover:text-[#15091C] transition-colors duration-700">
              Find my scent
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
