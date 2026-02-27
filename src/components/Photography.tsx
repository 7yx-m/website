"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";

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
    <section id="photography" className="py-24 px-8 md:px-24 bg-obsidian border-b border-slate-gray/30 overflow-hidden">
      <div className="mb-16">
        <h2 className="text-4xl font-bold tracking-tighter mb-4 uppercase">
          The <span className="text-slate-gray">Darkroom</span>
        </h2>
        <p className="text-slate-gray font-mono text-sm">/usr/neekson/images/photography/</p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            viewport={{ once: true }}
            className="break-inside-avoid relative group overflow-hidden bg-dim-gray border border-slate-gray/30"
          >
            <div className={`${photo.height} w-full relative group-hover:scale-105 transition-transform duration-700`}>
              <img 
                src={photo.src} 
                alt={photo.title} 
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.classList.add('bg-gradient-to-br', 'from-slate-gray/20', 'to-obsidian');
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Camera className="w-12 h-12" />
              </div>
            </div>

            {/* High contrast overlay on hover */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300 pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-obsidian/80 backdrop-blur-sm">
              <span className="text-[10px] uppercase tracking-widest font-mono text-pure-white/60">
                {photo.title}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
