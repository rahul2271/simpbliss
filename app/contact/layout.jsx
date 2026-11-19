import JsonLd from '../../components/JsonLd';
import FaqSection from '../../components/FaqSection';
import { CONTACT } from '../../lib/faq';
import { webPageSchema, breadcrumbSchema } from '../../lib/schema';
import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({
  title: 'Contact Us',
  description: 'Reach the SIMPBLISS team by email, phone or WhatsApp. Available Monday to Saturday, 10 AM to 7 PM IST, with replies within 24 hours.',
  path: '/contact',
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ type: 'ContactPage', name: 'Contact Us', description: 'Reach the SIMPBLISS team by email, phone or WhatsApp. Available Monday to Saturday, 10 AM to 7 PM IST, with replies within 24 hours.', path: '/contact' }),
          breadcrumbSchema([{ name: 'Contact', path: '/contact' }]),
        ]}
      />
      {children}
      <FaqSection faqs={CONTACT} />
    </>
  );
}
