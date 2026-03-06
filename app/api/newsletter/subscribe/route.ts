import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/newsletter';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, tags } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required',
        },
        { status: 400 }
      );
    }

    const result = await subscribeToNewsletter(email, name, tags);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
