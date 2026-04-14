// app/layout.tsx

import type { Metadata } from "next";

import { ProductProvider } from './context/ProductContext';

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";



const geistSans = Geist({

  variable: "--font-geist-sans",

  subsets: ["latin"],

  weight: ["400", "500", "600", "700", "900"],

});



const geistMono = Geist_Mono({

  variable: "--font-geist-mono",

  subsets: ["latin"],

  weight: ["400", "700"],

});



export const metadata: Metadata = {

  title: 'High Fasteners | Global Industrial Solution',

  description: 'Hangfan specializes in high-precision fasteners and custom hardware. Direct factory excellence for bolts, nuts, washers, hose clamps. DIN/ISO/GB standards, fast global shipping to Europe & USA.',

  keywords: ['fasteners', 'bolts', 'nuts', 'washers', 'hose clamps', 'custom OEM', 'DIN 933', 'GB93', 'spring washers', 'industrial hardware', 'China manufacturer'],

  authors: [{ name: 'Hangfan Fasteners' }],

  openGraph: {

    title: 'High Fasteners | Global Industrial Solution',

    description: 'Direct factory of high-precision fasteners for global trade. Bolts, Nuts, Washers, Hose Clamps & Custom OEM.',

    images: [

      {

        url: 'https://images.unsplash.com/photo-1530124560677-bdaea024f061',

        width: 1200,

        height: 630,

      },

    ],

    locale: 'en_US',

    type: 'website',

  },

  icons: {

    icon: '/favicon.ico',

  },

};



export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <html

      lang="en"

      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}

    >

      <head>

        {/* Font Awesome 图标库 - 让所有 fas fa- 图标正常显示 */}

        <link

          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"

          rel="stylesheet"

        />

      </head>

      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <ProductProvider>   {/* ← 新增这一行 */}
          {children}
        </ProductProvider>
      </body>

    </html>

  );

}