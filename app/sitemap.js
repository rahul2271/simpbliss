import { shopifyFetch } from '../lib/shopify';
import { SITE } from '../lib/seo';

// Rebuilt at most once an hour
export const revalidate = 3600;

// Walks a Storefront connection page by page (max 250 per page)
async function fetchAll(field, nodeFields, extra = '') {
  const out = [];
  let cursor = null;
  for (let page = 0; page < 8; page++) {
    const query = `
      query($cursor: String) {
        ${field}(first: 250, after: $cursor ${extra}) {
          pageInfo { hasNextPage endCursor }
          edges { node { ${nodeFields} } }
        }
      }`;
    const { body } = await shopifyFetch({ query, variables: { cursor }, revalidate: 3600 });
    const conn = body?.data?.[field];
    if (!conn) break;
    out.push(...conn.edges.map((e) => e.node));
    if (!conn.pageInfo.hasNextPage) break;
    cursor = conn.pageInfo.endCursor;
  }
  return out;
}

export default async function sitemap() {
  const [products, collections, articles] = await Promise.all([
    fetchAll('products', 'handle updatedAt'),
    fetchAll('collections', 'handle updatedAt'),
    fetchAll('articles', 'handle publishedAt blog { handle }'),
  ]);

  const now = new Date();
  const url = (p) => `${SITE.url}${p}`;

  const staticPages = [
    ['/', 1.0, 'weekly'],
    ['/collections/all', 0.9, 'weekly'],
    ['/about', 0.6, 'monthly'],
    ['/scent-finder', 0.6, 'monthly'],
    ['/bulk-orders', 0.5, 'monthly'],
    ['/contact', 0.5, 'monthly'],
    ['/faq', 0.5, 'monthly'],
    ['/shipping', 0.4, 'monthly'],
    ['/blogs', 0.6, 'weekly'],
    ['/policies/privacy-policy', 0.2, 'yearly'],
    ['/policies/terms-of-service', 0.2, 'yearly'],
    ['/policies/refund-policy', 0.2, 'yearly'],
  ].map(([p, priority, changeFrequency]) => ({ url: url(p), lastModified: now, changeFrequency, priority }));

  return [
    ...staticPages,
    ...collections.map((c) => ({ url: url(`/collections/${c.handle}`), lastModified: new Date(c.updatedAt), changeFrequency: 'weekly', priority: 0.8 })),
    ...products.map((p) => ({ url: url(`/products/${p.handle}`), lastModified: new Date(p.updatedAt), changeFrequency: 'weekly', priority: 0.9 })),
    ...articles.filter((a) => a.blog?.handle).map((a) => ({ url: url(`/blogs/${a.blog.handle}/${a.handle}`), lastModified: new Date(a.publishedAt), changeFrequency: 'monthly', priority: 0.5 })),
  ];
}
