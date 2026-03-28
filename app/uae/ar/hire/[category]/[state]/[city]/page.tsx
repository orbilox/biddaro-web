import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Star, CheckCircle, ArrowRight, ChevronRight,
  Shield, Zap, DollarSign, Clock, Users, Award,
} from 'lucide-react';
import {
  UAE_JOB_CATEGORY_META_AR, UAE_LOCATIONS_AR,
  getUAECategoryAR, getUAELocationAR, getUAECityAR,
} from '@/lib/seo-data-uae-ar';

interface Props {
  params: { category: string; state: string; city: string };
}

export function generateStaticParams() {
  return UAE_JOB_CATEGORY_META_AR.flatMap((cat) =>
    UAE_LOCATIONS_AR.flatMap((loc) =>
      loc.cities.map((city) => ({ category: cat.slug, state: loc.slug, city: city.slug }))
    )
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getUAECategoryAR(params.category);
  const loc = getUAELocationAR(params.state);
  const city = getUAECityAR(params.state, params.city);
  if (!cat || !loc || !city) return {};

  const title = `أفضل ${cat.plural} في ${city.name}، ${loc.name} – توظيف محترفين محليين | بيداروا`;
  const description = `هل تبحث عن ${cat.plural} في ${city.name}؟ أنشئ مشروع ${cat.name} مجاناً على بيداروا واحصل على عروض من مقاولين موثقين في ${city.name}، ${loc.name} خلال ساعات.`;
  const url = `https://biddaro.com/uae/ar/hire/${cat.slug}/${loc.slug}/${city.slug}`;

  return {
    title,
    description,
    keywords: [
      `${cat.plural} ${city.name}`,
      `${cat.name} في ${city.name}`,
      `توظيف ${cat.plural} ${city.name}`,
      `${cat.name} بالقرب مني ${city.name}`,
      `أفضل ${cat.name} ${city.name} ${loc.name}`,
    ],
    alternates: {
      canonical: url,
      languages: {
        'en-AE': `https://biddaro.com/uae/hire/${cat.slug}/${loc.slug}/${city.slug}`,
        'ar-AE': url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'ar_AE',
      siteName: 'بيداروا',
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  };
}

function JsonLd({
  cat, loc, city,
}: {
  cat: NonNullable<ReturnType<typeof getUAECategoryAR>>;
  loc: NonNullable<ReturnType<typeof getUAELocationAR>>;
  city: NonNullable<ReturnType<typeof getUAECityAR>>;
}) {
  const url = `https://biddaro.com/uae/ar/hire/${cat.slug}/${loc.slug}/${city.slug}`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'مقاولو الإمارات', item: 'https://biddaro.com/uae/ar/hire' },
        { '@type': 'ListItem', position: 3, name: cat.plural, item: `https://biddaro.com/uae/ar/hire/${cat.slug}` },
        { '@type': 'ListItem', position: 4, name: loc.name, item: `https://biddaro.com/uae/ar/hire/${cat.slug}/${loc.slug}` },
        { '@type': 'ListItem', position: 5, name: city.name, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `خدمات ${cat.name} في ${city.name}`,
      description: cat.longDesc.replace(/\{state\}/g, city.name),
      provider: { '@type': 'Organization', name: 'بيداروا', url: 'https://biddaro.com' },
      areaServed: {
        '@type': 'City',
        name: city.name,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: loc.name,
          containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' },
        },
      },
      inLanguage: 'ar',
      url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: cat.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q.replace(/\{state\}/g, city.name),
        acceptedAnswer: { '@type': 'Answer', text: faq.a.replace(/\{state\}/g, city.name) },
      })),
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

