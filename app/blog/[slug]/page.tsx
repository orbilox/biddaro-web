import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, Calendar, User, Tag } from 'lucide-react';
import {
  BLOG_POSTS,
  BLOG_SLUGS,
  getBlogPost,
  getRelatedPosts,
  BLOG_CATEGORY_META,
} from '@/lib/blog-data';
import type { AnswerSection } from '@/lib/ask-data';

// ─── Static Params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.tags,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://biddaro.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
    },
    alternates: {
      canonical: `https://biddaro.com/blog/${post.slug}`,
    },
  };
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

function buildJsonLd(post: NonNullable<ReturnType<typeof getBlogPost>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Biddaro',
      url: 'https://biddaro.com',
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    url: `https://biddaro.com/blog/${post.slug}`,
    keywords: post.tags.join(', '),
  };
}

// ─── Section Renderer ─────────────────────────────────────────────────────────

function renderSection(section: AnswerSection, idx: number): React.ReactNode {
  switch (section.type) {
    case 'h2':
      return (
        <h2
          key={idx}
          className="text-xl font-bold text-gray-900 mt-8 mb-3 first:mt-0"
        >
          {section.content}
        </h2>
      );

    case 'h3':
      return (
        <h3
          key={idx}
          className="text-lg font-semibold text-gray-800 mt-6 mb-2"
        >
          {section.content}
        </h3>
      );

    case 'paragraph':
      return (
        <p
          key={idx}
          className="text-gray-700 leading-relaxed mb-4"
        >
          {section.content}
        </p>
      );

    case 'list':
      return (
        <ul key={idx} className="mb-4 space-y-1.5">
          {(section.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'ordered_list':
      return (
        <ol key={idx} className="mb-4 space-y-2">
          {(section.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed flex-1">{item}</span>
            </li>
          ))}
        </ol>
      );

    case 'steps':
      return (
        <div key={idx} className="mb-4 space-y-3">
          {(section.items ?? []).map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-orange-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed flex-1">{item}</p>
            </div>
          ))}
        </div>
      );

    case 'table':
      if (!section.table) return null;
      return (
        <div key={idx} className="mb-6 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {section.table.headers.map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-4 py-3 text-gray-700 border-t border-gray-100"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'highlight':
      return (
        <div
          key={idx}
          className="mb-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-xl px-5 py-4"
        >
          <p className="text-orange-800 text-sm leading-relaxed font-medium">
            {section.content}
          </p>
        </div>
      );

    case 'tip':
      return (
        <div
          key={idx}
          className="mb-4 bg-green-50 border border-green-200 rounded-xl px-5 py-4"
        >
          <p className="text-xs font-bold text-green-700 mb-1 uppercase tracking-wider">
            💡 Pro Tip
          </p>
          <p className="text-green-800 text-sm leading-relaxed">{section.content}</p>
        </div>
      );

    case 'warning':
      return (
        <div
          key={idx}
          className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4"
        >
          <p className="text-xs font-bold text-amber-700 mb-1 uppercase tracking-wider">
            ⚠️ Important
          </p>
          <p className="text-amber-800 text-sm leading-relaxed">{section.content}</p>
        </div>
      );

    case 'cost_box':
      return (
        <div
          key={idx}
          className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4"
        >
          {section.label && (
            <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wider">
              💰 {section.label}
            </p>
          )}
          <ul className="space-y-1">
            {(section.items ?? []).map((item, i) => (
              <li key={i} className="text-blue-800 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const jsonLd = buildJsonLd(post);
  const relatedPosts = getRelatedPosts(post.relatedSlugs);
  const catMeta = BLOG_CATEGORY_META[post.category];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Article Header ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-5">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Blog
            </Link>
            <span className="text-slate-600">/</span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${catMeta.bg} ${catMeta.color}`}
            >
              {catMeta.emoji} {catMeta.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime} min read
            </span>
          </div>

          {/* Excerpt */}
          <p className="mt-5 text-slate-300 leading-relaxed border-l-2 border-orange-500 pl-4">
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* ── Article Body ───────────────────────────────────────────────────── */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <article className="prose-custom">
            {post.sections.map((section, idx) =>
              renderSection(section, idx)
            )}
          </article>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-gray-400" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Updated note */}
          {post.updatedAt && (
            <p className="mt-4 text-xs text-gray-400">
              Last updated: {formatDate(post.updatedAt)}
            </p>
          )}
        </div>
      </section>

      {/* ── AI CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-orange-50 border-y border-orange-100 py-10 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-6 items-center">
          <div className="flex-1">
            <p className="text-sm font-semibold text-orange-700 mb-1">
              💡 Have more questions?
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Our AI can give you instant, India-specific answers tailored to your exact
              project — city, size, budget, and more.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Try AI Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ask"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-xl border border-gray-200 transition-colors text-sm"
            >
              Q&amp;A Library
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related Posts ───────────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-14 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPosts.map((rp) => {
                const rpCatMeta = BLOG_CATEGORY_META[rp.category];
                return (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group bg-white rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all p-5 flex flex-col"
                  >
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border mb-3 self-start ${rpCatMeta.bg} ${rpCatMeta.color}`}
                    >
                      {rpCatMeta.emoji} {rpCatMeta.label}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 flex-1">
                      {rp.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
                      <Clock className="w-3 h-3" />
                      {rp.readingTime} min read
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── All Articles CTA ────────────────────────────────────────────────── */}
      <section className="bg-white py-10 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </Link>
          <span className="mx-4 text-gray-300">|</span>
          <Link
            href="/hire"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Find a Contractor
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

