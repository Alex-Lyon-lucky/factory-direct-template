// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh(); // Ensure layout updates
      } else {
        const data = await res.json();
        setError(data.message || 'Login Failed');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-['Microsoft_YaHei']">
      <div className="max-w-md w-full bg-white rounded-[48px] shadow-2xl p-12 border border-slate-100 animate-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-6 shadow-xl shadow-blue-100">HF</div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">Admin Login</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-4">Hangfan Industrial OS v2.4</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <input
              type="password"
              placeholder="ENTRY PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black uppercase text-xs tracking-widest focus:ring-4 ring-blue-500/10 shadow-inner"
              required
            />
            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN TO OS'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Authorised Personnel Only</p>
        </div>
      </div>
    </div>
  );
}
