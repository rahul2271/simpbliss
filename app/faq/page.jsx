import PageShell from '../../components/PageShell';
import JsonLd from '../../components/JsonLd';
import { FaqList } from '../../components/FaqSection';
import { GENERAL } from '../../lib/faq';
import { faqSchema, webPageSchema, breadcrumbSchema } from '../../lib/schema';
import { buildMetadata } from '../../lib/seo';

const DESC = 'Answers about SIMPBLISS perfume oils: how to apply, how to store, skin suitability, shipping and more.';

export const metadata = buildMetadata({ title: 'FAQ', description: DESC, path: '/faq' });

export default function FaqPage() {
  return (
    <PageShell title="Questions" intro="Everything you may want to know before choosing your oil.">
      <JsonLd data={[
        faqSchema(GENERAL),
        webPageSchema({ type: 'WebPage', name: 'FAQ', description: DESC, path: '/faq' }),
        breadcrumbSchema([{ name: 'FAQ', path: '/faq' }]),
      ]} />
      <FaqList faqs={GENERAL} />
    </PageShell>
  );
}
