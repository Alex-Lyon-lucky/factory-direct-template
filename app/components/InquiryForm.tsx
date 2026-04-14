// app/components/InquiryForm.tsx
'use client';

import { useState } from 'react';

interface InquiryFormProps {
  productType?: string;
  onSuccess?: () => void;
}

export default function InquiryForm({ productType: initialProductType, onSuccess }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', message: '', productType: initialProductType || 'Standard Bolts'
  });
  const [attachment, setAttachment] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAttachment(data.url);
      } else {
        alert('File upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          attachment,
          date: new Date().toISOString(),
          status: 'New'
        })
      });
      if (res.ok) {
        setSent(true);
        setFormData({ name: '', email: '', phone: '', company: '', message: '', productType: initialProductType || 'Standard Bolts' });
        setAttachment(null);
        if (onSuccess) onSuccess();
      } else {
        alert('Failed to send inquiry.');
      }
    } catch (e) {
      console.error(e);
      alert('Error sending inquiry.');
    }
    setSending(false);
  };

  if (sent) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl mb-8 shadow-2xl shadow-blue-100 rotate-12">
          <i className="fas fa-paper-plane"></i>
        </div>
        <h3 className="text-4xl font-black uppercase text-slate-900 mb-4 tracking-tighter leading-none">Inquiry Received!</h3>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest max-w-xs mx-auto opacity-70">Our sales engineers are processing your request. Check your inbox within 24 hours.</p>
        <button onClick={() => setSent(false)} className="mt-10 bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all">Send Another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.4em] mb-10">Request Project Quotation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input required type="text" placeholder="YOUR NAME" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border-none rounded-[20px] px-8 py-5 font-black uppercase text-[10px] focus:ring-4 ring-blue-500/10 shadow-inner" />
          <input required type="email" placeholder="BUSINESS EMAIL" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border-none rounded-[20px] px-8 py-5 font-black lowercase text-[10px] focus:ring-4 ring-blue-500/10 shadow-inner" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="WHATSAPP / PHONE" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border-none rounded-[20px] px-8 py-5 font-black uppercase text-[10px] focus:ring-4 ring-blue-500/10 shadow-inner" />
          <select value={formData.productType} onChange={e => setFormData({ ...formData, productType: e.target.value })} className="w-full bg-slate-50 border-none rounded-[20px] px-8 py-5 font-black uppercase text-[10px] focus:ring-4 ring-blue-500/10 shadow-inner appearance-none">
            <option>Standard Bolts</option>
            <option>High Strength Nuts</option>
            <option>Custom OEM Parts</option>
            <option>Other Requirements</option>
          </select>
        </div>
        <textarea required rows={5} placeholder="PROJECT REQUIREMENTS..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-slate-50 border-none rounded-[32px] px-8 py-8 font-bold text-slate-700 text-sm focus:ring-4 ring-blue-500/10 shadow-inner" />
        
        {/* Attachment Upload */}
        <div className="relative">
          <label className={`w-full flex items-center justify-center gap-3 px-8 py-5 border-2 border-dashed rounded-[24px] cursor-pointer transition-all ${attachment ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-400 hover:text-blue-600'}`}>
            {uploading ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : attachment ? (
              <i className="fas fa-check-circle"></i>
            ) : (
              <i className="fas fa-paperclip"></i>
            )}
            <span className="text-[10px] font-black uppercase tracking-widest">
              {uploading ? 'UPLOADING...' : attachment ? 'FILE ATTACHED' : 'ATTACH BLUEPRINT / SPECS (PDF/IMG)'}
            </span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
          {attachment && (
            <button type="button" onClick={() => setAttachment(null)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-lg"><i className="fas fa-times"></i></button>
          )}
        </div>
      </div>
      <button disabled={sending || uploading} className="w-full bg-blue-600 text-white py-6 rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 shadow-blue-500/10">
        {sending ? 'TRANSMITTING...' : 'SEND INQUIRY TO FACTORY'}
      </button>
    </form>
  );
}
