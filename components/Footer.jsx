import Link from 'next/link';

const linkClass = 'text-[11px] font-light tracking-[0.22em] text-white/60 hover:text-[#C8A97E] transition-colors duration-500 uppercase w-fit';
const headClass = 'font-serif text-2xl text-white/90 mb-2';

export default function Footer() {
  return (
    <footer className="bg-[#0E0612] text-white pt-28 md:pt-40 pb-12 px-6 md:px-16 relative z-20 overflow-hidden">
      <div className="gold-line absolute top-0 inset-x-0" />
      <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-[#C8A97E]/[0.05] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between gap-20 mb-24 md:mb-36">

          {/* Newsletter */}
          <div className="w-full lg:w-[42%]">
            <h3 className="font-serif text-4xl md:text-5xl leading-[1.1] tracking-tight mb-10 text-white/95">
              Rare batches and new scents, before anyone else.
            </h3>
            <form className="flex items-end gap-6 border-b border-white/20 pb-4 focus-within:border-[#C8A97E] transition-colors duration-700 max-w-lg">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email address"
                className="bg-transparent border-none outline-none w-full text-sm font-light tracking-wide placeholder-white/35 text-white rounded-none focus:ring-0"
                required
              />
              <button type="submit" className="text-[10px] uppercase tracking-[0.34em] text-[#C8A97E] hover:text-white transition-colors duration-500 shrink-0">
                Subscribe
              </button>
            </form>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-14 md:gap-24 w-full lg:w-[50%] lg:justify-items-end">
            <div className="flex flex-col gap-5">
              <h4 className={headClass}>Explore</h4>
              <Link href="/collections/all" className={linkClass}>All essences</Link>
              <Link href="/about" className={linkClass}>Our craft</Link>
              <Link href="/scent-finder" className={linkClass}>Scent finder</Link>
              <Link href="/blogs" className={linkClass}>Journal</Link>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className={headClass}>Support</h4>
              <Link href="/contact" className={linkClass}>Contact us</Link>
              <Link href="/shipping" className={linkClass}>Shipping &amp; returns</Link>
              <Link href="/faq" className={linkClass}>FAQ</Link>
              <Link href="/bulk-orders" className={linkClass}>Wholesale</Link>
            </div>

            <div className="flex flex-col gap-5 col-span-2 md:col-span-1">
              <h4 className={headClass}>Follow</h4>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={linkClass}>Instagram</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className={linkClass}>YouTube</a>
            </div>
          </div>
        </div>

        {/* Wordmark + legal */}
        <div className="pt-10 border-t border-white/10 w-full">
          <div className="w-full flex items-center justify-center mb-12 md:mb-16 select-none overflow-hidden" aria-hidden="true">
            <span className="font-serif font-light tracking-[0.18em] leading-none text-[#C8A97E]/[0.14] text-[12vw] lg:text-[160px] whitespace-nowrap">
              SIMPBLISS
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.24em] uppercase text-white/45">
            <span>&copy; {new Date().getFullYear()} SIMPBLISS</span>
            <div className="flex flex-wrap justify-center gap-8">
              <Link href="/policies/privacy-policy" className="hover:text-[#C8A97E] transition-colors duration-500">Privacy</Link>
              <Link href="/policies/terms-of-service" className="hover:text-[#C8A97E] transition-colors duration-500">Terms</Link>
              <Link href="/policies/refund-policy" className="hover:text-[#C8A97E] transition-colors duration-500">Refunds</Link>
            </div>
            <span className="text-[#C8A97E]/70">Essence of Nature</span>
          </div>

          <div className="mt-10 pt-5 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-2 text-center text-[9px] tracking-[0.3em] uppercase text-white/30">
            <span>Engineered &amp; developed by RC Tech Solutions</span>
            <span className="hidden md:inline text-white/15">|</span>
            <a href="https://rctechsolutions.com" target="_blank" rel="noopener noreferrer" className="text-[#C8A97E]/70 hover:text-[#C8A97E] transition-colors duration-500">
              rctechsolutions.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
