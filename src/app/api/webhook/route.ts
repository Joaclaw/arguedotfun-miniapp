import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/webhook
 *
 * Receives Mini App lifecycle / notification webhooks from the Base App.
 * Currently logs and acknowledges; extend as needed for push-notification
 * delivery, analytics, etc.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic event logging (swap for structured logger in prod)
    console.log('[webhook]', JSON.stringify(body));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }
}
