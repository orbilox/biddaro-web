'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import {
  BLOG_POSTS,
  BLOG_CATEGORY_META,
  type BlogCategory,
} from '@/lib/blog-data';

const ALL_CATEGORIES = ['all', 'ai-tools', 'cost-guides', 'hiring-tips', 'planning'] as const;
type FilterCategory = typeof ALL_CATEGORIES[number];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function BlogIndexPage() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  const filteredPosts =
    activeCategory === 'all'
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Construction &amp; Design Insights
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Practical guides, cost breakdowns, AI tool reviews, and expert advice
            for homeowners building or renovating in India.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="bg-white/10 text-slate-300 text-sm px-3 py-1 rounded-full border border-white/20">
              {BLOG_POSTS.length} Articles
            </span>
            <span className="bg-white/10 text-slate-300 text-sm px-3 py-1 rounded-full border border-white/20">
              Free to Read
            </span>
            <span className="bg-white/10 text-slate-300 text-sm px-3 py-1 rounded-full border border-white/20">
              India-Specific
            </span>
          </div>
        </div>
      </section>

      {/* ── Category Filter ───────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {/* All button */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            All ({BLOG_POSTS.length})
          </button>

          {/* Category buttons */}
          {(Object.entries(BLOG_CATEGORY_META) as [BlogCategory, typeof BLOG_CATEGORY_META[BlogCategory]][]).map(
            ([cat, meta]) => {
              const count = BLOG_POSTS.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    activeCategory === cat
                      ? `${meta.bg} ${meta.color} border-current`
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span>{meta.emoji}</span>
                  {meta.label} ({count})
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* ── Posts Grid ───────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No posts in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => {
                const catMeta = BLOG_CATEGORY_META[post.category];
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all overflow-hidden flex flex-col"
                  >
                    {/* Category badge */}
                    <div className={`px-5 pt-5`}>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${catMeta.bg} ${catMeta.color}`}
                      >
                        {catMeta.emoji} {catMeta.label}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="px-5 py-4 flex-1 flex flex-col">
                      <h2 className="font-semibold text-gray-900 text-base leading-snug mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readingTime} min read
                          </span>
                        </div>
                        <span className="text-orange-500 text-xs font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all">
                          Read
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-white py-14 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Have a Specific Question?
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Browse our AI-powered Q&amp;A library with 100+ answered questions on
            construction, materials, Vastu, and more.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/ask"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Browse Q&amp;A Library
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Try AI Tools
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
