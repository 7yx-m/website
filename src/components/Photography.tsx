"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import Image from "next/image";

const photos = [
  { id: 1, height: "h-64", title: "That One time in Kathmandu", src: "/images/photo1.jpg" },
  { id: 2, height: "h-96", title: "Gandaki Boarding School", src: "/images/photo2.jpg" },
  { id: 3, height: "h-80", title: "Sleepless Sessions", src: "/images/photo3.jpg" },
  { id: 4, height: "h-96", title: "Urban Geometry", src: "/images/photo4.jpg" },
  { id: 5, height: "h-64", title: "The Path of the awakened one", src: "/images/photo5.jpg" },
  { id: 6, height: "h-80", title: "Jewel in the Himalaya", src: "/images/photo6.jpg" },
];

export const Photography = () => {
  return (
    <section id="photography" className="section-padding w-full bg-obsidian border-b border-slate-gray/30 overflow-hidden">
      <div className="content-container-wide">
        <div className="mb-sys-lg px-2">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-sys-xs uppercase">
            The <span className="text-slate-gray">Darkroom</span>
          </h2>
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-pure-white animate-pulse" />
            <p className="text-slate-gray font-mono text-xs tracking-widest uppercase">
              /usr/neekson/images/photography/ --all --raw
            </p>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.8 }}
              viewport={{ once: true }}
              className="break-inside-avoid relative group overflow-hidden bg-dim-gray border border-slate-gray/30 rounded-sm"
            >
              <div className={`${photo.height} w-full relative`}>
                <Image 
                  src={photo.src} 
                  alt={photo.title} 
                  fill
                  className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 hover:contrast-100 transition-all duration-700 ease-in-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Scanner line effect overlay specific to images */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.1)_50%)] bg-[length:100%_4px] transition-opacity" />
              </div>

              {/* Minimalist Info Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-obsidian/90 backdrop-blur-md border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-pure-white">
                    {photo.title}
                  </span>
                  <span className="text-[9px] font-mono text-slate-gray">
                    [0{photo.id}_IMG]
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
