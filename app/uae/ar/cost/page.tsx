import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { UAE_COST_SERVICES_AR } from '@/lib/cost-data-uae-ar';

export const metadata: Metadata = {
  title: 'أسعار البناء والمقاولين في الإمارات 2026 | بيداروا',
  description:
    'دليل شامل لأسعار البناء والمقاولين في الإمارات العربية المتحدة 2026. تكلفة الفلل والسباكة والكهرباء والتكييف والدهانات وكل خدمات البناء بالدرهم الإماراتي.',
  keywords: [
    'تكلفة بناء فيلا الإمارات', 'أسعار مقاولين دبي', 'سعر السباكة أبوظبي',
    'تكلفة تكييف الإمارات', 'أسعار دهانات الشارقة', 'تكاليف البناء الإمارات 2026',
  ],
  alternates: {
    canonical: 'https://biddaro.com/uae/ar/cost',
    languages: {
      'en-AE': 'https://biddaro.com/uae/cost',
      'ar-AE': 'https://biddaro.com/uae/ar/cost',
    },
  },
  openGraph: {
    title: 'أسعار البناء في الإمارات 2026 | بيداروا',
    description: 'دليل أسعار شامل لجميع خدمات البناء في الإمارات بالدرهم الإماراتي.',
    url: 'https://biddaro.com/uae/ar/cost',
    type: 'website',
    locale: 'ar_AE',
  },
};

export default function UAEArCostHubPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-bl from-dark-900 via-dark-800 to-brand-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            أسعار محدثة 2026 – بالدرهم الإماراتي
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            دليل أسعار البناء<br className="hidden sm:block" />
            <span className="text-brand-400">في الإمارات 2026</span>
          </h1>
          <p className="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
            تكاليف دقيقة وشفافة لكل خدمات البناء في الإمارات. قارن الأسعار وخطط ميزانيتك بثقة قبل البدء في مشروعك.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl">
              احصل على عروض أسعار مجانية <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>
            <Link href="/uae/cost" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 text-sm">
              View in English
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900">دليل التكاليف حسب الخدمة</h2>
            <p className="text-dark-500 mt-2">اختر الخدمة لعرض تفاصيل الأسعار والعوامل المؤثرة في التكلفة.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {UAE_COST_SERVICES_AR.map((svc) => (
              <Link
                key={svc.slug}
                href={`/uae/ar/cost/${svc.slug}`}
                className="group bg-white border border-gray-200 hover:border-brand-400 hover:shadow-md rounded-xl p-5 transition-all"
              >
                <div className="text-4xl mb-3">{svc.emoji}</div>
                <h3 className="font-bold text-dark-800 group-hover:text-brand-700 mb-2 text-sm leading-snug">{svc.name}</h3>
                <p className="text-xs text-dark-500 mb-3 leading-relaxed line-clamp-2">{svc.intro.replace(/\{city\}/g, 'الإمارات').slice(0, 80)}...</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-600">
                    {svc.avgLow} – {svc.avgHigh}
                  </span>
                  <span className="text-xs text-dark-400">{svc.avgUnit}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why prices vary */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">لماذا تختلف أسعار البناء في الإمارات؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'الموقع الجغرافي', desc: 'أسعار دبي وأبوظبي أعلى من الإمارات الشمالية بسبب ارتفاع تكلفة المعيشة وأجور العمال.' },
              { title: 'جودة المواد', desc: 'الفرق بين المواد الاقتصادية والفاخرة يُحدث أثراً كبيراً على إجمالي تكلفة المشروع.' },
              { title: 'معايير الاستدامة', desc: 'الامتثال لمعايير الاستدامة وعزل الحرارة يرفع التكلفة المبدئية لكنه يوفر على المدى البعيد.' },
              { title: 'الطلب الموسمي', desc: 'أسعار المقاولين ترتفع في مواسم الذروة (يناير-مارس وأكتوبر-نوفمبر) مع تزايد الطلب.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-dark-800 mb-2">{title}</h3>
                <p className="text-sm text-dark-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-l from-brand-500 to-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">احصل على عروض أسعار دقيقة لمشروعك</h2>
          <p className="text-brand-100 text-lg mb-8">أنشئ مشروعك مجاناً وقارن عروض مقاولين موثقين في إمارتك.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-brand-600 hover:bg-brand-50 font-bold px-10 py-4 rounded-xl text-lg">
            ابدأ مجاناً الآن
          </Link>
        </div>
      </section>
    </>
  );
}
