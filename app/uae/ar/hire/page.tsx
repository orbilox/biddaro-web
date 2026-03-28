import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ChevronRight, Search, Star } from 'lucide-react';
import { UAE_JOB_CATEGORY_META_AR, UAE_LOCATIONS_AR } from '@/lib/seo-data-uae-ar';

export const metadata: Metadata = {
  title: 'ابحث عن مقاولين في الإمارات | بيداروا',
  description:
    'تصفح أفضل المقاولين وفنيي السباكة والكهرباء والدهانات وأكثر من 20 تخصصاً في جميع إمارات الإمارات. أنشئ مشروعك مجاناً على بيداروا.',
  keywords: [
    'مقاولين الإمارات', 'مقاول في دبي', 'سباك معتمد أبوظبي',
    'كهربائي الشارقة', 'مقاول ترميم الإمارات', 'بيداروا الإمارات',
  ],
  alternates: {
    canonical: 'https://biddaro.com/uae/ar/hire',
    languages: {
      'en-AE': 'https://biddaro.com/uae/hire',
      'ar-AE': 'https://biddaro.com/uae/ar/hire',
    },
  },
  openGraph: {
    title: 'ابحث عن أفضل مقاولين في الإمارات | بيداروا',
    description: 'تواصل مع أكثر من 500 مقاول موثق في جميع إمارات الإمارات. أنشئ مشروعك مجاناً اليوم.',
    url: 'https://biddaro.com/uae/ar/hire',
    type: 'website',
    locale: 'ar_AE',
  },
};

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'ابحث عن مقاولين في الإمارات | بيداروا',
      description: 'تصفح المقاولين حسب التخصص والإمارة في دولة الإمارات العربية المتحدة.',
      url: 'https://biddaro.com/uae/ar/hire',
      inLanguage: 'ar',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'الإمارات', item: 'https://biddaro.com/uae/ar/hire' },
        { '@type': 'ListItem', position: 3, name: 'ابحث عن مقاولين', item: 'https://biddaro.com/uae/ar/hire' },
      ],
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function UAEArabicHireHubPage() {
  return (
    <>
      <JsonLd />

      {/* Hero */}
      <section className="bg-gradient-to-bl from-dark-900 via-dark-800 to-brand-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Star className="w-3.5 h-3.5 fill-brand-400 text-brand-400" />
            موثوق من قِبل المقاولين وأصحاب المنازل في الإمارات
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            ابحث عن أفضل مقاولي البناء<br className="hidden sm:block" />
            <span className="text-brand-400"> قريباً منك في الإمارات</span>
          </h1>
          <p className="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
            تصفح المقاولين الموثقين حسب التخصص والإمارة. أنشئ مشروعك مجاناً واحصل على عروض تنافسية من محترفين في منطقتك.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/open-jobs"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              <Search className="w-4 h-4" /> تصفح المشاريع المفتوحة
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors border border-white/20"
            >
              أنشئ مشروعك مجاناً
            </Link>
          </div>
          {/* Language switch */}
          <div className="mt-8">
            <Link href="/uae/hire" className="text-sm text-dark-400 hover:text-brand-300 underline underline-offset-2 transition-colors">
              View in English
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '+500', label: 'مقاول موثق' },
            { value: '+20', label: 'تخصص مهني' },
            { value: '7', label: 'إمارة مشمولة' },
            { value: '4.8★', label: 'متوسط التقييم' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-dark-900">{value}</p>
              <p className="text-sm text-dark-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900">تصفح حسب التخصص</h2>
            <p className="text-dark-500 mt-2">اختر تخصصاً لعرض المقاولين المتوفرين في جميع إمارات الإمارات.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {UAE_JOB_CATEGORY_META_AR.map((cat) => (
              <Link
                key={cat.slug}
                href={`/uae/ar/hire/${cat.slug}`}
                className="group flex flex-col items-center gap-2 bg-white border border-gray-200 hover:border-brand-400 hover:shadow-md rounded-xl p-4 transition-all text-center"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-sm font-semibold text-dark-800 group-hover:text-brand-600 leading-tight">
                  {cat.name}
                </span>
                <span className="text-xs text-dark-400">{cat.avgRate}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Emirate */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900">تصفح حسب الإمارة</h2>
            <p className="text-dark-500 mt-2">ابحث عن مقاولين في إمارتك عبر جميع التخصصات المهنية.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {UAE_LOCATIONS_AR.map((emirate) => (
              <Link
                key={emirate.slug}
                href={`/uae/ar/hire/general-contractor/${emirate.slug}`}
                className="group flex items-center justify-between gap-2 bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 rounded-lg px-4 py-3 transition-all"
              >
                <div>
                  <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700">{emirate.name}</p>
                  <p className="text-xs text-dark-400">{emirate.cities.length} منطقة</p>
                </div>
                <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500 flex-shrink-0 rotate-180" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">عمليات البحث الأكثر شيوعاً</h2>
          <p className="text-dark-500 mb-8">استكشف أكثر تخصصات المقاولين بحثاً حسب الإمارة.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {UAE_JOB_CATEGORY_META_AR.slice(0, 8).flatMap((cat) =>
              UAE_LOCATIONS_AR.filter((l) =>
                ['dubai', 'abu-dhabi', 'sharjah', 'ajman', 'ras-al-khaimah'].includes(l.slug)
              ).map((emirate) => (
                <Link
                  key={`${cat.slug}-${emirate.slug}`}
                  href={`/uae/ar/hire/${cat.slug}/${emirate.slug}`}
                  className="text-sm text-brand-600 hover:text-brand-800 hover:underline py-0.5"
                >
                  {cat.name} في {emirate.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-l from-brand-500 to-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">هل أنت مستعد للعثور على مقاول؟</h2>
          <p className="text-brand-100 text-lg mb-8">
            أنشئ مشروعك مجاناً واحصل على عروض من محترفين موثقين في الإمارات خلال ساعات.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 hover:bg-brand-50 font-bold px-10 py-4 rounded-xl transition-colors text-lg"
          >
            ابدأ مجاناً الآن
          </Link>
        </div>
      </section>
    </>
  );
}
