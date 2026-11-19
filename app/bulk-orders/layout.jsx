import JsonLd from '../../components/JsonLd';
import FaqSection from '../../components/FaqSection';
import { BULK } from '../../lib/faq';
import { webPageSchema, breadcrumbSchema } from '../../lib/schema';
import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({
  title: 'Bulk and Wholesale Orders',
  description: 'Corporate gifting, private label and wholesale boutique orders of SIMPBLISS alcohol-free luxury perfume oils.',
  path: '/bulk-orders',
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ type: 'WebPage', name: 'Bulk and Wholesale Orders', description: 'Corporate gifting, private label and wholesale boutique orders of SIMPBLISS alcohol-free luxury perfume oils.', path: '/bulk-orders' }),
          breadcrumbSchema([{ name: 'Bulk orders', path: '/bulk-orders' }]),
        ]}
      />
      {children}
      <FaqSection faqs={BULK} />
    </>
  );
}
