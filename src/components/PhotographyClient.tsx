"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface PhotoMeta {
  src: string;
  alt: string;
  filename: string;
}

interface PhotographyClientProps {
  photos: PhotoMeta[];
}

export const PhotographyClient = ({ photos }: PhotographyClientProps) => {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.src}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.8 }}
          viewport={{ once: true }}
          className="break-inside-avoid relative group overflow-hidden bg-dim-gray border border-slate-gray/30 rounded-sm"
        >
          <div className="h-80 w-full relative">
            <Image 
              src={photo.src} 
              alt={photo.alt} 
              fill
              className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 hover:contrast-100 transition-all duration-700 ease-in-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.1)_50%)] bg-[length:100%_4px] transition-opacity" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-obsidian/90 backdrop-blur-md border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-pure-white">
                {photo.alt}
              </span>
              <span className="text-[9px] font-mono text-slate-gray">
                [IMG]
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
