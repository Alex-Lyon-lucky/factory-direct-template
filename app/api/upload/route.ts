// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Phase 3: Hash detection for deduplication
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    
    // Check if this hash exists in Supabase
    const { data: existing } = await supabase
      .from('materials')
      .select('url')
      .eq('hash', hash)
      .single();

    if (existing) {
      return NextResponse.json({ 
        url: existing.url,
        isDuplicate: true
      });
    }

    // New file, upload to Cloudinary
    const isVideo = file.type.startsWith('video/');
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'highfasteners',
          resource_type: isVideo ? 'video' : 'image'
        },
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
      public_id: result?.public_id,
      hash: hash
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
