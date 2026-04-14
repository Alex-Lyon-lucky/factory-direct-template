// app/context/ProductContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Category {
  id: number;
  name: string;
  value: string;
}

interface Product {
  id: number;
  name: string;
  cat: string;
  img: string;
  spec: string;
  description: string;
}

interface ProductContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Bolts & Screws', value: 'Bolt' },
    { id: 2, name: 'Industrial Nuts', value: 'Nut' },
    { id: 3, name: 'Spring Washers', value: 'Washer' },
    { id: 4, name: 'Hose Clamps', value: 'Clamp' },
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "GB93 Spring Washer",
      cat: "Washer",
      img: "https://images.unsplash.com/photo-1530124560677-bdaea024f061?auto=format&fit=crop&q=80&w=600",
      spec: "M2 - M48",
      description: "Heavy-duty spring washers made of 65Mn steel.",
    },
    {
      id: 2,
      name: "DIN933 Hex Bolt",
      cat: "Bolt",
      img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
      spec: "Grade 8.8 / 10.9",
      description: "High tensile hexagon head bolts.",
    },
  ]);

  return (
    <ProductContext.Provider value={{ categories, setCategories, products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};