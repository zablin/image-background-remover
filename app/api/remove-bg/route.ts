import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { image } = await req.json();
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key 未配置' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        image_file_b64: image.split(',')[1],
        size: 'auto',
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: err.errors?.[0]?.title || '移除失败' }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    
    return NextResponse.json({ result: `data:image/png;base64,${base64}` });
  } catch (err) {
    return NextResponse.json({ error: '服务端错误，请重试' }, { status: 500 });
  }
}
