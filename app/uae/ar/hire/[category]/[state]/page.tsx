import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ChevronRight, ArrowRight } from 'lucide-react';
import {
  UAE_JOB_CATEGORY_META_AR, UAE_LOCATIONS_AR,
  getUAECategoryAR, getUAELocationAR,
} from '@/lib/seo-data-uae-ar';

interface Props { params: { category: string; state: string } }

export function generateStaticParams() {
  return UAE_JOB_CATEGORY_META_AR.flatMap((cat) =>
    UAE_LOCATIONS_AR.map((loc) => ({ category: cat.slug, state: loc.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getUAECategoryAR(params.category);
  const loc = getUAELocationAR(params.state);
  if (!cat || !loc) return {};
  const title = `أفضل ${cat.plural} في ${loc.name} – توظيف ${cat.name} معتمد | بيداروا`;
  const description = `ابحث عن ${cat.plural} في ${loc.name}. أنشئ مشروعك مجاناً واحصل على عروض من ${cat.name} موثقين في ${loc.name} خلال ساعات.`;
  const url = `https://biddaro.com/uae/ar/hire/${cat.slug}/${loc.slug}`;
  return {
    title, description,
    keywords: [`${cat.plural} ${loc.name}`, `${cat.name} في ${loc.name}`, `مقاول ${loc.name}`, `توظيف ${cat.name} ${loc.name}`],
    alternates: {
      canonical: url,
      languages: {
        'en-AE': `https://biddaro.com/uae/hire/${cat.slug}/${loc.slug}`,
        'ar-AE': url,
      },
    },
    openGraph: { title, description, url, type: 'website', locale: 'ar_AE', siteName: 'بيداروا' },
  };
}

function JsonLd({
  cat, loc,
}: {
  cat: NonNullable<ReturnType<typeof getUAECategoryAR>>;
  loc: NonNullable<ReturnType<typeof getUAELocationAR>>;
}) {
  const url = `https://biddaro.com/uae/ar/hire/${cat.slug}/${loc.slug}`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'مقاولو الإمارات', item: 'https://biddaro.com/uae/ar/hire' },
        { '@type': 'ListItem', position: 3, name: cat.plural, item: `https://biddaro.com/uae/ar/hire/${cat.slug}` },
        { '@type': 'ListItem', position: 4, name: loc.name, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `خدمات ${cat.name} في ${loc.name}`,
      description: cat.longDesc.replace(/\{state\}/g, loc.name),
      provider: { '@type': 'Organization', name: 'بيداروا', url: 'https://biddaro.com' },
      areaServed: { '@type': 'AdministrativeArea', name: loc.name, containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' } },
      inLanguage: 'ar',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: cat.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q.replace(/\{state\}/g, loc.name),
        acceptedAnswer: { '@type': 'Answer', text: faq.a.replace(/\{state\}/g, loc.name) },
      })),
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function UAEArEmiratePage({ params }: Props) {
  const cat = getUAECategoryAR(params.category);
  const loc = getUAELocationAR(params.state);
  if (!cat || !loc) notFound();
  const otherLocations = UAE_LOCATIONS_AR.filter((l) => l.slug !== loc.slug);

  return (
    <>
      <JsonLd cat={cat} loc={loc} />

      {/* Breadcrumbs */}
      <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center gap-2 text-sm text-dark-500 flex-wrap">
            <li><Link href="/" className="hover:text-brand-600">الرئيسية</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 rotate-180" /></li>
            <li><Link href="/uae/ar/hire" className="hover:text-brand-600">مقاولو الإمارات</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 rotate-180" /></li>
            <li><Link href={`/uae/ar/hire/${cat.slug}`} className="hover:text-brand-600">{cat.plural}</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 rotate-180" /></li>
            <li className="text-dark-800 font-medium">{loc.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-bl from-dark-900 via-dark-800 to-brand-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <MapPin className="w-3 h-3" /> {loc.name}، الإمارات العربية المتحدة
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            أفضل {cat.plural} في {loc.name}
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mb-8">
            {cat.longDesc.replace(/\{state\}/g, loc.name)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
              أنشئ مشروعك مجاناً <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>
            <Link href={`/uae/hire/${cat.slug}/${loc.slug}`} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors border border-white/20 text-sm">
              View in English
            </Link>
          </div>
        </div>
      </section>

      {/* Cities in emirate */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">{cat.plural} في مناطق {loc.name}</h2>
          <p className="text-dark-500 mb-8">اختر منطقتك لعرض {cat.plural} المتوفرين بالقرب منك.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {loc.cities.map((city) => (
              <Link
                key={city.slug}
                href={`/uae/ar/hire/${cat.slug}/${loc.slug}/${city.slug}`}
                className="group flex items-center justify-between bg-white border border-gray-200 hover:border-brand-300 hover:shadow-sm rounded-lg px-4 py-3 transition-all"
              >
                <div>
                  <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700">{city.name}</p>
                  <p className="text-xs text-brand-600 mt-0.5">{cat.name} ←</p>
                </div>
                <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500 rotate-180" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">خدمات {cat.name} في {loc.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cat.skills.map((skill) => (
              <div key={skill} className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-brand-500 font-bold">✓</span>
                <span className="text-sm font-medium text-dark-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Emirates */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">{cat.plural} في إمارات أخرى</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {otherLocations.map((l) => (
              <Link key={l.slug} href={`/uae/ar/hire/${cat.slug}/${l.slug}`}
                className="group flex items-center justify-between bg-white border border-gray-200 hover:border-brand-300 rounded-lg px-4 py-3 transition-all">
                <span className="text-sm font-medium text-dark-700 group-hover:text-brand-700">{l.name}</span>
                <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500 rotate-180" />
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
                  <span className="font-medium text-dark-800 text-sm leading-relaxed">{faq.q.replace(/\{state\}/g, loc.name)}</span>
                  <ChevronRight className="w-4 h-4 text-dark-400 flex-shrink-0 group-open:rotate-90 rotate-180 transition-transform" />
                </summary>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-dark-600 leading-relaxed">{faq.a.replace(/\{state\}/g, loc.name)}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-l from-brand-500 to-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">وظف {cat.name} في {loc.name} اليوم</h2>
          <p className="text-brand-100 mb-8">أنشئ مجاناً. احصل على عروض. ادفع بأمان. بلا رسوم خفية.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-brand-600 hover:bg-brand-50 font-bold px-10 py-4 rounded-xl transition-colors text-lg">
            ابدأ مجاناً الآن
          </Link>
        </div>
      </section>
    </>
  );
}
