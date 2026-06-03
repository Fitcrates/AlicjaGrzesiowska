export type HomePage = {
  heroTopText?: string
  heroWords?: string[]
  heroPrefix?: string
  heroScrollLabel?: string
  challengeIntroText?: string
  challengeIntroHeading?: string
  challengesSectionLabel?: string
  challengeLabel?: string
  relatedWorkLabel?: string
  nextChallengeLabel?: string
  knowledgeUnfixedTitle?: string
  knowledgeUnfixedDesc?: string
  knowledgeFixedTitle?: string
  knowledgeFixedDesc?: string
  knowledgeSectionLabel?: string
  healthyEcosystemLabel?: string
  brokenConnectionLabel?: string
  duplicateSignalLabel?: string
  modalTitle?: string
  modalDescriptionPrefix?: string
  modalDescriptionSuffix?: string
  currentStateTitle?: string
  currentStateDesc?: string
  targetStateTitle?: string
  targetStateDesc?: string
  applyFixLabel?: string
  resetLabel?: string
  dataLabel?: string
  storyLabel?: string
  audienceLabel?: string
  contextLabel?: string
  designLabel?: string
  hubUnfixedLine1?: string
  hubUnfixedLine2?: string
  hubFixedLine1?: string
  hubFixedLine2?: string
  modalQuote?: string
  perspectivesSectionLabel?: string
  exploreHowLabel?: string
  closeLabel?: string
  portfolioSectionLabel?: string
  backToIndexLabel?: string
  challengeSectionTitle?: string
  approachSectionTitle?: string
  processSectionTitle?: string
  gallerySectionTitle?: string
  deliverablesSectionTitle?: string
  impactSectionTitle?: string
  nextProjectLabel?: string
  continueReadingLabel?: string
  industryLabel?: string
  yearLabel?: string
  focusLabel?: string
  viewCaseLabel?: string
  contactSectionLabel?: string
  footerTitle?: string
  footerEmail?: string
  footerLocation?: string
  footerTagline?: string
  nameLabel?: string
  emailLabel?: string
  messageLabel?: string
  sendingLabel?: string
  sendMessageLabel?: string
  formSuccessMessage?: string
  formErrorMessage?: string
  footerLinks?: Array<{
    label?: string
    url?: string
  }>
}

export type Challenge = {
  _id?: string
  id?: string
  number: string
  title: string
  pathHero?: string
  pathContent?: Array<{
    heading?: string
    body?: string
  }>
  relatedCases?: string[]
  nextChallengeId?: string
}

export type InvestigationCard = {
  _id?: string
  id?: string
  number: string
  category: string
  title: string
  backTitle?: string
  backContent?: string
}

export type PortfolioCase = {
  _id?: string
  _type?: 'caseStudy'
  slug: string
  title: string
  industry: string
  year: string
  focus: string
  heroQuote: string
  challenge: string
  approach: string
  process: Array<{
    number: string
    title: string
    description: string
  }>
  deliverables: string[]
  results: string
  gallery?: Array<{ asset?: { url?: string } }>
  galleryUrls?: string[]
  nextCase?: string
}

export type AboutPage = {
  title?: string
  subtitle?: string
  story?: Array<{
    heading?: string
    body?: string
  }>
  experienceTitle?: string
  experience?: Array<{
    role?: string
    company?: string
    years?: string
  }>
  projectsCtaTitle?: string
  profileImageUrl?: string
}
