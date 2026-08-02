"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, Code, Github, Linkedin, Instagram } from "lucide-react";

const skills = [
  { name: "C++", level: "Advanced" },
  { name: "Python", level: "AI/ML Focused" },
  { name: "Next.js", level: "Web Architecture" },
  { name: "AI/ML Tools", level: "OpenCV / TF" },
];

const education = [
  {
    institution: "Gandaki Boarding School",
    degree: "High School (Computer Science)",
    grade: "GPA: A",
    status: "Completed",
  },
];

const leadership = [
  {
    role: "Board of Directors",
    org: "Teens for Change",
    description: "Helping lead community projects and organizing local initiatives.",
  },
  {
    role: "SAT Math Tutor",
    org: "Independent",
    description: "Helping students master math concepts through logical problem-solving.",
  },
];

export const About = () => {
  return (
    <section id="about" className="section-padding w-full bg-obsidian border-b border-slate-gray/30">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-sys-md lg:gap-sys-lg">
          {/* Left Column: Education & Leadership */}
          <div className="lg:col-span-2 space-y-sys-md lg:space-y-sys-lg">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-sys-sm uppercase tracking-widest flex items-center gap-sys-xs">
                <GraduationCap className="w-5 h-5 text-slate-gray" /> Education
              </h3>
              <div className="space-y-sys-md">
                {education.map((edu, idx) => (
                  <div key={idx} className="relative pl-sys-sm border-l border-slate-gray/30">
                    <div className="absolute top-0 left-[-4px] w-2 h-2 bg-pure-white rounded-full" />
                    <h4 className="text-xl font-bold">{edu.institution}</h4>
                    <p className="text-slate-gray font-mono text-sm mt-1">{edu.degree} {" // "} {edu.status}</p>
                    <p className="mt-sys-sm text-pure-white/60 font-mono text-xs uppercase tracking-widest">{edu.grade}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-sys-sm uppercase tracking-widest flex items-center gap-sys-xs">
                <Users className="w-5 h-5 text-slate-gray" /> Leadership
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sys-sm">
                {leadership.map((lead, idx) => (
                  <div key={idx} className="p-sys-sm bg-dim-gray border border-slate-gray/20 rounded-sm">
                    <h4 className="text-lg font-bold">{lead.role}</h4>
                    <p className="text-xs font-mono text-slate-gray mt-1 uppercase tracking-wider">{lead.org}</p>
                    <p className="mt-sys-sm text-sm text-pure-white/40 leading-relaxed">{lead.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Skills & Socials */}
          <div className="space-y-sys-md lg:space-y-sys-lg">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-sys-sm uppercase tracking-widest flex items-center gap-sys-xs">
                <Code className="w-5 h-5 text-slate-gray" /> Core Skills
              </h3>
              <div className="space-y-sys-sm">
                {skills.map((skill, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-xs font-mono uppercase tracking-widest">
                      <span className="text-pure-white/80">{skill.name}</span>
                      <span className="text-slate-gray">{skill.level}</span>
                    </div>
                    <div className="h-[2px] w-full bg-slate-gray/20">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: idx * 0.1, ease: "circOut" }}
                        className="h-full bg-pure-white/40"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="pt-sys-md border-t border-slate-gray/20"
            >
              <h3 className="text-sm font-bold mb-sys-sm uppercase tracking-[0.3em] text-slate-gray font-mono">
                Network Links
              </h3>
              <div className="flex flex-wrap gap-sys-sm">
                <a href="https://github.com/7yx-m" target="_blank" rel="noopener noreferrer" className="p-3 border border-slate-gray/30 hover:border-pure-white transition-colors group">
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://www.linkedin.com/in/neeksonshrestha/" target="_blank" rel="noopener noreferrer" className="p-3 border border-slate-gray/30 hover:border-pure-white transition-colors group">
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://www.instagram.com/n1k.z0n/" target="_blank" rel="noopener noreferrer" className="p-3 border border-slate-gray/30 hover:border-pure-white transition-colors group">
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://codeforces.com/profile/7yx" target="_blank" rel="noopener noreferrer" className="p-3 border border-slate-gray/30 hover:border-pure-white transition-colors group flex items-center justify-center font-mono text-[10px] font-bold">
                  CF
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
