import Link from 'next/link';
import JsonLd from './JsonLd';
import { faqSchema } from '../lib/schema';

export function FaqList({ faqs }) {
  return (
    <div className="border-t border-[#15091C]/10">
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-[#15091C]/10">
          <summary className="flex items-center justify-between gap-6 py-6 md:py-7 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span className="font-serif text-2xl md:text-[1.75rem] leading-snug text-[#15091C] group-hover:text-[#8a6d43] transition-colors duration-500">{f.q}</span>
            <span className="relative w-4 h-4 shrink-0" aria-hidden="true">
              <span className="absolute inset-x-0 top-1/2 h-px bg-[#15091C]" />
              <span className="absolute inset-y-0 left-1/2 w-px bg-[#15091C] group-open:opacity-0 transition-opacity duration-500" />
            </span>
          </summary>
          <div className="pb-8 pr-10 text-[15px] font-light text-[#15091C]/70 leading-[1.95]">
            <p>{f.a}</p>
            {f.link && (
              <Link href={f.link.href} className="inline-flex items-center gap-4 mt-5 text-[10px] uppercase tracking-[0.3em] text-[#15091C] hover:text-[#8a6d43] transition-colors duration-500">
                {f.link.label}
                <span className="w-8 h-px bg-[#C8A97E]" />
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

// Contextual FAQ block for the bottom of a page. Renders the visible
// questions AND the matching FAQPage JSON-LD, so they can never drift apart.
export default function FaqSection({ faqs, title = 'Frequently asked questions' }) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-[#F9F7FA] border-t border-[#15091C]/5 py-24 md:py-36">
      <JsonLd data={faqSchema(faqs)} />
      <div className="max-w-[1300px] mx-auto px-6 md:px-16 grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-24">
        <h2 id="faq-title" className="font-serif text-5xl md:text-6xl leading-[1] tracking-tight text-[#15091C] lg:sticky lg:top-40 lg:self-start">
          {title}
        </h2>
        <FaqList faqs={faqs} />
      </div>
    </section>
  );
}
