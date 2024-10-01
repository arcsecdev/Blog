import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request: Request) {
  console.log('POST request received for /api/add');
  try {
    const { title, content, author } = await request.json();

    if (!title || !content || !author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const body = JSON.stringify({
      dbId: process.env.ARCSEC_DB_ID,
      query: `INSERT INTO blog_posts (title, content, author) VALUES ('${title}', '${content}', '${author}')`,
      walletAddress: process.env.ARCSEC_WALLET_ADDRESS,
      apiKey: process.env.ARCSEC_API_KEY
    });

    console.log('Sending POST request to https://arcsec.dev/api/query');
    const response = await fetch('https://arcsec.dev/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body
    });

    console.log('Received response with status:', response.status);

    if (!response.ok) {
      console.error('Response not OK. Status:', response.status);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Parsed response data:', data);

    console.log('Post added successfully');
    return NextResponse.json({ message: 'Post added successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/posts/add:', error);
    return NextResponse.json({ error: 'Failed to add post: ' + error.message }, { status: 500 });
  }
}