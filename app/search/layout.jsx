import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({ title: 'Search', path: '/search', noindex: true });

export default function Layout({ children }) {
  return children;
}
