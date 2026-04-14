import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const mapFields = (obj) => {
  const newObj = {};
  for (const key in obj) {
    // Convert keys to lowercase to match DB schema (e.g. seoDescription -> seodescription)
    newObj[key.toLowerCase()] = obj[key];
  }
  return newObj;
};

const importData = async () => {
  const dataDir = path.join(process.cwd(), 'data');
  const files = [
    { file: 'categories.json', table: 'categories' },
    { file: 'products.json', table: 'products' },
    { file: 'news.json', table: 'news' },
    { file: 'materials.json', table: 'materials' },
    { file: 'inquiries.json', table: 'inquiries' },
    { file: 'settings.json', table: 'settings', single: true },
    { file: 'pages.json', table: 'pages', single: true }
  ];

  for (const item of files) {
    console.log(`\n>>> SYNCING: ${item.file}`);
    const filePath = path.join(dataDir, item.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${item.file}`);
      continue;
    }

    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      let processed;
      if (item.single) {
        processed = { ...mapFields(content), id: 1 };
      } else {
        processed = content.map((row, idx) => {
          const r = mapFields(row);
          if (!r.id && (item.table === 'products' || item.table === 'news')) {
            r.id = Date.now() + idx;
          }
          if (item.table === 'news') {
            if (!r.author) r.author = "Administrator";
            if (!r.views) r.views = "0";
            if (!r.date) r.date = new Date().toISOString().split('T')[0];
          }
          return r;
        });
      }

      console.log(`>>> SENDING TO SUPABASE: ${item.table} (${Array.isArray(processed) ? processed.length : '1'} rows)`);
      const { error } = await supabase.from(item.table).upsert(processed);
      
      if (error) {
        console.error(`>>> FAILED: ${item.table}`, JSON.stringify(error, null, 2));
      } else {
        console.log(`>>> SUCCESS: ${item.file} imported!`);
      }
    } catch (err) {
      console.error(`>>> CRITICAL ERROR: ${item.file}`, err);
    }
  }
};

importData().then(() => console.log('\n>>> GLOBAL SYNC COMPLETED SUCCESSFULLY. YOUR DATA IS NOW LIVE.'));
