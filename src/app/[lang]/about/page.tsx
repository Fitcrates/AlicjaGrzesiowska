import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { sanityCacheTags } from "@/sanity/lib/client";
import { aboutPageQuery, homePageQuery, caseStudiesQuery } from "@/sanity/lib/queries";
import type { AboutPage, HomePage, PortfolioCase } from "@/sanity/lib/types";
import { getLocale, locales } from "@/lib/i18n";
import AboutHero from "@/components/about/AboutHero";
import ContactFooter from "@/components/sections/ContactFooter";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import { Metadata } from "next";
import { stegaClean } from "next-sanity";

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = getLocale(lang);
  
  const aboutPage = await sanityFetch<AboutPage | null>({ 
    query: aboutPageQuery, 
    params: { lang: locale },
    tags: [sanityCacheTags.aboutPage],
  });

  if (!aboutPage) return { title: "About" };

  return {
    title: `${stegaClean(aboutPage.title)} - Alicja`,
    description: stegaClean(aboutPage.subtitle),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = getLocale(lang);
  if (!locales.includes(locale)) notFound();

  const queryParams = { lang: locale };

  const [aboutPage, homePage, cases] = await Promise.all([
    sanityFetch<AboutPage | null>({ query: aboutPageQuery, params: queryParams, tags: [sanityCacheTags.aboutPage] }),
    sanityFetch<HomePage | null>({ query: homePageQuery, params: queryParams, tags: [sanityCacheTags.homePage] }),
    sanityFetch<PortfolioCase[]>({ query: caseStudiesQuery, params: queryParams, tags: [sanityCacheTags.caseStudy] }),
  ]);

  // Removed if (!aboutPage) notFound() so the page works even before the document is published in Sanity

  return (
    <>
      <AboutHero data={aboutPage} />
      
      {/* Portfolio Grid acts as the CTA to projects */}
      <PortfolioGrid cases={cases} data={homePage} locale={locale} />

      <ContactFooter data={homePage} locale={locale} />
    </>
  );
}
