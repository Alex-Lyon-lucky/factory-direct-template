// app/api/config/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'hf-secret-key-2026';
    const sessionCookie = cookieStore.get('admin_session');

    // 鉴权：只有登录的管理员才能查看这些敏感配置
    if (!sessionCookie || sessionCookie.value !== sessionSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configs = [
      { key: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL, desc: 'Supabase 数据库 API 地址' },
      { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, desc: 'Supabase 公共匿名访问密钥' },
      { key: 'CLOUDINARY_CLOUD_NAME', value: process.env.CLOUDINARY_CLOUD_NAME, desc: 'Cloudinary 云端名称' },
      { key: 'CLOUDINARY_API_KEY', value: process.env.CLOUDINARY_API_KEY, desc: 'Cloudinary API 标识符' },
      { key: 'CLOUDINARY_API_SECRET', value: process.env.CLOUDINARY_API_SECRET, desc: 'Cloudinary API 密钥 (敏感)' },
      { key: 'ADMIN_PASSWORD', value: process.env.ADMIN_PASSWORD, desc: '后台管理登录密码' },
      { key: 'ADMIN_SESSION_SECRET', value: process.env.ADMIN_SESSION_SECRET, desc: '系统会话加密秘钥' },
    ];

    return NextResponse.json(configs);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
