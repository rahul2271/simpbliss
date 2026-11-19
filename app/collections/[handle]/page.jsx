import { shopifyFetch } from '../../../lib/shopify';
import CollectionGrid from '../../../components/CollectionGrid';
import JsonLd from '../../../components/JsonLd';
import FaqSection from '../../../components/FaqSection';
import { collectionFaqs } from '../../../lib/faq';
import { collectionSchema, breadcrumbSchema } from '../../../lib/schema';
import { buildMetadata, truncate } from '../../../lib/seo';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const getCollectionQuery = `
  query getCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      title
      description
      seo { title description }
      image {
        url
        altText
      }
      products(first: 20) {
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
  }
`;

// One Shopify call per request (shared by metadata + page).
// Keeps the old fallback: if 'attarss' is missing, try 'attars'.
const getCollection = cache(async (handle) => {
  let { body } = await shopifyFetch({ query: getCollectionQuery, variables: { handle } });
  let collection = body?.data?.collection;

  if (!collection && handle === 'attarss') {
    const retry = await shopifyFetch({ query: getCollectionQuery, variables: { handle: 'attars' } });
    collection = retry.body?.data?.collection;
  }
  return collection || null;
});

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) return { title: 'Collection not found', robots: { index: false, follow: false } };

  return buildMetadata({
    title: collection.seo?.title || `${collection.title} Perfume Oils`,
    description:
      collection.seo?.description ||
      collection.description ||
      `Explore the ${collection.title} collection of alcohol-free perfume oils from SIMPBLISS.`,
    path: `/collections/${handle}`,
    image: collection.image ? { url: collection.image.url, alt: collection.image.altText || collection.title } : undefined,
  });
}

export default async function CollectionPage({ params }) {
  const { handle } = await params;
  const collection = await getCollection(handle);

  if (!collection) notFound(); // real 404 status, so search engines drop dead URLs

  const products = collection.products?.edges || [];
  const path = `/collections/${handle}`;

  return (
    <>
      <JsonLd
        data={[
          collectionSchema({
            name: collection.title,
            description: collection.description || collection.seo?.description,
            path,
            products,
          }),
          breadcrumbSchema([
            { name: 'All essences', path: '/collections/all' },
            { name: collection.title, path },
          ]),
        ]}
      />
      <div className="bg-[#F9F7FA] min-h-screen pt-[120px] md:pt-[150px]">

        {/* Collection Header Banner */}
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 md:py-24 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-serif text-[#15091C] tracking-tight leading-[1] mb-6">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-sm md:text-base font-light text-[#15091C]/60 max-w-xl mx-auto leading-[1.8] tracking-wide mb-8">
              {collection.description}
            </p>
          )}
          <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-[#C8A97E]/50 to-transparent mt-6"></div>
        </div>

        {/* Products Grid */}
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 pb-24 md:pb-32">
          <CollectionGrid products={products} />
        </div>
      </div>
      <FaqSection faqs={collectionFaqs({ handle, title: collection.title, description: collection.description })} />
    </>
  );
}
