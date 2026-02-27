import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Terminal } from "lucide-react";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-obsidian text-pure-white px-8 md:px-24 py-24 max-w-5xl mx-auto selection:bg-pure-white selection:text-obsidian">
      <div className="mb-16">
        <Link 
          href="/"
          className="inline-flex items-center gap-3 px-6 py-3 border border-slate-gray/30 hover:border-pure-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Terminal
        </Link>
      </div>

      <header className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Terminal className="w-4 h-4 text-slate-gray" />
          <span className="text-xs font-mono text-slate-gray uppercase tracking-widest">
            LOG_READER: EXECUTION_SUCCESS
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-8 text-slate-gray font-mono text-xs uppercase tracking-[0.2em] border-y border-slate-gray/20 py-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {post.date}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pure-white animate-pulse" />
            Status: Finalized
          </div>
        </div>
      </header>

      <div className="prose prose-invert prose-slate max-w-none 
        prose-headings:font-bold prose-headings:tracking-tighter prose-headings:uppercase
        prose-p:text-pure-white/80 prose-p:leading-relaxed prose-p:text-lg
        prose-code:text-pure-white prose-code:bg-dim-gray prose-code:px-1 prose-code:rounded
        prose-pre:bg-dim-gray prose-pre:border prose-pre:border-slate-gray/30
        font-mono"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <footer className="mt-24 pt-12 border-t border-slate-gray/20 flex flex-col items-center gap-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 border border-slate-gray/30 hover:border-pure-white hover:bg-white/5 transition-all font-mono text-xs uppercase tracking-[0.3em] group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Terminal
        </Link>
        
        <p className="text-[10px] text-slate-gray font-mono uppercase tracking-[0.5em]">
          End of Transmission // [EOF]
        </p>
      </footer>
    </article>
  );
}
