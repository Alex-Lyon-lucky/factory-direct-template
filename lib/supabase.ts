// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';

// 严格区分：服务端用 Service Role，客户端用 Anon
const isServer = typeof window === 'undefined';
const supabaseKey = isServer 
  ? (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) 
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (isServer && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('[WARNING] SUPABASE_SERVICE_ROLE_KEY is missing. Writing to DB might fail!');
}

export const supabase = createClient(supabaseUrl, supabaseKey || 'placeholder-key');

/** 字段映射工具：处理数据库 snake_case 到前端 camelCase 的转换 */
export const mapToFrontend = (data: any): any => {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(item => mapToFrontend(item));
  const mapped: any = {};
  
  // 核心映射关系
  const mapping: any = {
    seo_slug: 'seoSlug',
    seo_title: 'seoTitle',
    seo_description: 'seoDescription',
    sort_order: 'sortOrder',
    product_type: 'productType',
    site_name: 'siteName',
    footer_text: 'footerText',
    // 兼容旧的可能存在的全小写
    seoslug: 'seoSlug',
    seotitle: 'seoTitle',
    seodescription: 'seoDescription'
  };

  for (const key in data) {
    const newKey = mapping[key] || key;
    mapped[newKey] = data[key];
  }
  return mapped;
};

/** 字段映射工具：处理前端 camelCase 到数据库 snake_case 的转换 */
export const mapToDB = (data: any): any => {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(item => mapToDB(item));
  const mapped: any = {};
  
  // 转换 camelCase 为 snake_case
  const toSnake = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

  for (const key in data) {
    // 排除已手动处理的字段或保留原始 ID
    if (key === 'id') {
      mapped[key] = data[key];
    } else {
      mapped[toSnake(key)] = data[key];
    }
  }
  return mapped;
};
