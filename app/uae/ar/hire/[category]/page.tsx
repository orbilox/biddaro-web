import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ChevronRight, ArrowRight } from 'lucide-react';
import {
  UAE_JOB_CATEGORY_META_AR, UAE_LOCATIONS_AR, getUAECategoryAR,
} from '@/lib/seo-data-uae-ar';

interface Props { params: { category: string } }

export function generateStaticParams() {
  return UAE_JOB_CATEGORY_META_AR.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getUAECategoryAR(params.category);
  if (!cat) return {};
  const title = `توظيف ${cat.plural} في الإمارات – أفضل ${cat.name} موثقون | بيداروا`;
  const description = `ابحث عن ${cat.plural} في جميع إمارات الإمارات. احصل على عروض أسعار مجانية من ${cat.name} موثقين. متوسط الأسعار ${cat.avgRate}.`;
  const url = `https://biddaro.com/uae/ar/hire/${cat.slug}`;
  return {
    title, description,
    keywords: [`${cat.name} الإمارات`, `توظيف ${cat.plural}`, `${cat.name} دبي`, `${cat.name} أبوظبي`, `أفضل ${cat.name} الإمارات`],
    alternates: {
      canonical: url,
      languages: {
        'en-AE': `https://biddaro.com/uae/hire/${cat.slug}`,
        'ar-AE': url,
      },
    },
    openGraph: { title, description, url, type: 'website', locale: 'ar_AE', siteName: 'بيداروا' },
  };
}

function JsonLd({ cat }: { cat: NonNullable<ReturnType<typeof getUAECategoryAR>> }) {
  const url = `https://biddaro.com/uae/ar/hire/${cat.slug}`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'مقاولو الإمارات', item: 'https://biddaro.com/uae/ar/hire' },
        { '@type': 'ListItem', position: 3, name: cat.plural, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `خدمات ${cat.name} في الإمارات`,
      description: cat.shortDesc,
      provider: { '@type': 'Organization', name: 'بيداروا', url: 'https://biddaro.com' },
      areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
      inLanguage: 'ar',
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function UAEArCategoryPage({ params }: Props) {
  const cat = getUAECategoryAR(params.category);
  if (!cat) notFound();
  const otherCats = UAE_JOB_CATEGORY_META_AR.filter((c) => c.slug !== cat.slug).slice(0, 8);

  return (
    <>
      <JsonLd cat={cat} />

      {/* Breadcrumbs */}
      <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3" aria-label="مسار التنقل">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center gap-2 text-sm text-dark-500 flex-wrap">
            <li><Link href="/" className="hover:text-brand-600">الرئيسية</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 rotate-180" /></li>
            <li><Link href="/uae/ar/hire" className="hover:text-brand-600">مقاولو الإمارات</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 rotate-180" /></li>
            <li className="text-dark-800 font-medium">{cat.plural}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-bl from-dark-900 via-dark-800 to-brand-900 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-5xl mb-4">{cat.emoji}</div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {cat.plural} في الإمارات
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto mb-8">{cat.longDesc.replace(/\{state\}/g, 'الإمارات')}</p>
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm px-4 py-1.5 rounded-full mb-6">
            متوسط السعر: {cat.avgRate}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
              أنشئ مشروعك مجاناً <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>
          </div>
          <div className="mt-6">
            <Link href={`/uae/hire/${cat.slug}`} className="text-sm text-dark-400 hover:text-brand-300 underline underline-offset-2">
              View in English
            </Link>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">الخدمات المتوفرة</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cat.skills.map((skill) => (
              <div key={skill} className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-brand-500 font-bold text-lg">✓</span>
                <span className="text-sm font-medium text-dark-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Emirate */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">{cat.plural} حسب الإمارة</h2>
          <p className="text-dark-500 mb-8">اختر إمارتك لعرض {cat.plural} المتوفرين في منطقتك.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {UAE_LOCATIONS_AR.map((emirate) => (
              <Link
                key={emirate.slug}
                href={`/uae/ar/hire/${cat.slug}/${emirate.slug}`}
                className="group bg-white border border-gray-200 hover:border-brand-300 hover:shadow-md rounded-xl p-5 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-dark-800 group-hover:text-brand-700">{emirate.name}</h3>
                  <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500 rotate-180" />
                </div>
                <p className="text-xs text-dark-400">{cat.plural} في {emirate.cities.length} منطقة</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {emirate.cities.slice(0, 3).map((city) => (
                    <span key={city.slug} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">{city.name}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">أسئلة شائعة</h2>
          <div className="space-y-4">
            {cat.faqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none bg-white hover:bg-gray-50">
                  <span className="font-medium text-dark-800 text-sm leading-relaxed">{faq.q.replace(/\{state\}/g, 'الإمارات')}</span>
                  <ChevronRight className="w-4 h-4 text-dark-400 flex-shrink-0 group-open:rotate-90 rotate-180 transition-transform" />
                </summary>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-dark-600 leading-relaxed">{faq.a.replace(/\{state\}/g, 'الإمارات')}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Other categories */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">تخصصات أخرى في الإمارات</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {otherCats.map((c) => (
              <Link key={c.slug} href={`/uae/ar/hire/${c.slug}`}
                className="group flex items-center gap-2 bg-white border border-gray-200 hover:border-brand-300 rounded-lg px-3 py-3 transition-all">
                <span className="text-xl">{c.emoji}</span>
                <span className="text-sm font-medium text-dark-700 group-hover:text-brand-600">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-l from-brand-500 to-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">هل تحتاج {cat.name} في الإمارات؟</h2>
          <p className="text-brand-100 mb-8">أنشئ مشروعك مجاناً واحصل على عروض من {cat.plural} موثقين خلال ساعات.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-brand-600 hover:bg-brand-50 font-bold px-10 py-4 rounded-xl transition-colors text-lg">
            ابدأ مجاناً الآن
          </Link>
        </div>
      </section>
    </>
  );
}
