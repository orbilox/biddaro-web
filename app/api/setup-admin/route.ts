/**
 * TEMPORARY — delete after use.
 * Calls the Railway API to upsert the super-admin account.
 * Visit GET /api/setup-admin once after deploy, then remove this file.
 */
import { NextResponse } from 'next/server';

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_API_URL is not set' }, { status: 500 });
  }

  try {
    const res = await fetch(`${apiUrl}/api/v1/setup/create-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:    'admin@biddaro.com',
        password: 'Admin@Biddaro2026!',
        secret:   'biddaro_setup_2024',
      }),
    });

    const data = await res.json();
    return NextResponse.json({
      apiUrl,
      httpStatus: res.status,
      result: data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, apiUrl }, { status: 500 });
  }
}
