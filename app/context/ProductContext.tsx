// app/context/ProductContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Category {
  id: number;
  name: string;
  value: string;
  sort_order?: number;
}

export interface Product {
  id: number;
  name: string;
  cat: string;
  img: string;
  gallery?: string[];
  spec: string;
  description: string;
  price?: string;
  stock?: string;
  keywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoSlug?: string;
  alt?: string;
  sortOrder?: number;
  summary?: string;
  specs?: { key: string; value: string }[];
  companyProfile?: string;
  technicalDrawings?: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  day: string;
  month: string;
  author: string;
  img: string;
  views: string;
  keywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoSlug?: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  date: string;
  status: string;
  productType?: string;
  attachment?: string;
}

export interface MaterialAsset {
  id: number;
  url: string;
  name: string;
  type: string;
  date: string;
  category?: string;
  hash?: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  seoKeywords: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  whatsapp: string;
}

export interface PageContent {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    advantages: string[];
    heroImg?: string;
  };
  about: {
    title: string;
    content: string;
    heroImg?: string;
    headerHeight?: number;
    bgMode?: string;
    bgColor?: string;
  };
  contact: {
    title: string;
    description: string;
    headerHeight?: number;
    bgMode?: string;
    bgColor?: string;
  };
  inquiry: {
    title: string;
    subtitle?: string;
    headerHeight?: number;
    bgMode?: string;
    bgColor?: string;
  };
  products: {
    title: string;
    subtitle?: string;
    headerHeight?: number;
    bgMode?: string;
    bgColor?: string;
  };
  news: {
    title: string;
    subtitle?: string;
    headerHeight?: number;
    bgMode?: string;
    bgColor?: string;
  };
}

interface ProductContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  news: NewsArticle[];
  setNews: React.Dispatch<React.SetStateAction<NewsArticle[]>>;
  materials: MaterialAsset[];
  inquiries: Inquiry[];
  settings: SiteSettings | null;
  pages: PageContent | null;
  refreshData: () => Promise<void>;
  deleteProduct: (id: number) => Promise<boolean>;
  deleteNews: (id: number) => Promise<boolean>;
  deleteInquiry: (id: number) => Promise<boolean>;
  deleteMaterial: (id: number) => Promise<boolean>;
  updateProduct: (product: Product) => Promise<boolean>;
  updateNews: (article: NewsArticle) => Promise<boolean>;
  updateMaterial: (material: MaterialAsset) => Promise<boolean>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [materials, setMaterials] = useState<MaterialAsset[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [pages, setPages] = useState<PageContent | null>(null);

  const refreshData = async () => {
    try {
      const [catRes, prodRes, newsRes, inqRes, setRes, pageRes, matRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products'),
        fetch('/api/news'),
        fetch('/api/inquiry'),
        fetch('/api/settings'),
        fetch('/api/pages'),
        fetch('/api/materials')
      ]);
      const [catData, prodData, newsData, inqData, setData, pageData, matData] = await Promise.all([
        catRes.json(),
        prodRes.json(),
        newsRes.json(),
        inqRes.json(),
        setRes.json(),
        pageRes.json(),
        matRes.json()
      ]);
      setCategories(catData);
      setProducts(prodData);
      setNews(newsData);
      setInquiries(inqData);
      setSettings(setData);
      setPages(pageData);
      setMaterials(matData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const deleteNews = async (id: number) => {
    try {
      const res = await fetch('/api/news', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setNews(news.filter(n => n.id !== id));
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const deleteInquiry = async (id: number) => {
    try {
      const res = await fetch('/api/inquiry', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setInquiries(inquiries.filter(i => i.id !== id));
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const deleteMaterial = async (id: number) => {
    try {
      const res = await fetch('/api/materials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setMaterials(materials.filter(m => m.id !== id));
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const updateProduct = async (product: Product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === product.id ? product : p));
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const updateNews = async (article: NewsArticle) => {
    try {
      const res = await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      });
      if (res.ok) {
        setNews(news.map(n => n.id === article.id ? article : n));
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const updateMaterial = async (material: MaterialAsset) => {
    try {
      const res = await fetch('/api/materials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material)
      });
      if (res.ok) {
        setMaterials(materials.map(m => m.id === material.id ? material : m));
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <ProductContext.Provider value={{ 
      categories, setCategories, 
      products, setProducts, 
      news, setNews, 
      materials,
      inquiries,
      settings,
      pages,
      refreshData, 
      deleteProduct, deleteNews, deleteInquiry, deleteMaterial,
      updateProduct, updateNews, updateMaterial
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};
