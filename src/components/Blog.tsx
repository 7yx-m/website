"use client";

import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Post {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  readTime: string;
}

export const Blog = ({ posts }: { posts: Post[] }) => {
  return (
    <section id="blog" className="section-padding w-full bg-obsidian border-b border-slate-gray/30">
      <div className="content-container">
        <div className="mb-sys-md">
          <h2 className="text-4xl font-bold tracking-tighter mb-sys-xs uppercase">
            The <span className="text-slate-gray">Dev Logs</span>
          </h2>
          <p className="text-slate-gray font-mono text-sm">[LOGS] var/log/development_notes.txt</p>
        </div>

        <div className="space-y-0 divide-y divide-slate-gray/20">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Link 
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="py-sys-sm first:pt-0 group-hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-sys-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-sys-sm mb-sys-xs">
                        <span className="text-xs font-mono text-slate-gray">{post.date}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-gray" />
                        <span className="text-xs font-mono text-slate-gray">{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-pure-white transition-colors flex items-center gap-2">
                        {post.title}
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </h3>
                      <p className="mt-sys-xs text-pure-white/40 text-sm leading-relaxed max-w-3xl">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <FileText className="w-8 h-8 text-slate-gray/20 group-hover:text-slate-gray/50 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <p className="py-sys-sm text-slate-gray font-mono italic">[EMPTY] No logs found in directory.</p>
          )}
        </div>

        {posts.length > 0 && (
          <motion.button 
            whileHover={{ x: 5 }}
            className="mt-sys-md flex items-center gap-sys-xs text-xs font-mono uppercase tracking-[0.2em] text-slate-gray hover:text-pure-white transition-colors"
          >
            View Full Documentation <ArrowRight className="w-3 h-3" />
          </motion.button>
        )}
      </div>
    </section>
  );
};
