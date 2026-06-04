import { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";
import { getAllSlugs, getCaseBySlug } from "@/sanity/lib/cases";
import CaseStudyContent from "@/components/case-study/CaseStudyContent";
import ContactFooter from "@/components/sections/ContactFooter";
import { sanityFetch } from "@/sanity/lib/fetch";
import { sanityCacheTags } from "@/sanity/lib/client";
import { homePageQuery } from "@/sanity/lib/queries";
import type { HomePage } from "@/sanity/lib/types";
import { getLocale, locales } from "@/lib/i18n";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();

  return slugs.flatMap((slug) => locales.map((lang) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const study = await getCaseBySlug(slug, getLocale(lang));

  if (!study) return { title: "Not Found" };

  return {
    title: `${stegaClean(study.title)} - Alicja`,
    description: stegaClean(study.heroQuote),
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = getLocale(lang);

  if (!locales.includes(locale)) notFound();

  const study = await getCaseBySlug(slug, locale);
  if (!study) notFound();

  const homePage = await sanityFetch<HomePage | null>({
    query: homePageQuery,
    params: { lang: locale },
    tags: [sanityCacheTags.homePage],
  });

  return (
    <>
      <CaseStudyContent study={study} data={homePage} locale={locale} />
      <ContactFooter data={homePage} />
    </>
  );
}
