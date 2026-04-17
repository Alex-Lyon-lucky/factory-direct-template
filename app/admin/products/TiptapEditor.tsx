'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { useState, useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onOpenLibrary?: () => void; // 联动素材库
  lastSelectedImage?: string; // 联动素材库选中的图片
}

const MenuBar = ({ editor, isSource, setSource, onOpenLibrary }: any) => {
  if (!editor) return null;

  const btnClass = "p-2 rounded hover:bg-slate-200 transition-colors text-slate-700 disabled:opacity-30 text-xs font-bold";
  const activeBtnClass = "p-2 rounded bg-blue-600 text-white transition-colors text-xs font-bold";

  return (
    <div className="flex flex-wrap gap-1 p-3 border-b border-slate-200 bg-slate-50 sticky top-0 z-20 items-center">
      {/* 源码切换 */}
      <button 
        onClick={() => setSource(!isSource)}
        className={isSource ? activeBtnClass : "p-2 rounded bg-amber-500 text-white text-[10px] font-black tracking-widest uppercase"}
        title="切换源码视图"
      >
        <i className="fas fa-code"></i> {isSource ? '可视化' : '源代码'}
      </button>

      <div className="w-px h-6 bg-slate-200 mx-2"></div>

      {/* 标题下拉 */}
      <select 
        onChange={(e) => {
          const val = e.target.value;
          if (val === 'p') editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
        }}
        className="bg-white border border-slate-200 rounded px-2 py-1 text-[10px] font-black"
      >
        <option value="p">常规正文</option>
        <option value="1">标题 1 (特大)</option>
        <option value="2">标题 2 (中等)</option>
        <option value="3">标题 3 (小号)</option>
        <option value="4">标题 4 (超小)</option>
      </select>

      {/* 基础样式 */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? activeBtnClass : btnClass} title="加粗"><i className="fas fa-bold"></i></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? activeBtnClass : btnClass} title="斜体"><i className="fas fa-italic"></i></button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? activeBtnClass : btnClass} title="下划线"><i className="fas fa-underline"></i></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? activeBtnClass : btnClass} title="删除线"><i className="fas fa-strikethrough"></i></button>

      <div className="w-px h-6 bg-slate-200 mx-1"></div>

      {/* 对齐方式 */}
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? activeBtnClass : btnClass} title="左对齐"><i className="fas fa-align-left"></i></button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? activeBtnClass : btnClass} title="居中对齐"><i className="fas fa-align-center"></i></button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? activeBtnClass : btnClass} title="右对齐"><i className="fas fa-align-right"></i></button>

      <div className="w-px h-6 bg-slate-200 mx-1"></div>

      {/* 列表与引用 */}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? activeBtnClass : btnClass} title="无序列表"><i className="fas fa-list-ul"></i></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? activeBtnClass : btnClass} title="有序列表"><i className="fas fa-list-ol"></i></button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? activeBtnClass : btnClass} title="引用"><i className="fas fa-quote-right"></i></button>

      <div className="w-px h-6 bg-slate-200 mx-1"></div>

      {/* 链接与图片 */}
      <button 
        onClick={() => {
          const url = window.prompt('输入链接地址:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} 
        className={editor.isActive('link') ? activeBtnClass : btnClass}
        title="添加超链接"
      >
        <i className="fas fa-link"></i>
      </button>

      {/* 联动素材库 */}
      <button 
        onClick={onOpenLibrary}
        className="p-2 rounded bg-indigo-500 text-white text-[10px] font-black tracking-widest uppercase hover:bg-indigo-600 transition-colors"
        title="从素材库选择图片"
      >
        <i className="fas fa-photo-video"></i> 素材库选择
      </button>

      {/* 本地上传 */}
      <label className="p-2 rounded bg-emerald-500 text-white text-[10px] font-black tracking-widest uppercase hover:bg-emerald-600 transition-colors cursor-pointer">
        <i className="fas fa-upload"></i> 本地上传
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={async (e) => {
             const file = e.target.files?.[0];
             if (!file) return;
             const formData = new FormData();
             formData.append('file', file);
             const res = await fetch('/api/upload', { method: 'POST', body: formData });
             if (res.ok) {
                const data = await res.json();
                editor.chain().focus().setImage({ src: data.url }).run();
                // 同时也保存到素材库
                fetch('/api/materials', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ name: file.name, url: data.url, type: 'image', hash: data.hash })
                });
             }
          }} 
        />
      </label>

      <div className="w-px h-6 bg-slate-200 mx-1"></div>

      {/* 表格操作增强 */}
      <div className="flex gap-1 bg-slate-200/50 p-1 rounded-lg">
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={btnClass} title="插入表格"><i className="fas fa-table"></i></button>
        {editor.isActive('table') && (
          <>
            <button onClick={() => editor.chain().focus().addColumnAfter().run()} className={btnClass} title="增加列"><i className="fas fa-plus-square"></i> 列</button>
            <button onClick={() => editor.chain().focus().addRowAfter().run()} className={btnClass} title="增加行"><i className="fas fa-plus-square"></i> 行</button>
            <button onClick={() => editor.chain().focus().deleteTable().run()} className="p-2 text-red-500 hover:bg-red-50 rounded" title="删除表格"><i className="fas fa-trash-alt"></i></button>
          </>
        )}
      </div>
    </div>
  );
};

export default function TiptapEditor({ content, onChange, onOpenLibrary, lastSelectedImage }: TiptapEditorProps) {
  const [isSource, setSource] = useState(false);
  const [sourceCode, setSourceCode] = useState(content);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'rounded-2xl shadow-xl max-w-full h-auto my-8 border border-slate-100',
        },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setSourceCode(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] p-12 leading-loose text-slate-700 font-medium',
      },
    },
  });

  // 响应素材库图片插入
  useEffect(() => {
    if (lastSelectedImage && editor) {
      editor.chain().focus().setImage({ src: lastSelectedImage }).run();
    }
  }, [lastSelectedImage, editor]);

  // 源码与可视化同步
  useEffect(() => {
    if (isSource) {
      setSourceCode(editor?.getHTML() || '');
    } else if (editor) {
      editor.commands.setContent(sourceCode);
    }
  }, [isSource]);

  return (
    <div className="w-full bg-white flex flex-col">
      <MenuBar editor={editor} isSource={isSource} setSource={setSource} onOpenLibrary={onOpenLibrary} />
      
      {isSource ? (
        <textarea
          value={sourceCode}
          onChange={(e) => {
            setSourceCode(e.target.value);
            onChange(e.target.value);
          }}
          className="w-full min-h-[500px] p-10 font-mono text-sm bg-slate-900 text-blue-300 focus:outline-none leading-relaxed"
          placeholder="Paste or write HTML here..."
        />
      ) : (
        <EditorContent editor={editor} />
      )}

      <style jsx global>{`
        .ProseMirror {
           outline: none !important;
        }
        .ProseMirror h1 { font-size: 3rem; font-weight: 900; margin-bottom: 2rem; }
        .ProseMirror h2 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1.5rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 0.5rem; }
        .ProseMirror h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
        .ProseMirror p { margin-bottom: 1.25rem; }
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 2rem 0;
          overflow: hidden;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .ProseMirror td, .ProseMirror th {
          min-width: 1em;
          border: 1px solid #e2e8f0;
          padding: 12px 16px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror th {
          font-weight: bold;
          text-align: left;
          background-color: #f8fafc;
        }
        .ProseMirror img {
           display: block;
           margin: 2rem auto;
           transition: all 0.3s;
        }
        .ProseMirror img:hover {
           transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
