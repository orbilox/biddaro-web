import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowRight, Info, CheckCircle } from 'lucide-react';
import { UAE_COST_SERVICES_AR, getUAECostServiceAR, getRelatedUAECostServicesAR } from '@/lib/cost-data-uae-ar';
import { UAE_LOCATIONS_AR } from '@/lib/seo-data-uae-ar';

interface Props { params: { service: string } }

export function generateStaticParams() {
  return UAE_COST_SERVICES_AR.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const svc = getUAECostServiceAR(params.service);
  if (!svc) return {};
  const title = `${svc.name} في الإمارات ${new Date().getFullYear()} – الأسعار والتفاصيل | بيداروا`;
  const desc = svc.metaDesc.replace(/\{city\}/g, 'الإمارات');
  const url = `https://biddaro.com/uae/ar/cost/${svc.slug}`;
  return {
    title, description: desc,
    keywords: [`${svc.name} الإمارات`, `تكلفة ${svc.name}`, `أسعار ${svc.name} دبي`, `${svc.name} أبوظبي 2026`],
    alternates: {
      canonical: url,
      languages: {
        'en-AE': `https://biddaro.com/uae/cost/${svc.slug}`,
        'ar-AE': url,
      },
    },
    openGraph: { title, description: desc, url, type: 'website', locale: 'ar_AE', siteName: 'بيداروا' },
  };
}

function JsonLd({ svc }: { svc: NonNullable<ReturnType<typeof getUAECostServiceAR>> }) {
  const url = `https://biddaro.com/uae/ar/cost/${svc.slug}`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'دليل الأسعار', item: 'https://biddaro.com/uae/ar/cost' },
        { '@type': 'ListItem', position: 3, name: svc.name, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: svc.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q.replace(/\{city\}/g, 'الإمارات'),
        acceptedAnswer: { '@type': 'Answer', text: faq.a.replace(/\{city\}/g, 'الإمارات') },
      })),
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function UAEArCostServicePage({ params }: Props) {
  const svc = getUAECostServiceAR(params.service);
  if (!svc) notFound();
  const related = getRelatedUAECostServicesAR(params.service);

  return (
    <>
      <JsonLd svc={svc} />

      {/* Breadcrumbs */}
      <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center gap-2 text-sm text-dark-500 flex-wrap">
            <li><Link href="/" className="hover:text-brand-600">الرئيسية</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 rotate-180" /></li>
            <li><Link href="/uae/ar/cost" className="hover:text-brand-600">دليل الأسعار</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5 rotate-180" /></li>
            <li className="text-dark-800 font-medium">{svc.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-bl from-dark-900 via-dark-800 to-brand-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">{svc.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{svc.headline}</h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto mb-6">{svc.intro.replace(/\{city\}/g, 'الإمارات')}</p>
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 px-6 py-3 rounded-xl text-white">
            <span className="text-sm">متوسط السعر:</span>
            <span className="text-xl font-bold text-brand-300">{svc.avgLow} – {svc.avgHigh}</span>
            <span className="text-sm text-dark-300">{svc.avgUnit}</span>
          </div>
          <div className="mt-6">
            <Link href={`/uae/cost/${svc.slug}`} className="text-sm text-dark-400 hover:text-brand-300 underline underline-offset-2">
              View in English
            </Link>
          </div>
        </div>
      </section>

      {/* Cost table */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-6">جدول الأسعار التفصيلي</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right px-4 py-3 font-semibold text-dark-700">البند</th>
                  <th className="text-right px-4 py-3 font-semibold text-dark-700">الحد الأدنى</th>
                  <th className="text-right px-4 py-3 font-semibold text-dark-700">الحد الأقصى</th>
                  <th className="text-right px-4 py-3 font-semibold text-dark-700">الوحدة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {svc.items.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-dark-800">{item.label}</td>
                    <td className="px-4 py-3 text-emerald-700 font-semibold">{item.low}</td>
                    <td className="px-4 py-3 text-dark-700 font-semibold">{item.high}</td>
                    <td className="px-4 py-3 text-dark-400">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-dark-400 mt-3 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> الأسعار تقريبية وتختلف حسب الموقع والمواد والمقاول. احصل على عروض من مقاولين معتمدين للأسعار الدقيقة.
          </p>
        </div>
      </section>

      {/* Factors */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">العوامل المؤثرة في التكلفة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {svc.factors.map((factor, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
                <CheckCircle className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-dark-600 leading-relaxed">{factor.replace(/\{city\}/g, 'الإمارات')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">نصائح للتوفير وضمان الجودة</h2>
          <div className="space-y-3">
            {svc.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-lg px-4 py-3">
                <span className="text-brand-600 font-bold text-sm mt-0.5 flex-shrink-0">{i + 1}.</span>
                <span className="text-sm text-dark-700 leading-relaxed">{tip.replace(/\{city\}/g, 'الإمارات')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by City */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-2">أسعار {svc.name} حسب المدينة</h2>
          <p className="text-dark-500 mb-6">الأسعار تتفاوت بحسب الموقع والإمارة. اختر مدينتك للحصول على تفاصيل دقيقة.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {UAE_LOCATIONS_AR.flatMap((emirate) =>
              emirate.cities.slice(0, 3).map((city) => (
                <Link
                  key={`${emirate.slug}-${city.slug}`}
                  href={`/uae/ar/cost/${svc.slug}/${city.slug}`}
                  className="group flex items-center justify-between bg-white border border-gray-200 hover:border-brand-300 rounded-lg px-4 py-3 transition-all"
                >
                  <div>
                    <p className="text-sm font-medium text-dark-700 group-hover:text-brand-700">{city.name}</p>
                    <p className="text-xs text-dark-400">{emirate.name}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500 rotate-180" />
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">أسئلة شائعة</h2>
          <div className="space-y-4">
            {svc.faqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none bg-white hover:bg-gray-50">
                  <span className="font-medium text-dark-800 text-sm leading-relaxed">{faq.q.replace(/\{city\}/g, 'الإمارات')}</span>
                  <ChevronRight className="w-4 h-4 text-dark-400 flex-shrink-0 group-open:rotate-90 rotate-180 transition-transform" />
                </summary>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-dark-600 leading-relaxed">{faq.a.replace(/\{city\}/g, 'الإمارات')}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related services */}
      {related.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-dark-900 mb-6">خدمات ذات صلة</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {related.map((s) => (
                <Link key={s.slug} href={`/uae/ar/cost/${s.slug}`}
                  className="group flex items-center gap-2 bg-white border border-gray-200 hover:border-brand-300 rounded-lg px-3 py-3 transition-all">
                  <span className="text-xl">{s.emoji}</span>
                  <span className="text-sm font-medium text-dark-700 group-hover:text-brand-600">{s.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-l from-brand-500 to-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">احصل على عروض أسعار دقيقة لمشروعك</h2>
          <p className="text-brand-100 mb-8">أنشئ مشروعك مجاناً وقارن عروض مقاولين موثقين في إمارتك على الفور.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-brand-600 hover:bg-brand-50 font-bold px-10 py-4 rounded-xl text-lg">
            ابدأ مجاناً الآن <ArrowRight className="w-5 h-5 rotate-180" />
          </Link>
        </div>
      </section>
    </>
  );
}
