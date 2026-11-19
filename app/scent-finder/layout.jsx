import JsonLd from '../../components/JsonLd';
import FaqSection from '../../components/FaqSection';
import { SCENT_FINDER } from '../../lib/faq';
import { webPageSchema, breadcrumbSchema } from '../../lib/schema';
import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({
  title: 'Scent Finder',
  description: 'Answer three questions and discover which SIMPBLISS perfume oil family suits your mood: oud and woody, floral, oriental and gourmand, or musk and amber.',
  path: '/scent-finder',
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ type: 'WebPage', name: 'Scent Finder', description: 'Answer three questions and discover which SIMPBLISS perfume oil family suits your mood: oud and woody, floral, oriental and gourmand, or musk and amber.', path: '/scent-finder' }),
          breadcrumbSchema([{ name: 'Scent finder', path: '/scent-finder' }]),
        ]}
      />
      {children}
      <FaqSection faqs={SCENT_FINDER} />
    </>
  );
}
