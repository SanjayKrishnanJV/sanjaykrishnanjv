import { NextResponse } from 'next/server';
import { fetchGitHubContributions } from '@/lib/github';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'SanjayKrishnanJV';

  try {
    const contributions = await fetchGitHubContributions(username);

    return NextResponse.json({
      success: true,
      data: contributions,
      username,
    });
  } catch (error) {
    console.error('Error in contributions API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contributions',
        data: [],
      },
      { status: 500 }
    );
  }
}
