// app/api/auth/check/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'hf-secret-key-2026';
    const sessionCookie = cookieStore.get('admin_session');

    if (sessionCookie && sessionCookie.value === sessionSecret) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
