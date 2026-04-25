import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Blog } from "@/components/Blog";
import { Photography } from "@/components/Photography";
import { About } from "@/components/About";
import { Navigation } from "@/components/Navigation";
import { TerminalCLI } from "@/components/TerminalCLI";
import { BootScreen } from "@/components/BootScreen";
import { getAllPosts } from "@/lib/markdown";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="relative">
      <AnimatePresence mode="wait">
        <BootScreen />
      </AnimatePresence>
      <TerminalCLI />
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <Navigation />
        <div id="hero" className="w-full">
          <Hero />
        </div>
        <Projects />
        <Blog posts={posts} />
        <Photography />
        <About />
        
        {/* Footer */}
        <footer className="w-full py-12 px-8 bg-obsidian text-center border-t border-slate-gray/30">
          <p className="text-[10px] font-mono text-slate-gray uppercase tracking-[0.4em]">
            © 2026 NEEKSON SHRESTHA // EXECUTED ON [02.27.2026] // SYSTEM STABLE
          </p>
        </footer>
      </div>
    </main>
  );
}