function getDummyContractors(cat: NonNullable<ReturnType<typeof getUAECategoryAR>>) {
  return [
    { id: 1, name: 'الجزيرة للإنشاءات', rating: 4.9, reviews: 87, jobs: 156, verified: true, specialty: cat.skills[0] },
    { id: 2, name: 'الإمارات بيلد ماسترز', rating: 4.7, reviews: 52, jobs: 93, verified: true, specialty: cat.skills[1 % cat.skills.length] },
    { id: 3, name: 'الخليج برو سيرفيسز', rating: 4.6, reviews: 34, jobs: 61, verified: true, specialty: cat.skills[2 % cat.skills.length] },
    { id: 4, name: 'دار للإنشاءات', rating: 4.5, reviews: 28, jobs: 44, verified: false, specialty: cat.skills[3 % cat.skills.length] },
    { id: 5, name: 'نخيل المقاولون', rating: 4.8, reviews: 71, jobs: 118, verified: true, specialty: cat.skills[4 % cat.skills.length] },
    { id: 6, name: 'راك بيلدرز', rating: 4.4, reviews: 19, jobs: 32, verified: false, specialty: cat.skills[0] },
  ];
}

export default function UAEArCityPage({ params }: Props) {
  const cat = getUAECategoryAR(params.category);
  const loc = getUAELocationAR(params.state);
  const city = getUAECityAR(params.state, params.city);
  if (!cat || !loc || !city) notFound();

  const contractors = getDummyContractors(cat);
  const otherCities = loc.cities.filter((c) => c.slug !== city.slug);
  const otherCategories = UAE_JOB_CATEGORY_META_AR.filter((c) => c.slug !== cat.slug).slice(0, 8);

  return (
    <>
      <JsonLd cat={cat} loc={loc} city={city} />

      {/* Breadcrumbs */}
      <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3" aria-label="مسار التنقل">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center gap-2 text-sm text-dark-500 flex-wrap">
            <li><Link href="/" className="hover:text-brand-600">الرئيسية</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 rotate-180" /></li>
            <li><Link href="/uae/ar/hire" className="hover:text-brand-600">مقاولو الإمارات</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 rotate-180" /></li>
            <li><Link href={`/uae/ar/hire/${cat.slug}`} className="hover:text-brand-600">{cat.plural}</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 rotate-180" /></li>
            <li><Link href={`/uae/ar/hire/${cat.slug}/${loc.slug}`} className="hover:text-brand-600">{loc.name}</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 rotate-180" /></li>
            <li className="text-dark-800 font-medium">{city.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-bl from-dark-900 via-dark-800 to-brand-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <MapPin className="w-3 h-3" /> {city.name}، {loc.name}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            أفضل {cat.plural} في {city.name}
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mb-8">
            {cat.longDesc.replace(/\{state\}/g, city.name)} نخدم جميع مناطق {city.name} والمناطق المحيطة في {loc.name}.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { icon: Shield, label: 'مقاولون موثقون' },
              { icon: Zap, label: 'محليون ومتوفرون' },
              { icon: DollarSign, label: 'أسعار شفافة' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/10 px-3 py-1.5 rounded-full">
                <Icon className="w-3.5 h-3.5 text-brand-400" /> {label}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
              أنشئ مشروعك مجاناً <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>
            <Link href="/open-jobs" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors border border-white/20">
              تصفح المشاريع في {city.name}
            </Link>
          </div>
          <div className="mt-6">
            <Link href={`/uae/hire/${cat.slug}/${loc.slug}/${city.slug}`} className="text-sm text-dark-400 hover:text-brand-300 underline underline-offset-2">
              View in English
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Users, value: '+100', label: `${cat.plural} في ${city.name}` },
            { icon: Award, value: '4.8★', label: 'متوسط التقييم' },
            { icon: Clock, value: '< 4 ساعات', label: 'أول عرض سعر' },
            { icon: DollarSign, value: cat.avgRate, label: 'متوسط السعر' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="w-5 h-5 text-brand-500 mb-1.5" />
              <p className="text-xl font-bold text-dark-900 leading-tight">{value}</p>
              <p className="text-xs text-dark-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contractors grid */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">{cat.plural} الموثقون في {city.name}</h2>
          <p className="text-dark-500 text-sm mb-8">جميع المقاولين موثقون ومُقيَّمون ومستعدون لتقديم عروض لمشروعك.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {contractors.map((c) => (
              <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-brand-200 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg">
                    {c.name.charAt(0)}
                  </div>
                  {c.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                      <CheckCircle className="w-3 h-3" /> موثق
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-dark-800 group-hover:text-brand-700 text-sm mb-1">{c.name}</h3>
                <div className="flex items-center gap-1 text-xs text-dark-500 mb-2">
                  <MapPin className="w-3 h-3 text-brand-400" /> {city.name}، {loc.name}
                </div>
                <div className="flex items-center gap-3 text-xs text-dark-500 mb-3">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-dark-700">{c.rating}</span>
                    <span>({c.reviews})</span>
                  </span>
                  <span>•</span>
                  <span>{c.jobs} مشروع</span>
                </div>
                <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">{c.specialty}</span>
                <Link href="/register" className="mt-4 block w-full text-center text-sm font-semibold text-brand-600 border border-brand-200 hover:bg-brand-500 hover:text-white hover:border-brand-500 py-2 rounded-lg transition-all">
                  عرض الملف الشخصي
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">خدمات {cat.name} في {city.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cat.skills.map((skill) => (
              <div key={skill} className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span className="text-sm font-medium text-dark-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other cities */}
      {otherCities.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-dark-900 mb-6">{cat.plural} في مناطق أخرى من {loc.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {otherCities.map((c) => (
                <Link key={c.slug} href={`/uae/ar/hire/${cat.slug}/${loc.slug}/${c.slug}`}
                  className="group flex items-center justify-between bg-white border border-gray-200 hover:border-brand-300 rounded-lg px-4 py-3 transition-all">
                  <span className="text-sm font-medium text-dark-700 group-hover:text-brand-700">{c.name}</span>
                  <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500 rotate-180" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other categories */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">مقاولون آخرون في {city.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {otherCategories.map((c) => (
              <Link key={c.slug} href={`/uae/ar/hire/${c.slug}/${loc.slug}/${city.slug}`}
                className="group flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-brand-300 rounded-lg px-3 py-3 transition-all">
                <span className="text-xl">{c.emoji}</span>
                <span className="text-sm font-medium text-dark-700 group-hover:text-brand-600">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cost cross-link */}
      <section className="py-8 px-4 bg-brand-50 border-y border-brand-100">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-dark-900 mb-1">تحقق من أسعار {cat.name} في {city.name}</h3>
            <p className="text-sm text-dark-500">احصل على تفاصيل الأسعار قبل التعاقد مع مقاول.</p>
          </div>
          <Link href="/uae/ar/cost" className="flex-shrink-0 inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors">
            دليل الأسعار <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">أسئلة شائعة</h2>
          <div className="space-y-4">
            {cat.faqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none bg-white hover:bg-gray-50">
                  <span className="font-medium text-dark-800 text-sm leading-relaxed">{faq.q.replace(/\{state\}/g, city.name)}</span>
                  <ChevronRight className="w-4 h-4 text-dark-400 flex-shrink-0 group-open:rotate-90 rotate-180 transition-transform" />
                </summary>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-dark-600 leading-relaxed">{faq.a.replace(/\{state\}/g, city.name)}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-l from-brand-500 to-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            وظف {cat.name} في {city.name} اليوم
          </h2>
          <p className="text-brand-100 mb-8">أنشئ مجاناً. احصل على عروض. ادفع بأمان عبر الضمان. بلا رسوم خفية.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-brand-600 hover:bg-brand-50 font-bold px-10 py-4 rounded-xl transition-colors text-lg">
            ابدأ مجاناً الآن <ArrowRight className="w-5 h-5 rotate-180" />
          </Link>
        </div>
      </section>
    </>
  );
}
