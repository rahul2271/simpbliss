import { shopifyFetch } from '../../../lib/shopify';
import CollectionGrid from '../../../components/CollectionGrid';
import JsonLd from '../../../components/JsonLd';
import FaqSection from '../../../components/FaqSection';
import { SHOP_ALL } from '../../../lib/faq';
import { collectionSchema, breadcrumbSchema } from '../../../lib/schema';
import { buildMetadata } from '../../../lib/seo';

export const metadata = buildMetadata({
  title: 'All Perfume Oils',
  description: 'Shop every SIMPBLISS essence: alcohol-free, unisex perfume oils in oud and woody, floral, oriental and gourmand, and musk and amber families.',
  path: '/collections/all',
});

const getAllProductsQuery = `
  query getProducts {
    products(first: 20, sortKey: CREATED_AT, reverse: true) {
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
`;

export default async function ShopAllPage() {
  const { body } = await shopifyFetch({ query: getAllProductsQuery });
  const products = body?.data?.products?.edges || [];

  return (
    <>
    <JsonLd data={[
      collectionSchema({ name: 'All essences', description: 'Every SIMPBLISS alcohol-free perfume oil.', path: '/collections/all', products }),
      breadcrumbSchema([{ name: 'All essences', path: '/collections/all' }]),
    ]} />
    <div className="bg-[#F9F7FA] min-h-screen pt-[90px] md:pt-[120px]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-6 md:pt-12 pb-24 md:pb-32">
        {/* Page Header */}
        <div className="mb-10 md:mb-20 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-7xl lg:text-[7rem] font-serif text-[#15091C] tracking-tight leading-[1.1] md:leading-[1]">
            All Essences
          </h1>
          {/* Shorter, tighter vertical line on mobile */}
          <div className="w-[1px] h-8 md:h-20 bg-gradient-to-b from-[#C8A97E]/50 to-transparent mt-6 md:mt-12"></div>
        </div>
        
        {/* The Animated Product Grid */}
        <CollectionGrid products={products} />
      </div>
    </div>
    <FaqSection faqs={SHOP_ALL} />
    </>
  );
}