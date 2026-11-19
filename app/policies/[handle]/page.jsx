import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '../../../components/PageShell';
import { getShopPolicy, POLICY_HANDLES } from '../../../lib/shopify';
import JsonLd from '../../../components/JsonLd';
import { webPageSchema, breadcrumbSchema } from '../../../lib/schema';
import { buildMetadata } from '../../../lib/seo';

export const dynamic = 'force-dynamic';

const TITLES = {
  'privacy-policy': 'Privacy policy',
  'terms-of-service': 'Terms of service',
  'refund-policy': 'Refund policy',
  'shipping-policy': 'Shipping policy',
};

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const title = TITLES[handle];
  if (!title) return {};
  return buildMetadata({
    title,
    description: `${title} for SIMPBLISS, the alcohol-free perfume oil brand.`,
    path: `/policies/${handle}`,
  });
}

export default async function PolicyPage({ params }) {
  const { handle } = await params;
  if (!POLICY_HANDLES.includes(handle)) notFound();

  const policy = await getShopPolicy(handle);

  if (!policy) {
    return (
      <PageShell title={TITLES[handle]}>
        <div className="text-center border border-[#15091C]/10 bg-white px-8 py-14">
          <p className="text-[15px] font-light text-[#15091C]/65 leading-[1.9] max-w-md mx-auto mb-8">
            This policy is being updated. Please contact us if you need it right away.
          </p>
          <Link href="/contact" className="inline-block border border-[#15091C] text-[#15091C] text-[10px] uppercase tracking-[0.34em] px-10 py-4 hover:bg-[#15091C] hover:text-white transition-colors duration-500">
            Contact us
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <>
      <JsonLd data={[
        webPageSchema({ type: 'WebPage', name: policy.title || TITLES[handle], path: `/policies/${handle}` }),
        breadcrumbSchema([{ name: policy.title || TITLES[handle], path: `/policies/${handle}` }]),
      ]} />
      <PageShell title={policy.title || TITLES[handle]}>
        <div className="policy-prose" dangerouslySetInnerHTML={{ __html: policy.body }} />
      </PageShell>
    </>
  );
}
