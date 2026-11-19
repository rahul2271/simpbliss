import './globals.css';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import NavbarClient from '../components/NavbarClient';
import Footer from '../components/Footer';
import { CartProvider } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';
import SmoothScroll from '../components/SmoothScroll';
import Preloader from '../components/Preloader';
import JsonLd from '../components/JsonLd';
import { getMenu } from '../lib/shopify';
import { SITE, abs } from '../lib/seo';
import { organizationSchema, websiteSchema } from '../lib/schema';

// Display: Cormorant Garamond — high-contrast, couture-feeling serif.
// Body: Jost — geometric, light, quiet. Both self-hosted by next/font.
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const body = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: abs('/') },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: SITE.locale,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    url: abs('/'),
    images: [{ url: abs(SITE.ogImage), width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [abs(SITE.ogImage)],
  },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: '#15091C' };

export default async function RootLayout({ children }) {
  // Main navigation menu (with nested dropdown items) from Shopify
  const menuItems = await getMenu('main-menu');

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased bg-brand-dark">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <SmoothScroll />
        <Preloader />
        <CartProvider>
          <NavbarClient menuItems={menuItems} />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
