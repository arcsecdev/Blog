import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET() {
  console.log('GET request received for /api/get-posts');
  try {
    const body = JSON.stringify({
      dbId: process.env.ARCSEC_DB_ID,
      query: 'SELECT * FROM blog_posts',
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

    // Add type assertion for data
    const typedData = data as { result?: unknown[] };

    if (!typedData.result || typedData.result.length === 0) {
      console.log('No posts found, returning empty array');
      return NextResponse.json([]);
    }

    console.log('Returning result array');
    return NextResponse.json(typedData.result);
  } catch (error) {
    console.error('Error in GET /api/get-posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts: ' + error.message }, { status: 500 });
  }
}