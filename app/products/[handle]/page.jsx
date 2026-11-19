import { shopifyFetch } from '../../../lib/shopify';
import SmoothProduct from '../../../components/SmoothProduct';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import JsonLd from '../../../components/JsonLd';
import FaqSection from '../../../components/FaqSection';
import { productFaqs } from '../../../lib/faq';
import { productSchema, breadcrumbSchema } from '../../../lib/schema';
import { buildMetadata, truncate } from '../../../lib/seo';

const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      vendor
      productType
      seo { title description }
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      compareAtPriceRange {
        maxVariantPrice { amount currencyCode }
      }
      images(first: 6) {
        edges {
          node { url altText }
        }
      }
      variants(first: 10) {
        edges {
          node { id title sku availableForSale price { amount currencyCode } }
        }
      }
      
      # --- EXISTING METAFIELDS ---
      topNotes: metafield(namespace: "custom", key: "top_notes") { value }
      heartNotes: metafield(namespace: "custom", key: "heart_notes") { value }
      baseNotes: metafield(namespace: "custom", key: "base_notes") { value }
      ingredients: metafield(namespace: "custom", key: "ingredients") { value }
      shortSubtitle: metafield(namespace: "custom", key: "short_subtitle") { value }
      
      # --- NEW ACCORDION METAFIELDS ---
      keyBenefits: metafield(namespace: "custom", key: "key_benefits") { value }
      keyFeatures: metafield(namespace: "custom", key: "key_features") { value }
      howToUse: metafield(namespace: "custom", key: "how_to_use") { value }
    }
  }
`;

// One Shopify call per request, shared by generateMetadata and the page
const getProduct = cache(async (handle) => {
  const { body } = await shopifyFetch({ query: getProductQuery, variables: { handle } });
  return body?.data?.product || null;
});

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: 'Product not found', robots: { index: false, follow: false } };

  const hasType = /\b(oil|attar)\b/i.test(product.title);
  const title = product.seo?.title || (hasType ? product.title : `${product.title} Perfume Oil`);
  const description =
    product.seo?.description ||
    product.description ||
    product.shortSubtitle?.value ||
    `${product.title}, an alcohol-free perfume oil from SIMPBLISS.`;
  const img = product.images?.edges?.[0]?.node;

  return buildMetadata({
    title,
    description: truncate(description),
    path: `/products/${handle}`,
    image: img ? { url: img.url, alt: img.altText || product.title } : undefined,
  });
}

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return notFound();

  return (
    <>
      <JsonLd
        data={[
          productSchema(product, handle),
          breadcrumbSchema([
            { name: 'All essences', path: '/collections/all' },
            { name: product.title, path: `/products/${handle}` },
          ]),
        ]}
      />
      <SmoothProduct product={product} />
      <FaqSection faqs={productFaqs(product)} />
    </>
  );
}
