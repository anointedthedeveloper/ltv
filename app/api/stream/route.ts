import { NextRequest, NextResponse } from 'next/server';

/**
 * Stream proxy API
 * Proxies IPTV streams to bypass CORS restrictions
 * Usage: /api/stream?url=<encoded_stream_url>
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const streamUrl = searchParams.get('url');

    if (!streamUrl) {
      return NextResponse.json(
        { error: 'Stream URL is required' },
        { status: 400 }
      );
    }

    // Decode the URL
    const decodedUrl = decodeURIComponent(streamUrl);

    // Validate URL is actually a stream URL
    if (
      !decodedUrl.includes('.m3u8') &&
      !decodedUrl.includes('.m3u') &&
      !decodedUrl.includes('.ts') &&
      !decodedUrl.includes('.mp4')
    ) {
      return NextResponse.json(
        { error: 'Invalid stream URL' },
        { status: 400 }
      );
    }

    // Fetch the stream with proper headers
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://example.com/',
        'Origin': 'https://example.com',
      },
      // Handle redirects
      redirect: 'follow',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Stream server returned ${response.status}` },
        { status: response.status }
      );
    }

    // Get the content type
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Create response with proper CORS headers
    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[Stream Proxy Error]', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch stream',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
