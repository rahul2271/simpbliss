import { shopifyFetch } from '../../lib/shopify';
import Link from 'next/link';
import Image from 'next/image';
import JsonLd from '../../components/JsonLd';
import FaqSection from '../../components/FaqSection';
import { JOURNAL } from '../../lib/faq';
import { blogListSchema, breadcrumbSchema } from '../../lib/schema';
import { buildMetadata } from '../../lib/seo';

export const metadata = buildMetadata({
  title: 'The Journal',
  description: 'Stories on rare botanicals, traditional Indian distillation and the care of alcohol-free perfume oils, from SIMPBLISS.',
  path: '/blogs',
});

const BLOGS_QUERY = `
  query getBlogs {
    blogs(first: 10) {
      edges {
        node {
          id
          title
          handle
          articles(first: 5) {
            edges {
              node {
                id
                title
                handle
                publishedAt
                excerpt
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default async function BlogsPage() {
  const { body } = await shopifyFetch({ query: BLOGS_QUERY });
  const blogs = body?.data?.blogs?.edges || [];

  return (
    <>
    <JsonLd data={[
      blogListSchema({ path: '/blogs', blogs: blogs.map((b) => b.node) }),
      breadcrumbSchema([{ name: 'The Journal', path: '/blogs' }]),
    ]} />
    <div className="bg-[#FCFBFC] min-h-screen text-[#15091C] pt-[140px] md:pt-[180px] pb-32 selection:bg-[#C8A97E] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-[#C8A97E]/30"></span>
            <span className="text-[#C8A97E] text-[9px] md:text-[11px] uppercase tracking-[0.5em] font-medium">
              The Journal
            </span>
            <span className="w-12 h-[1px] bg-[#C8A97E]/30"></span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-[#15091C] mb-8 leading-[1.1]">
            Olfactory Chronicles
          </h1>
          <p className="text-sm md:text-base font-light text-[#15091C]/60 tracking-wide leading-[1.9] max-w-2xl mx-auto">
            Explore the heritage of rare botanicals, traditional distillation artistry, and the deep emotional cadence of pure perfume oils.
          </p>
        </div>

        {/* Blogs & Articles Feed */}
        {blogs.length === 0 ? (
          <div className="text-center py-20 text-[#15091C]/40 uppercase tracking-[0.3em] text-[10px]">
            No journal entries found.
          </div>
        ) : (
          <div className="space-y-32">
            {blogs.map(({ node: blog }) => {
              const articles = blog.articles?.edges || [];
              if (articles.length === 0) return null;

              return (
                <div key={blog.id} className="space-y-12">
                  <div className="border-b border-[#15091C]/10 pb-6 flex justify-between items-end">
                    <h2 className="text-3xl md:text-4xl font-serif italic text-[#15091C]">{blog.title}</h2>
                    <span className="text-[9px] uppercase tracking-[0.4em] text-[#C8A97E] font-medium">{articles.length} Chapters</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {articles.map(({ node: article }) => {
                      const date = new Date(article.publishedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });

                      return (
                        <Link 
                          key={article.id} 
                          href={`/blogs/${blog.handle}/${article.handle}`} 
                          className="group flex flex-col bg-white border border-[#15091C]/5 overflow-hidden shadow-[0_10px_30px_rgba(21,9,28,0.02)] hover:shadow-[0_20px_50px_rgba(200,169,126,0.12)] transition-all duration-700"
                        >
                          {article.image && (
                            <div className="relative aspect-[16/10] overflow-hidden bg-[#F4F3F5]">
                              <Image 
                                src={article.image.url} 
                                alt={article.image.altText || article.title} 
                                fill 
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                              />
                            </div>
                          )}
                          <div className="p-8 flex flex-col justify-between flex-grow">
                            <div>
                              <span className="text-[8px] uppercase tracking-[0.3em] text-[#C8A97E] block mb-3 font-medium">{date}</span>
                              <h3 className="font-serif text-2xl text-[#15091C] mb-4 group-hover:text-[#C8A97E] transition-colors duration-500 italic tracking-tight line-clamp-2 leading-[1.3]">
                                {article.title}
                              </h3>
                              {article.excerpt && (
                                <p className="text-xs font-light text-[#15091C]/60 line-clamp-3 leading-[1.9] mb-6">
                                  {article.excerpt}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] font-medium text-[#15091C] pt-5 border-t border-[#15091C]/5 group-hover:text-[#C8A97E] transition-colors duration-500">
                              Read Chapter <span className="w-6 h-[1px] bg-[#15091C] group-hover:w-10 group-hover:bg-[#C8A97E] transition-all duration-500"></span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
    <FaqSection faqs={JOURNAL} />
    </>
  );
}