// Export all schema types here
import caseStudy from './caseStudy'
import challenge from './challenge'
import investigationCard from './investigationCard'
import homePage from './homePage'
import aboutPage from './aboutPage'

export const schemaTypes = [homePage, aboutPage, caseStudy, challenge, investigationCard]
export const sanitySchemaTypeNames = schemaTypes.map((schemaType) => schemaType.name)

