import Link from 'next/link';
import PageShell from '../../components/PageShell';
import { getShopPolicies } from '../../lib/shopify';
import JsonLd from '../../components/JsonLd';
import FaqSection from '../../components/FaqSection';
import { SHIPPING } from '../../lib/faq';
import { webPageSchema, breadcrumbSchema } from '../../lib/schema';
import { buildMetadata } from '../../lib/seo';

const DESC = 'Delivery, shipping charges, returns and refunds for SIMPBLISS orders.';

export const metadata = buildMetadata({ title: 'Shipping and Returns', description: DESC, path: '/shipping' });

// Always read the live policy text from Shopify
export const dynamic = 'force-dynamic';

function Block({ title, html }) {
  return (
    <section className="mb-16 md:mb-24">
      <h2 className="font-serif text-4xl md:text-5xl text-[#15091C] mb-8 tracking-tight">{title}</h2>
      <div className="policy-prose" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}

export default async function ShippingPage() {
  const shop = await getShopPolicies();
  const shipping = shop.shippingPolicy?.body;
  const refund = shop.refundPolicy?.body;

  return (
    <>
    <JsonLd data={[
      webPageSchema({ type: 'WebPage', name: 'Shipping and Returns', description: DESC, path: '/shipping' }),
      breadcrumbSchema([{ name: 'Shipping and returns', path: '/shipping' }]),
    ]} />
    <PageShell title="Shipping and returns" intro="Orders above ₹1000 ship free.">
      {shipping && <Block title="Shipping" html={shipping} />}
      {refund && <Block title="Returns and refunds" html={refund} />}

      {!shipping && !refund && (
        <div className="text-center border border-[#15091C]/10 bg-white px-8 py-14">
          <p className="font-serif text-3xl text-[#15091C] mb-4">Details coming soon</p>
          <p className="text-[15px] font-light text-[#15091C]/65 leading-[1.9] max-w-md mx-auto mb-8">
            For delivery times or a return, please reach out and we will help you directly.
          </p>
          <Link href="/contact" className="inline-block border border-[#15091C] text-[#15091C] text-[10px] uppercase tracking-[0.34em] px-10 py-4 hover:bg-[#15091C] hover:text-white transition-colors duration-500">
            Contact us
          </Link>
        </div>
      )}
    </PageShell>
    <FaqSection faqs={SHIPPING} />
    </>
  );
}
