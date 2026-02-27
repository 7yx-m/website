"use client";

import { motion } from "framer-motion";
import { ExternalLink, Terminal, Brain, Cpu } from "lucide-react";

const projects = [
  {
    title: "Digit Analyzer",
    description: "Handwritten digit recognition from scratch using pure C++ and mathematical foundations.",
    logic: "Manual backpropagation implementation. No frameworks (TensorFlow/PyTorch). Raw matrix operations.",
    tech: ["C++", "Mathematics", "Neural Networks"],
    icon: <Brain className="w-6 h-6" />,
    link: "https://github.com/onlynyxs/Digit-analyzer-MNIST-Dataset-", // Update with your actual repo name
  },
  {
    title: "Assistive Vision",
    description: "Real-time object detection and spatial awareness system for visually impaired users.",
    logic: "OpenCV pipeline integrated with pre-trained MobileNet SSD. Optimized for real-time inference.",
    tech: ["Python", "TensorFlow", "OpenCV"],
    icon: <Cpu className="w-6 h-6" />,
    link: "https://github.com/Selkie-the-goat/Assistive-Vision", // Update with your actual repo name
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="py-24 px-8 md:px-24 bg-obsidian border-b border-slate-gray/30">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter mb-4 uppercase">
            Technical <span className="text-slate-gray">Deep-Dives</span>
          </h2>
          <p className="text-slate-gray font-mono text-sm max-w-xl">
            [DIRECTORY] src/projects/executing_logic.sh
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {projects.map((project, index) => (
          <motion.a
            key={index}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className="group relative block overflow-hidden bg-dim-gray border border-slate-gray/30 p-8 rounded-lg transition-all duration-500 hover:border-pure-white/40 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-obsidian border border-slate-gray/30 rounded-lg group-hover:border-pure-white/40 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
                {project.icon}
              </div>
              <ExternalLink className="w-5 h-5 text-slate-gray opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <h3 className="text-2xl font-bold mb-4 group-hover:translate-x-1 transition-transform">{project.title}</h3>
            <p className="text-pure-white/60 mb-8 font-light leading-relaxed">
              {project.description}
            </p>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-[10px] uppercase tracking-widest font-mono border border-slate-gray/50 text-slate-gray"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Logic Reveal on Hover */}
              <div className="mt-8 pt-6 border-t border-slate-gray/20 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                <p className="text-[11px] uppercase tracking-widest font-mono text-slate-gray mb-2 flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> Technical Logic
                </p>
                <p className="text-sm font-mono text-pure-white/40 italic">
                  {">"} {project.logic}
                </p>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-pure-white/5 blur-[100px] pointer-events-none group-hover:bg-pure-white/10 transition-colors" />
          </motion.a>
        ))}
      </div>
    </section>
  );
};
