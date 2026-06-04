import HeroV2 from "@/components/sections/HeroV2";
import ChallengeSelection from "@/components/sections/ChallengeSelection";
import ScatteredKnowledge from "@/components/sections/ScatteredKnowledge";
import InvestigationCards from "@/components/sections/InvestigationCards";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import ContactFooter from "@/components/sections/ContactFooter";

import { sanityFetch } from "@/sanity/lib/fetch";
import { sanityCacheTags } from "@/sanity/lib/client";
import { homePageQuery, challengesQuery, investigationCardsQuery, caseStudiesQuery } from "@/sanity/lib/queries";
import type { Challenge, HomePage, InvestigationCard, PortfolioCase } from "@/sanity/lib/types";
import { getLocale, locales } from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = getLocale(lang);
  if (!locales.includes(locale)) notFound();

  const queryParams = { lang: locale };

  const [homePage, challenges, investigationCards, cases] = await Promise.all([
    sanityFetch<HomePage | null>({ query: homePageQuery, params: queryParams, tags: [sanityCacheTags.homePage] }),
    sanityFetch<Challenge[]>({ query: challengesQuery, params: queryParams, tags: [sanityCacheTags.challenge] }),
    sanityFetch<InvestigationCard[]>({ query: investigationCardsQuery, params: queryParams, tags: [sanityCacheTags.investigationCard] }),
    sanityFetch<PortfolioCase[]>({ query: caseStudiesQuery, params: queryParams, tags: [sanityCacheTags.caseStudy] }),
  ]);

  return (
    <>
      <HeroV2 data={homePage} locale={locale} />
      <ChallengeSelection data={homePage} challenges={challenges} cases={cases} locale={locale} />
      <ScatteredKnowledge data={homePage} locale={locale} />
      <InvestigationCards cards={investigationCards} data={homePage} locale={locale} />
      <PortfolioGrid cases={cases} data={homePage} locale={locale} />
      <ContactFooter data={homePage} locale={locale} />
    </>
  );
}
