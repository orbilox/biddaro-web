import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCity, getAllCitySlugs, CITIES } from '@/lib/ask-city-data';
import { QUESTIONS, CATEGORY_META, type QuestionCategory } from '@/lib/ask-data';

export async function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) return {};
  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: { canonical: `https://biddaro.com/ask/city/${citySlug}` },
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      url: `https://biddaro.com/ask/city/${citySlug}`,
      type: 'website',
    },
  };
}

const CATEGORY_ORDER: QuestionCategory[] = [
  'cost', 'materials', 'planning', 'vastu', 'maintenance', 'hiring', 'legal', 'seasonal',
];

export default async function CityAskPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: `Construction Q&A for ${city.name}`,
    description: city.metaDescription,
    mainEntity: QUESTIONS.slice(0, 5).map((q) => ({
      '@type': 'Question',
      name: `${q.question} in ${city.name}`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${q.summary} In ${city.name}, construction costs range from ₹${city.constructionCost.basic.toLocaleString('en-IN')} to ₹${city.constructionCost.premium.toLocaleString('en-IN')} per sqft.`,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <ol className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li>›</li>
          <li><Link href="/ask" className="hover:text-blue-600">AI Answers</Link></li>
          <li>›</li>
          <li className="text-gray-700 font-medium">{city.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-700 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            📍 {city.name}, {city.state}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Construction &amp; Renovation Answers for <span className="text-blue-300">{city.name}</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl">
            City-specific construction costs, material prices, contractor tips, and local regulations
            tailored specifically for {city.name}.
          </p>

          {/* City Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Basic Build', value: `₹${city.constructionCost.basic.toLocaleString('en-IN')}/sqft` },
              { label: 'Standard Build', value: `₹${city.constructionCost.standard.toLocaleString('en-IN')}/sqft` },
              { label: 'Premium Build', value: `₹${city.constructionCost.premium.toLocaleString('en-IN')}/sqft` },
              { label: 'Mason / Day', value: `₹${city.laborCostPerDay.mason.toLocaleString('en-IN')}` },
            ].map((s) => (
              <div key={s.label} className="bg-blue-800/40 border border-blue-700/60 rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-blue-300 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Tips */}
      <section className="bg-amber-50 border-b border-amber-200 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span>📍</span> {city.name}-Specific Construction Tips
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {city.localTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border border-amber-200 rounded-xl p-4">
                <span className="text-lg shrink-0">💡</span>
                <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City Material Rates */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Current Material Rates in {city.name} (2024)</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Material</th>
                <th className="px-5 py-3 text-left font-semibold">{city.name} Rate</th>
                <th className="px-5 py-3 text-left font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                { material: 'Cement (50kg bag)', rate: `₹${city.cementBagRate}`, notes: 'UltraTech, ACC, Ramco' },
                { material: 'Steel TMT (per kg)', rate: `₹${city.steelRatePerKg}`, notes: 'Fe-500D grade' },
                { material: 'Mason (per day)', rate: `₹${city.laborCostPerDay.mason}`, notes: 'Skilled bricklayer' },
                { material: 'Helper (per day)', rate: `₹${city.laborCostPerDay.helper}`, notes: 'Unskilled labor' },
                { material: 'Painter (per day)', rate: `₹${city.laborCostPerDay.painter}`, notes: 'Interior/exterior' },
              ].map((row, i) => (
                <tr key={row.material} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-5 py-3 border-t border-gray-100 font-medium">{row.material}</td>
                  <td className="px-5 py-3 border-t border-gray-100 text-green-700 font-bold">{row.rate}</td>
                  <td className="px-5 py-3 border-t border-gray-100 text-gray-500">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">* Rates as of 2024. Actual prices may vary by supplier and quantity.</p>
      </section>

      {/* All Questions by Category */}
      <section className="max-w-5xl mx-auto px-4 pb-14 space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Questions Answered for {city.name}</h2>
          <p className="text-gray-500 mb-8">
            Every answer below is tailored with {city.name}-specific pricing, local brands ({city.localBrands.slice(0, 3).join(', ')}), and area-specific tips.
          </p>
        </div>
        {CATEGORY_ORDER.map((cat) => {
          const meta = CATEGORY_META[cat];
          const qs = QUESTIONS.filter((q) => q.category === cat);
          return (
            <div key={cat} id={cat}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{meta.emoji}</span>
                <h3 className={`text-lg font-bold ${meta.color}`}>{meta.label}</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {qs.map((q) => (
                  <Link
                    key={q.slug}
                    href={`/ask/city/${citySlug}/${q.slug}`}
                    className={`group flex items-start gap-3 p-4 rounded-xl border-2 ${meta.bg} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                  >
                    <span className="text-base mt-0.5 shrink-0">💬</span>
                    <div className="min-w-0">
                      <div className={`font-medium text-sm leading-snug ${meta.color} group-hover:underline`}>
                        {q.question} in {city.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">⏱ {q.readTimeMinutes} min · {city.name}-specific</div>
                    </div>
                    <span className="ml-auto text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Other Cities */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse Other Cities</h2>
          <div className="flex flex-wrap gap-2">
            {CITIES.filter((c) => c.slug !== citySlug).slice(0, 20).map((c) => (
              <Link
                key={c.slug}
                href={`/ask/city/${c.slug}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
              >
                📍 {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Need a Contractor in {city.name}?</h2>
          <p className="text-blue-200 mb-6">
            Find verified {city.name} contractors with transparent pricing and escrow protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hire" className="bg-white text-blue-900 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Find {city.name} Contractors →
            </Link>
            <Link href="/ai-assistant" className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/20 transition-colors">
              Ask AI a Question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
