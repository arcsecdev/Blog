import { baseUrl } from 'app/sitemap'
import fetch from 'node-fetch'

interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  published_at: string;
  slug: string;
}

interface ApiResponse {
  result?: BlogPost[];
}

export async function GET() {
  try {
    const body = JSON.stringify({
      dbId: process.env.ARCSEC_DB_ID,
      query: 'SELECT * FROM blog_posts',
      walletAddress: process.env.ARCSEC_WALLET_ADDRESS,
      apiKey: process.env.ARCSEC_API_KEY
    });

    const response = await fetch('https://arcsec.dev/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as ApiResponse;
    const posts = data.result || [];

    const itemsXml = posts
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .map(
        (post) =>
          `<item>
            <title>${post.title}</title>
            <link>${baseUrl}/blog/${post.slug}</link>
            <description>${post.summary || ''}</description>
            <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
          </item>`
      )
      .join('\n')

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
          <title>My Arcsec Blog</title>
          <link>${baseUrl}</link>
          <description>This is my blog RSS feed</description>
          ${itemsXml}
      </channel>
    </rss>`

    return new Response(rssFeed, {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
