"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X, Terminal, FileText, Clock } from 'lucide-react';

interface BlogEditorProps {
  onClose: () => void;
  onSuccess: (slug: string) => void;
}

export const BlogEditor = ({ onClose, onSuccess }: BlogEditorProps) => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('5 min');
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    if (!title || !content) {
      setError('Title and Content are required.');
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ title, excerpt, content, readTime }),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess(data.slug);
      } else {
        setError(data.error || 'Failed to publish post.');
      }
    } catch (e) {
      setError('Network error. Check your connection.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex flex-col h-full bg-obsidian"
    >
      <div className="flex items-center justify-between p-4 border-b border-pure-white/10 bg-pure-white/5">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-pure-white/60" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-pure-white">Create_New_Log.sh</span>
        </div>
        <button onClick={onClose} className="text-pure-white/40 hover:text-pure-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs uppercase tracking-widest">
            ERROR: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-gray font-bold">Post_Title</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-dim-gray border border-pure-white/10 p-3 text-sm text-pure-white focus:border-pure-white/30 outline-none transition-all"
              placeholder="Enter title..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-gray font-bold">Read_Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-gray" />
              <input 
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full bg-dim-gray border border-pure-white/10 p-3 pl-10 text-sm text-pure-white focus:border-pure-white/30 outline-none transition-all"
                placeholder="e.g., 5 min"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-slate-gray font-bold">Log_Excerpt (Short Summary)</label>
          <input 
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full bg-dim-gray border border-pure-white/10 p-3 text-sm text-pure-white focus:border-pure-white/30 outline-none transition-all"
            placeholder="A brief overview of this post..."
          />
        </div>

        <div className="space-y-2 flex-1 flex flex-col min-h-[300px]">
          <label className="text-[10px] uppercase tracking-widest text-slate-gray font-bold">Content (Markdown_Format)</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full bg-dim-gray border border-pure-white/10 p-4 text-sm font-mono text-pure-white/80 focus:border-pure-white/30 outline-none transition-all resize-none leading-relaxed"
            placeholder="# Start writing...&#10;&#10;Use Markdown to format your post."
          />
        </div>
      </div>

      <div className="p-4 bg-pure-white/5 border-t border-pure-white/10 flex justify-end gap-4">
        <button 
          onClick={onClose}
          className="px-6 py-2 text-[10px] uppercase tracking-widest text-slate-gray hover:text-pure-white transition-colors"
        >
          [ Cancel ]
        </button>
        <button 
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex items-center gap-2 px-8 py-2 bg-pure-white text-obsidian text-[10px] uppercase tracking-widest font-bold hover:bg-pure-white/90 transition-all disabled:opacity-50"
        >
          {isPublishing ? (
            <>Initializing Push...</>
          ) : (
            <>
              <Send className="w-3 h-3" /> Execute_Publish
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
