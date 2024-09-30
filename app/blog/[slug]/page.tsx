import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'

// Remove the baseUrl import if it's not defined elsewhere
// import { baseUrl } from 'app/sitemap'

// Define baseUrl here if it's not imported
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'long' });
  const shortMonth = month.length > 5 ? date.toLocaleString('en-US', { month: 'short' }) : month;
  return `${shortMonth} ${date.getDate()}, ${date.getFullYear()}`;
}

export async function generateStaticParams() {
  const res = await fetch(`${baseUrl}/api/posts`);
  const posts = await res.json();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const res = await fetch(`${baseUrl}/api/posts`);
  const posts = await res.json();
  const post = posts.find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  const { title, published_at: publishedTime, summary: description } = post;
  // Remove the image variable as it's not defined in the post object
  const ogImage = `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({ params }) {
  const res = await fetch(`${baseUrl}/api/posts`);
  const posts = await res.json();
  const post = posts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.published_at,
            dateModified: post.published_at,
            description: post.summary,
            image: `${baseUrl}/og?title=${encodeURIComponent(post.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio',
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.published_at)}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
