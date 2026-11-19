import { shopifyFetch } from '../../../../lib/shopify';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import JsonLd from '../../../../components/JsonLd';
import FaqSection from '../../../../components/FaqSection';
import { JOURNAL } from '../../../../lib/faq';
import { articleSchema, breadcrumbSchema } from '../../../../lib/schema';
import { buildMetadata, truncate } from '../../../../lib/seo';

const ARTICLE_QUERY = `
  query getArticle($blogHandle: String!, $articleHandle: String!) {
    blogByHandle(handle: $blogHandle) {
      title
      articleByHandle(handle: $articleHandle) {
        title
        excerpt
        seo { title description }
        contentHtml
        publishedAt
        image {
          url
          altText
        }
        authorV2 {
          name
        }
      }
    }
  }
`;

const getArticle = cache(async (blog, articleHandle) => {
  const { body } = await shopifyFetch({
    query: ARTICLE_QUERY,
    variables: { blogHandle: blog, articleHandle },
  });
  const blogData = body?.data?.blogByHandle;
  return { article: blogData?.articleByHandle || null, blogTitle: blogData?.title || 'Journal' };
});

export async function generateMetadata({ params }) {
  const { blog, article: articleHandle } = await params;
  const { article } = await getArticle(blog, articleHandle);
  if (!article) return { title: 'Article not found', robots: { index: false, follow: false } };

  return buildMetadata({
    title: article.seo?.title || article.title,
    description: article.seo?.description || article.excerpt || article.title,
    path: `/blogs/${blog}/${articleHandle}`,
    type: 'article',
    image: article.image ? { url: article.image.url, alt: article.image.altText || article.title } : undefined,
  });
}

export default async function ArticlePage({ params }) {
  const { blog, article: articleHandle } = await params;
  const { article, blogTitle } = await getArticle(blog, articleHandle);

  if (!article) notFound(); // real 404 so search engines drop dead URLs

  const path = `/blogs/${blog}/${articleHandle}`;

  const date = new Date(article.publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
    <JsonLd data={[
      articleSchema({ article, blog, handle: articleHandle, path }),
      breadcrumbSchema([{ name: 'The Journal', path: '/blogs' }, { name: article.title, path }]),
    ]} />
    <div className="bg-[#FCFBFC] min-h-screen text-[#15091C] pt-[140px] md:pt-[180px] pb-32 selection:bg-[#C8A97E] selection:text-white">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        
        {/* Breadcrumb / Category */}
        <div className="flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.4em] text-[#C8A97E] font-medium mb-10">
          <Link href="/blogs" className="hover:text-[#15091C] transition-colors">Chronicles</Link>
          <span>/</span>
          <span>{blogTitle}</span>
        </div>

        {/* Article Title */}
        <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-serif italic tracking-tight text-[#15091C] mb-8 leading-[1.1] text-center max-w-4xl mx-auto">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="flex justify-center items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-[#15091C]/50 mb-16">
          <span>{date}</span>
          {article.authorV2?.name && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#15091C]/20"></span>
              <span>By {article.authorV2.name}</span>
            </>
          )}
        </div>

        {/* Featured Image */}
        {article.image && (
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-[#F4F3F5] mb-20 rounded-sm shadow-[0_20px_60px_rgba(21,9,28,0.05)]">
            <Image 
              src={article.image.url} 
              alt={article.image.altText || article.title} 
              fill 
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article HTML Content - Enhanced Prose Typography */}
        <div className="max-w-[800px] mx-auto">
          <article 
            className="prose prose-lg md:prose-xl max-w-none font-light text-[#15091C]/80 leading-[2.2] 
              prose-headings:font-serif prose-headings:italic prose-headings:text-[#15091C] prose-headings:font-normal prose-headings:tracking-tight
              prose-p:mb-8 prose-p:tracking-wide
              prose-img:rounded-sm prose-img:my-16 prose-img:shadow-[0_10px_40px_rgba(21,9,28,0.05)]
              prose-a:text-[#C8A97E] prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-[#15091C]
              prose-blockquote:border-l-[#C8A97E] prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-[#15091C]
              prose-strong:text-[#15091C] prose-strong:font-medium"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          >
          </article>

          {/* Back to Blog */}
          <div className="mt-32 pt-12 border-t border-[#15091C]/10 flex justify-center items-center">
            <Link href="/blogs" className="group inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-medium text-[#15091C] hover:text-[#C8A97E] transition-colors duration-500">
              <span className="w-8 h-[1px] bg-[#15091C] group-hover:w-12 group-hover:bg-[#C8A97E] transition-all duration-500"></span>
              <span>Back to All Chronicles</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
    <FaqSection faqs={JOURNAL} />
    </>
  );
}