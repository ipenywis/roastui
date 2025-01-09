import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const GET = async (request: NextRequest) => {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('URL is required', { status: 400 });
  }

  const { data, headers: axiosHeaders, status } = await axios.get(url);

  const headers = new Headers();
  for (const [key, value] of Object.entries(axiosHeaders)) {
    if (key === 'content-encoding' || key === 'connection') continue;
    headers.set(key, value);
  }

  return new NextResponse(data, { headers, status });
};
