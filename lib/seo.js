// lib/seo.js — one place for every SEO constant and helper.
// Set NEXT_PUBLIC_SITE_URL in .env.local / Vercel to your live frontend domain.

export const SITE = {
  name: 'SIMPBLISS',
  tagline: 'Essence of Modern Royalty',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://simpbliss.in').replace(/\/$/, ''),
  description:
    'Premium, alcohol-free perfume oils crafted for every mood. Traditional Indian distillation, unisex fragrances and long-lasting aroma.',
  locale: 'en_IN',
  currency: 'INR',
  logo: '/simpblisslogoji.png',
  ogImage: '/og-default.jpg',
  // Taken from the Contact page. Check these are correct: structured data
  // must match what visitors see on the site.
  contact: {
    email: 'care@vedicnature.in',
    phone: '+919210303276',
    areaServed: 'IN',
    address: { streetAddress: 'Mayur Vihar Phase 1', addressLocality: 'Delhi', addressCountry: 'IN' },
    hours: 'Mo-Sa 10:00-19:00',
  },
  // Add real profile URLs here (Instagram, YouTube, ...) to include them as sameAs
  social: [],
};

export const abs = (path = '/') => (/^https?:\/\//.test(path) ? path : `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`);

export function stripHtml(html = '') {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

export function truncate(text = '', max = 158) {
  const t = stripHtml(text);
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ') > 90 ? cut.lastIndexOf(' ') : cut.length).replace(/[,.;:\s]+$/, '') + '\u2026';
}

/**
 * Builds a Next.js metadata object with canonical, Open Graph and Twitter set.
 * `title` should NOT include the brand: the layout template appends " | SIMPBLISS".
 */
export function buildMetadata({
  title,
  description = SITE.description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  absoluteTitle = false,
} = {}) {
  const img = image ? { url: abs(image.url || image), alt: image.alt || title || SITE.name } : { url: abs(SITE.ogImage), width: 1200, height: 630, alt: SITE.name };
  const fullTitle = absoluteTitle ? title : title ? `${title} | ${SITE.name}` : `${SITE.name} | ${SITE.tagline}`;
  const desc = truncate(description);

  return {
    ...(title ? { title: absoluteTitle ? { absolute: title } : title } : {}),
    description: desc,
    alternates: { canonical: abs(path) },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: abs(path),
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [img],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: desc, images: [img.url] },
    ...(noindex ? { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } } : {}),
  };
}
