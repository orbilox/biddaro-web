export const dynamic = 'force-dynamic';

export async function GET() {
  const apiUrl    = process.env.NEXT_PUBLIC_API_URL;
  const cronSecret = process.env.CRON_SECRET;

  if (!apiUrl || !cronSecret) {
    return Response.json({ error: 'Missing NEXT_PUBLIC_API_URL or CRON_SECRET' }, { status: 500 });
  }

  const res = await fetch(`${apiUrl}/api/v1/loans/reminders/process`, {
    method: 'POST',
    headers: {
      'Content-Type':   'application/json',
      'x-cron-secret':  cronSecret,
    },
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
