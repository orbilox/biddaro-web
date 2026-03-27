import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Star, CheckCircle, ArrowRight, ChevronRight,
  Shield, Zap, DollarSign, Clock, Users, Award,
} from 'lucide-react';
import {
  USA_JOB_CATEGORY_META, USA_LOCATIONS,
  getUSACategory, getUSALocationBySlug, getUSACity,
} from '@/lib/seo-data-usa';

interface Props {
  params: { category: string; state: string; city: string };
}

export function generateStaticParams() {
  return USA_JOB_CATEGORY_META.flatMap((cat) =>
    USA_LOCATIONS.flatMap((loc) =>
      loc.cities.map((city) => ({ category: cat.slug, state: loc.slug, city: city.slug }))
    )
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getUSACategory(params.category);
  const loc = getUSALocationBySlug(params.state);
  const city = getUSACity(params.state, params.city);
  if (!cat || !loc || !city) return {};

  const title = `${cat.plural} in ${city.name}, ${loc.name} – Hire Local ${cat.name} Experts | Biddaro`;
  const description = `Looking for ${cat.plural.toLowerCase()} in ${city.name}? Post your ${cat.name.toLowerCase()} job free on Biddaro and receive bids from verified local contractors in ${city.name}, ${loc.name} within hours.`;
  const url = `https://biddaro.com/us/hire/${cat.slug}/${loc.slug}/${city.slug}`;

  return {
    title,
    description,
    keywords: [
      `${cat.plural.toLowerCase()} in ${city.name}`,
      `${cat.name.toLowerCase()} contractors ${city.name}`,
      `hire ${cat.plural.toLowerCase()} ${city.name}`,
      `${cat.plural.toLowerCase()} near me ${city.name}`,
      `best ${cat.name.toLowerCase()} ${city.name} ${loc.name}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'en_US',
      siteName: 'Biddaro',
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  };
}

function JsonLd({
  cat, loc, city,
}: {
  cat: NonNullable<ReturnType<typeof getUSACategory>>;
  loc: NonNullable<ReturnType<typeof getUSALocationBySlug>>;
  city: NonNullable<ReturnType<typeof getUSACity>>;
}) {
  const url = `https://biddaro.com/us/hire/${cat.slug}/${loc.slug}/${city.slug}`;
  const faqs = cat.faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q.replace(/\{state\}/g, city.name),
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a.replace(/\{state\}/g, city.name),
    },
  }));

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'USA', item: 'https://biddaro.com/us' },
        { '@type': 'ListItem', position: 3, name: 'Find Contractors', item: 'https://biddaro.com/us/hire' },
        { '@type': 'ListItem', position: 4, name: cat.plural, item: `https://biddaro.com/us/hire/${cat.slug}` },
        { '@type': 'ListItem', position: 5, name: loc.name, item: `https://biddaro.com/us/hire/${cat.slug}/${loc.slug}` },
        { '@type': 'ListItem', position: 6, name: city.name, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${cat.name} Services in ${city.name}`,
      description: cat.longDesc.replace(/\{state\}/g, city.name),
      provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
      areaServed: {
        '@type': 'City', name: city.name,
        containedInPlace: { '@type': 'State', name: loc.name },
      },
      url,
    },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function getDummyContractors(
  cat: NonNullable<ReturnType<typeof getUSACategory>>,
  cityName: string,
) {
  return [
    { id: 1, name: 'Liberty Construction Co.', rating: 4.9, reviews: 87, jobs: 156, verified: true, specialty: cat.skills[0] },
    { id: 2, name: 'Eagle Build Services', rating: 4.7, reviews: 52, jobs: 93, verified: true, specialty: cat.skills[1 % cat.skills.length] },
    { id: 3, name: 'All-American Contractors', rating: 4.6, reviews: 34, jobs: 61, verified: true, specialty: cat.skills[2 % cat.skills.length] },
    { id: 4, name: `${cityName} Home Solutions`, rating: 4.5, reviews: 28, jobs: 44, verified: false, specialty: cat.skills[3 % cat.skills.length] },
    { id: 5, name: 'Patriot Pro Builders', rating: 4.8, reviews: 71, jobs: 118, verified: true, specialty: cat.skills[4 % cat.skills.length] },
    { id: 6, name: 'Pinnacle Construction', rating: 4.4, reviews: 19, jobs: 32, verified: false, specialty: cat.skills[0] },
  ];
}

export default function USHireCityPage({ params }: Props) {
  const cat = getUSACategory(params.category);
  const loc = getUSALocationBySlug(params.state);
  const city = getUSACity(params.state, params.city);
  if (!cat || !loc || !city) notFound();

  const contractors = getDummyContractors(cat, city.name);
  const otherCities = loc.cities.filter((c) => c.slug !== city.slug);
  const otherCategories = USA_JOB_CATEGORY_META.filter((c) => c.slug !== cat.slug).slice(0, 8);

  return (
    <>
      <JsonLd cat={cat} loc={loc} city={city} />

      {/* Breadcrumbs */}
      <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center gap-2 text-sm text-dark-500 flex-wrap">
            <li><Link href="/" className="hover:text-brand-600 transition-colors">Home</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link href="/us/hire" className="hover:text-brand-600 transition-colors">Find Contractors</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link href={`/us/hire/${cat.slug}`} className="hover:text-brand-600 transition-colors">{cat.plural}</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link href={`/us/hire/${cat.slug}/${loc.slug}`} className="hover:text-brand-600 transition-colors">{loc.name}</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-dark-800 font-medium">{city.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <MapPin className="w-3 h-3" /> {city.name}, {loc.name}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Top {cat.plural} in {city.name}
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mb-8">
            {cat.longDesc.replace(/\{state\}/g, city.name)} Serving all areas of {city.name} and surrounding {loc.name} regions.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { icon: Shield, label: 'Background Verified' },
              { icon: Zap, label: 'Local Contractors' },
              { icon: DollarSign, label: 'Transparent Pricing' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/10 px-3 py-1.5 rounded-full">
                <Icon className="w-3.5 h-3.5 text-brand-400" /> {label}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Post Your Job Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/open-jobs"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors border border-white/20"
            >
              Browse Jobs in {city.name}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Users, value: '100+', label: `${cat.plural} in ${city.name}` },
            { icon: Award, value: '4.8\u2605', label: 'Avg. Rating' },
            { icon: Clock, value: '< 4 hrs', label: 'First Bid Time' },
            { icon: DollarSign, value: cat.avgRate, label: 'Avg. Rate' },
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
          <h2 className="text-2xl font-bold text-dark-900 mb-2">
            Verified {cat.plural} in {city.name}
          </h2>
          <p className="text-dark-500 text-sm mb-8">
            All contractors are verified, reviewed, and ready to bid on your project.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {contractors.map((c) => (
              <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-brand-200 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg">
                    {c.name.charAt(0)}
                  </div>
                  {c.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-dark-800 group-hover:text-brand-700 text-sm mb-1">{c.name}</h3>
                <div className="flex items-center gap-1 text-xs text-dark-500 mb-2">
                  <MapPin className="w-3 h-3 text-brand-400" /> {city.name}, {loc.name}
                </div>
                <div className="flex items-center gap-3 text-xs text-dark-500 mb-3">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-dark-700">{c.rating}</span>
                    <span>({c.reviews})</span>
                  </span>
                  <span>&bull;</span>
                  <span>{c.jobs} jobs</span>
                </div>
                <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">{c.specialty}</span>
                <Link
                  href="/register"
                  className="mt-4 block w-full text-center text-sm font-semibold text-brand-600 border border-brand-200 hover:bg-brand-500 hover:text-white hover:border-brand-500 py-2 rounded-lg transition-all"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services in this city */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">
            {cat.name} Services in {city.name}
          </h2>
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

      {/* Other cities in state */}
      {otherCities.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-dark-900 mb-6">
              {cat.plural} in Other Cities of {loc.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {otherCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/us/hire/${cat.slug}/${loc.slug}/${c.slug}`}
                  className="group flex items-center justify-between bg-white border border-gray-200 hover:border-brand-300 rounded-lg px-4 py-3 transition-all"
                >
                  <span className="text-sm font-medium text-dark-700 group-hover:text-brand-700">{c.name}</span>
                  <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other categories in this city */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">
            Other Contractors in {city.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/us/hire/${c.slug}/${loc.slug}/${city.slug}`}
                className="group flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-brand-300 rounded-lg px-3 py-3 transition-all"
              >
                <span className="text-xl">{c.emoji}</span>
                <span className="text-sm font-medium text-dark-700 group-hover:text-brand-600">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">FAQs</h2>
          <div className="space-y-4">
            {cat.faqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none bg-white hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-dark-800 text-sm leading-relaxed">
                    {faq.q.replace(/\{state\}/g, city.name)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-dark-400 flex-shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-dark-600 leading-relaxed">
                    {faq.a.replace(/\{state\}/g, city.name)}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-500 to-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hire a {cat.name} Contractor in {city.name} Today
          </h2>
          <p className="text-brand-100 mb-8">
            Post free. Receive bids. Pay safely via escrow. No hidden fees.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-brand-600 hover:bg-brand-50 font-bold px-10 py-4 rounded-xl transition-colors text-lg"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
