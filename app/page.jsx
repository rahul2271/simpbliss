import { shopifyFetch } from '../lib/shopify';
import SmoothHome from '../components/SmoothHome';
import FaqSection from '../components/FaqSection';
import { HOME } from '../lib/faq';
import { buildMetadata, SITE } from '../lib/seo';

export const metadata = buildMetadata({
  title: `${SITE.name} | ${SITE.tagline}`,
  absoluteTitle: true,
  description: SITE.description,
  path: '/',
});

// Put your exact handles here
const HOMEPAGE_COLLECTIONS = ['attarss', 'floral', 'gourmand-oriental', 'musk-amber' , 'oud-woody'];

// Query for BOTH 8 products (with 2 images for the hover effect) AND your 50 collections
const HOME_DATA_QUERY = `
  query HomeData {
    products(first: 8, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          priceRange { minVariantPrice { amount currencyCode } }
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
    collections(first: 50) {
      edges {
        node {
          id
          title
          handle
          image { url altText }
        }
      }
    }
  }
`;

export default async function Page() {
  const { body } = await shopifyFetch({ query: HOME_DATA_QUERY });

  const products = body?.data?.products?.edges || [];
  const rawCollections = body?.data?.collections?.edges || [];

  // Filter and sort the collections based on your chosen handles
  const selectedCollections = rawCollections
    .filter(({ node }) => HOMEPAGE_COLLECTIONS.includes(node.handle))
    .sort((a, b) => HOMEPAGE_COLLECTIONS.indexOf(a.node.handle) - HOMEPAGE_COLLECTIONS.indexOf(b.node.handle));

  return (
    <>
      <SmoothHome products={products} collections={selectedCollections} />
      <FaqSection faqs={HOME} />
    </>
  );
}