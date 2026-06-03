import HeroSwitcher from "@/components/sections/HeroSwitcher";
import ChallengeSelection from "@/components/sections/ChallengeSelection";
import ScatteredKnowledge from "@/components/sections/ScatteredKnowledge";
import InvestigationCards from "@/components/sections/InvestigationCards";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import ContactFooter from "@/components/sections/ContactFooter";

import { sanityFetch } from "@/sanity/lib/fetch";
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
    sanityFetch<HomePage | null>({ query: homePageQuery, params: queryParams }),
    sanityFetch<Challenge[]>({ query: challengesQuery, params: queryParams }),
    sanityFetch<InvestigationCard[]>({ query: investigationCardsQuery, params: queryParams }),
    sanityFetch<PortfolioCase[]>({ query: caseStudiesQuery, params: queryParams }),
  ]);

  return (
    <>
      <HeroSwitcher data={homePage} />
      <ChallengeSelection data={homePage} challenges={challenges} cases={cases} locale={locale} />
      <ScatteredKnowledge data={homePage} />
      <InvestigationCards cards={investigationCards} data={homePage} />
      <PortfolioGrid cases={cases} data={homePage} locale={locale} />
      <ContactFooter data={homePage} locale={locale} />
    </>
  );
}
