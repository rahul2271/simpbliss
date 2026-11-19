// lib/schema.js — schema.org (JSON-LD) builders. Only real data goes in:
// no invented ratings, reviews or prices.
import { SITE, abs, stripHtml, truncate } from './seo';

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: abs(SITE.logo) },
    image: abs(SITE.ogImage),
    description: SITE.description,
    slogan: SITE.tagline,
    address: { '@type': 'PostalAddress', ...SITE.contact.address },
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: SITE.contact.phone,
      email: SITE.contact.email,
      areaServed: SITE.contact.areaServed,
      availableLanguage: ['English', 'Hindi'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
    }],
    ...(SITE.social.length ? { sameAs: SITE.social } : {}),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: 'en-IN',
    publisher: { '@id': ORG_ID },
  };
}

// items: [{ name, path }] in order, home is added automatically
export function breadcrumbSchema(items = []) {
  const all = [{ name: 'Home', path: '/' }, ...items];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faqSchema(faqs = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// type: WebPage | AboutPage | ContactPage | CollectionPage | SearchResultsPage
export function webPageSchema({ type = 'WebPage', name, description, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${abs(path)}#webpage`,
    url: abs(path),
    name,
    ...(description ? { description: truncate(description, 300) } : {}),
    inLanguage: 'en-IN',
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
  };
}

export function productSchema(product, handle) {
  const images = (product.images?.edges || []).map((e) => e.node.url);
  const variants = (product.variants?.edges || []).map((e) => e.node);
  const url = abs(`/products/${handle}`);
  const currency = product.priceRange?.minVariantPrice?.currencyCode || SITE.currency;

  const offers = variants.map((v) => ({
    '@type': 'Offer',
    url,
    priceCurrency: v.price?.currencyCode || currency,
    price: Number(v.price?.amount ?? product.priceRange?.minVariantPrice?.amount ?? 0).toFixed(2),
    availability: v.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    ...(v.sku ? { sku: v.sku } : {}),
    ...(variants.length > 1 && v.title && v.title !== 'Default Title' ? { name: v.title } : {}),
    seller: { '@id': ORG_ID },
  }));

  const desc = product.seo?.description || product.description || product.shortSubtitle?.value || '';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.title,
    url,
    ...(images.length ? { image: images } : {}),
    ...(desc ? { description: stripHtml(desc) } : {}),
    brand: { '@type': 'Brand', name: product.vendor || SITE.name },
    ...(product.productType ? { category: product.productType } : {}),
    ...(variants[0]?.sku ? { sku: variants[0].sku } : {}),
    ...(offers.length === 1 ? { offers: offers[0] } : offers.length > 1 ? {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: currency,
        lowPrice: Math.min(...offers.map((o) => Number(o.price))).toFixed(2),
        highPrice: Math.max(...offers.map((o) => Number(o.price))).toFixed(2),
        offerCount: offers.length,
        offers,
      },
    } : {}),
  };
}

// products: Shopify product edges ({ node })
export function collectionSchema({ name, description, path, products = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${abs(path)}#webpage`,
    url: abs(path),
    name,
    ...(description ? { description: truncate(description, 300) } : {}),
    inLanguage: 'en-IN',
    isPartOf: { '@id': SITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map(({ node }, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: abs(`/products/${node.handle}`),
        name: node.title,
        ...(node.images?.edges?.[0]?.node?.url ? { image: node.images.edges[0].node.url } : {}),
      })),
    },
  };
}

export function articleSchema({ article, blog, handle, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${abs(path)}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(path) },
    headline: truncate(article.title, 110),
    ...(article.seo?.description || article.excerpt ? { description: truncate(article.seo?.description || article.excerpt, 300) } : {}),
    ...(article.image?.url ? { image: [article.image.url] } : {}),
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { '@type': 'Person', name: article.authorV2?.name || SITE.name },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-IN',
  };
}

export function blogListSchema({ path, blogs = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${abs(path)}#blog`,
    url: abs(path),
    name: `${SITE.name} Journal`,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-IN',
    blogPost: blogs.flatMap((b) => (b.articles?.edges || []).map(({ node }) => ({
      '@type': 'BlogPosting',
      headline: node.title,
      url: abs(`/blogs/${b.handle}/${node.handle}`),
      datePublished: node.publishedAt,
      ...(node.image?.url ? { image: node.image.url } : {}),
    }))),
  };
}
