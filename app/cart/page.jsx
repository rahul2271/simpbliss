import { redirect } from 'next/navigation';
import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({ title: 'Cart', path: '/cart', noindex: true });

// The cart lives in the slide-out drawer; this route just sends visitors home.
export default function CartPage() {
  redirect('/collections/all');
}
