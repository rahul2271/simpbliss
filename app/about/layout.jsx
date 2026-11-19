import JsonLd from '../../components/JsonLd';
import FaqSection from '../../components/FaqSection';
import { ABOUT } from '../../lib/faq';
import { webPageSchema, breadcrumbSchema } from '../../lib/schema';
import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({
  title: 'Our Craft: Traditional Deg-Bhapka Distillation',
  description: 'How SIMPBLISS perfume oils are made: wild-harvested Assam oud, Kannauj Damask rose and Mysore vetiver, distilled in copper stills using the traditional Deg-Bhapka method.',
  path: '/about',
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ type: 'AboutPage', name: 'Our Craft: Traditional Deg-Bhapka Distillation', description: 'How SIMPBLISS perfume oils are made: wild-harvested Assam oud, Kannauj Damask rose and Mysore vetiver, distilled in copper stills using the traditional Deg-Bhapka method.', path: '/about' }),
          breadcrumbSchema([{ name: 'Our craft', path: '/about' }]),
        ]}
      />
      {children}
      <FaqSection faqs={ABOUT} />
    </>
  );
}
