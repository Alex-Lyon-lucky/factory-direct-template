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

/** 字段映射工具 */
export const mapToFrontend = (data: any): any => {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(item => mapToFrontend(item));
  const mapped: any = {};
  const mapping: any = {
    producttype: 'productType',
    seotitle: 'seoTitle',
    seodescription: 'seoDescription',
    seoslug: 'seoSlug',
    sitename: 'siteName',
    sitedescription: 'siteDescription',
    seokeywords: 'seoKeywords',
    contactemail: 'contactEmail',
    contactphone: 'contactPhone',
    footertext: 'footerText',
  };
  for (const key in data) {
    const newKey = mapping[key] || key;
    mapped[newKey] = data[key];
  }
  return mapped;
};

export const mapToDB = (data: any): any => {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(item => mapToDB(item));
  const mapped: any = {};
  for (const key in data) {
    mapped[key.toLowerCase()] = data[key];
  }
  return mapped;
};
