import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Blog } from "@/components/Blog";
import { Photography } from "@/components/Photography";
import { About } from "@/components/About";
import { Navigation } from "@/components/Navigation";
import { getAllPosts } from "@/lib/blog";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="relative">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10">
        <Navigation />
        <div id="hero">
          <Hero />
        </div>
        <Projects />
        <Blog posts={posts} />
        <Photography />
        <About />
        
        {/* Footer */}
        <footer className="py-12 px-8 md:px-24 bg-obsidian text-center border-t border-slate-gray/30">
          <p className="text-[10px] font-mono text-slate-gray uppercase tracking-[0.4em]">
            © 2026 NEEKSON SHRESTHA // EXECUTED ON [02.27.2026] // SYSTEM STABLE
          </p>
        </footer>
      </div>
    </main>
  );
}
