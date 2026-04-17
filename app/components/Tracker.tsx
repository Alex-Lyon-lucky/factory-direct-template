// app/components/Tracker.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // 排除管理员后台的访问
        if (pathname.startsWith('/admin')) return;

        // 1. 获取用户环境信息
        const userAgent = window.navigator.userAgent;
        let device = 'Desktop';
        if (/Mobi|Android/i.test(userAgent)) device = 'Mobile';
        if (/Tablet|iPad/i.test(userAgent)) device = 'Tablet';

        // 2. 获取地理位置 (使用免费 API 获取国家)
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();

        // 3. 发送数据到我们自己的 API
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: pathname,
            referrer: document.referrer || 'Direct',
            browser: getBrowser(userAgent),
            os: getOS(userAgent),
            device: device,
            country: geoData.country_name || 'Unknown',
            ip: geoData.ip
          })
        });
      } catch (err) {
        console.error('Tracking Error:', err);
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}

function getBrowser(ua: string) {
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Other';
}

function getOS(ua: string) {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone')) return 'iOS';
  return 'Other';
}
