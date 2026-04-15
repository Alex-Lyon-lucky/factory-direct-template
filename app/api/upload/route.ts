// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 使用 await 获取 promise 的值，避免直接返回 promise
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'highfasteners' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error details:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    }).catch(err => {
      throw new Error(`Cloudinary Upload Failed: ${err.message || 'Unknown Error'}`);
    });

    return NextResponse.json({ 
      url: result?.secure_url,
      public_id: result?.public_id
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
