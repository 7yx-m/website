"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Camera, CheckCircle2 } from 'lucide-react';

interface PhotoUploaderProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PhotoUploader = ({ onClose, onSuccess }: PhotoUploaderProps) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = async () => {
    if (!file || !title) return;
    setIsUploading(true);
    setStatus('Initializing R2 Uplink...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      const res = await fetch('/api/admin/photo', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setStatus('SUCCESS: Metadata Synced to GitHub.');
        setTimeout(onSuccess, 1500);
      } else {
        setStatus('ERROR: Uplink Failed.');
      }
    } catch (e) {
      setStatus('ERROR: Connection Interrupted.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-obsidian p-8 font-mono">
      <div className="flex items-center justify-between mb-8 border-b border-pure-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Camera className="w-5 h-5 text-pure-white" />
          <span className="text-[10px] uppercase tracking-[0.4em]">Darkroom_Module: Upload_Image.sh</span>
        </div>
        <button onClick={onClose} className="text-pure-white/40 hover:text-pure-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {!preview ? (
          <label className="w-full max-w-md aspect-square border-2 border-dashed border-pure-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-pure-white/5 transition-all group">
            <Upload className="w-12 h-12 text-slate-gray group-hover:text-pure-white transition-colors mb-4" />
            <span className="text-[10px] uppercase tracking-widest text-slate-gray">Select_Source_File</span>
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>
        ) : (
          <div className="w-full max-w-sm aspect-square relative border border-pure-white/20">
            <img src={preview} alt="Preview" className="w-full h-full object-cover grayscale" />
            <button 
              onClick={() => { setPreview(null); setFile(null); }}
              className="absolute top-2 right-2 p-1 bg-obsidian border border-pure-white/20 text-pure-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="w-full max-w-md space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-gray">Image_Metadata: Title</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-dim-gray border border-pure-white/10 p-3 text-sm text-pure-white focus:border-pure-white/30 outline-none"
              placeholder="e.g., Kathmandu Rain"
            />
          </div>
          
          <button 
            disabled={!file || !title || isUploading}
            onClick={handleUpload}
            className="w-full py-4 bg-pure-white text-obsidian text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-pure-white/90 disabled:opacity-30 transition-all flex items-center justify-center gap-3"
          >
            {isUploading ? 'Executing_Push...' : (
              <>
                <Upload className="w-4 h-4" /> Start_Uplink
              </>
            )}
          </button>
        </div>

        {status && (
          <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-pure-white animate-pulse">
            <CheckCircle2 className="w-3 h-3" /> {status}
          </div>
        )}
      </div>
    </div>
  );
};
