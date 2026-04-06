import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { image } = await req.json();
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key 未配置' }, { status: 500 });
  }

<<<<<<< HEAD
  try {
=======
export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()
    
    if (!image) {
      return NextResponse.json({ error: '缺少图片' }, { status: 400 })
    }

    const apiKey = process.env.REMOVE_BG_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key 未配置' }, { status: 500 })
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')

    const formData = new FormData()
    formData.append('image_file_b64', base64Data)
    formData.append('size', 'auto')

>>>>>>> 2cb4008409349210b0b993b133af427a906287fe
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
<<<<<<< HEAD
      const err = await response.json();
      return NextResponse.json({ error: err.errors?.[0]?.title || '移除失败' }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    
    return NextResponse.json({ result: `data:image/png;base64,${base64}` });
  } catch (err) {
    return NextResponse.json({ error: '服务端错误，请重试' }, { status: 500 });
=======
      const errorText = await response.text()
      throw new Error(`Remove.bg API 调用失败: ${errorText}`)
    }

    const resultBuffer = await response.arrayBuffer()
    const bytes = new Uint8Array(resultBuffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    const resultBase64 = btoa(binary)
    
    return NextResponse.json({ 
      result: `data:image/png;base64,${resultBase64}` 
    })
  } catch (error) {
    console.error('Remove bg error:', error)
    return NextResponse.json({ error: '处理失败' }, { status: 500 })
>>>>>>> 2cb4008409349210b0b993b133af427a906287fe
  }
}
