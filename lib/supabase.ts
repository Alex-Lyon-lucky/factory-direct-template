// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';

// 关键逻辑：如果是服务器端，优先使用 SERVICE_ROLE_KEY 以获得最高权限
const isServer = typeof window === 'undefined';
const supabaseKey = (isServer ? process.env.SUPABASE_SERVICE_ROLE_KEY : null) || 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Utility to map Supabase lowercase fields back to CamelCase for Frontend
 */
export const mapToFrontend = (data: any): any => {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(item => mapToFrontend(item));
  
  const mapped: any = {};
  const mapping: any = {
    // Products & News
    seotitle: 'seoTitle',
    seodescription: 'seoDescription',
    seoslug: 'seoSlug',
    // Inquiries
    producttype: 'productType',
    // Settings
    sitename: 'siteName',
    sitedescription: 'siteDescription',
    seokeywords: 'seoKeywords',
    contactemail: 'contactEmail',
    contactphone: 'contactPhone',
    footertext: 'footerText'
  };

  for (const key in data) {
    const newKey = mapping[key] || key;
    mapped[newKey] = data[key];
  }
  return mapped;
};

/**
 * Utility to map Frontend CamelCase fields to lowercase for Supabase
 */
export const mapToDB = (data: any): any => {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(item => mapToDB(item));
  
  const mapped: any = {};
  for (const key in data) {
    mapped[key.toLowerCase()] = data[key];
  }
  return mapped;
};
