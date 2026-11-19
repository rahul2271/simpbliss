import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({ title: 'Your Account', path: '/account', noindex: true });

export default function Layout({ children }) {
  return children;
}
