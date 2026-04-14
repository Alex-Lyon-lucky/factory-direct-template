# High Fasteners Production Migration Guide (航帆生产环境迁移指南)

To move this project from local JSON to a professional server-less environment (Vercel + Supabase + Cloudinary), follow these 3 steps.

### **STEP 1: Register Free Services (注册免费服务)**
1.  **Vercel (Hosting)**: [vercel.com](https://vercel.com) - Link your GitHub repo here for automatic global deployment.
2.  **Supabase (Database)**: [supabase.com](https://supabase.com) - Create a new project. You will get a **URL** and **Anon Key**.
3.  **Cloudinary (Images)**: [cloudinary.com](https://cloudinary.com) - Create an account. You need the **Cloud Name**, **API Key**, and **API Secret**.

---

### **STEP 2: Setup Environment Variables (配置环境变量)**
Create a file named `.env.local` in your project root (or add these to Vercel dashboard):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary Configuration (Server-side)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### **STEP 3: Database Schema (数据库结构)**
Run this SQL in your **Supabase SQL Editor** to create the tables matching our JSON structure:

```sql
-- 1. Create Categories Table
CREATE TABLE categories (
  id BIGINT PRIMARY KEY,
  name TEXT,
  value TEXT
);

-- 2. Create Products Table
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  name TEXT,
  cat TEXT,
  img TEXT,
  gallery TEXT[] DEFAULT '{}',
  spec TEXT,
  description TEXT,
  price TEXT,
  stock TEXT,
  keywords TEXT[] DEFAULT '{}',
  seoTitle TEXT,
  seoDescription TEXT,
  seoSlug TEXT,
  alt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create News Table
CREATE TABLE news (
  id BIGINT PRIMARY KEY,
  title TEXT,
  content TEXT,
  category TEXT,
  img TEXT,
  date TEXT,
  day TEXT,
  month TEXT,
  author TEXT,
  views TEXT,
  excerpt TEXT,
  keywords TEXT[] DEFAULT '{}',
  seoTitle TEXT,
  seoDescription TEXT,
  seoSlug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Materials Table
CREATE TABLE materials (
  id BIGINT PRIMARY KEY,
  name TEXT,
  url TEXT,
  type TEXT,
  date DATE DEFAULT CURRENT_DATE
);

-- 5. Create Inquiries Table
CREATE TABLE inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  message TEXT,
  productType TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Settings Table
CREATE TABLE settings (
  id INT PRIMARY KEY DEFAULT 1,
  siteName TEXT,
  contactEmail TEXT,
  whatsapp TEXT,
  wechat TEXT,
  footerText TEXT,
  socials JSONB
);

-- 7. Create Pages Table
CREATE TABLE pages (
  id INT PRIMARY KEY DEFAULT 1,
  home JSONB,
  about JSONB,
  contact JSONB,
  products JSONB,
  news JSONB,
  inquiry JSONB
);
```

---

### **PRODUCTION READY (已支持云端适配)**
1.  **Dual-Mode API**: All `/api/*` routes now automatically switch to Supabase if the environment variables are detected.
2.  **Image Uploading**: The **Material Library** now supports direct file uploads to **Cloudinary**.
3.  **Deployment**: Simply push this code to GitHub and link it to Vercel.
