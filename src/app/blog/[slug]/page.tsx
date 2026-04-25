import { getPostBySlug, getPostSlugs } from "@/lib/markdown";
import { generateMetadata as generateCustomMetadata } from "@/app/metadata";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Terminal } from "lucide-react";
import { notFound } from "next/navigation";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return generateCustomMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}/`,
  });
}

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
    <article className="min-h-screen bg-obsidian text-pure-white selection:bg-pure-white selection:text-obsidian">
      <div className="content-container py-sys-lg md:py-sys-xl">
        <div className="mb-sys-md">
          <Link 
            href="/"
            className="inline-flex items-center gap-sys-xs px-6 py-3 border border-slate-gray/30 hover:border-pure-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Terminal
          </Link>
        </div>

        <header className="mb-sys-md">
          <div className="flex items-center gap-sys-xs mb-sys-xs">
            <Terminal className="w-4 h-4 text-slate-gray" />
            <span className="text-xs font-mono text-slate-gray uppercase tracking-widest">
              LOG_READER: EXECUTION_SUCCESS
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-sys-sm leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-sys-md text-slate-gray font-mono text-xs uppercase tracking-[0.2em] border-y border-slate-gray/20 py-sys-sm">
            <div className="flex items-center gap-sys-xs">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-sys-xs">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
            <div className="flex items-center gap-sys-xs">
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
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <footer className="mt-sys-xl pt-sys-md border-t border-slate-gray/20 flex flex-col items-center gap-sys-md">
          <Link 
            href="/"
            className="inline-flex items-center gap-sys-xs px-8 py-4 border border-slate-gray/30 hover:border-pure-white hover:bg-white/5 transition-all font-mono text-xs uppercase tracking-[0.3em] group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Terminal
          </Link>
          
          <p className="text-[10px] text-slate-gray font-mono uppercase tracking-[0.5em]">
            End of Transmission // [EOF]
          </p>
        </footer>
      </div>
    </article>
  );
}
