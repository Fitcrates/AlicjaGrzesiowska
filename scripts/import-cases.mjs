/**
 * Import case studies from lib/cases.ts into Sanity.
 * Run with: SANITY_API_TOKEN=<token> node scripts/import-cases.mjs
 */

const PROJECT_ID = 'acuukn8a';
const DATASET = 'production';
const API_VERSION = '2024-06-01';

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error('Error: SANITY_API_TOKEN environment variable is required.');
  console.error('Create a token at https://www.sanity.io/manage and run:');
  console.error('  SANITY_API_TOKEN=<token> node scripts/import-cases.mjs');
  process.exit(1);
}

const cases = [
  {
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'reframing-complexity' },
    year: '2024',
    en: {
      title: 'Reframing Complexity',
      industry: 'Health',
      focus: 'Information Architecture',
      heroQuote: 'The problem wasn\'t too little information — it was too much, in too many places, with no shared language.',
      challenge: 'A large healthcare provider was drowning in disconnected knowledge systems. Clinical teams, operations, and compliance each maintained their own documentation — creating dangerous gaps where critical information should have been aligned. Patient pathways were documented in three different systems with conflicting terminology. Staff spent 40% of their administrative time searching for information that already existed somewhere in the organization.',
      approach: 'Rather than building another layer on top, we went underneath. We mapped the invisible information flows between departments, identified where knowledge was being duplicated, lost, or contradicted, and designed a unified architecture that respects the different needs of each stakeholder group while establishing a single source of truth.',
      process: [
        { _type: 'step', number: '01', title: 'Discovery & Mapping', description: 'Conducted 45+ stakeholder interviews across clinical, operational, and administrative teams. Created a comprehensive knowledge map showing how information actually flows (vs. how people think it flows). Identified 12 critical knowledge gaps and 23 instances of conflicting documentation.' },
        { _type: 'step', number: '02', title: 'Taxonomy Design', description: 'Developed a unified classification system that bridges clinical terminology with operational language. Created controlled vocabularies that allow each department to use familiar terms while maintaining system-wide consistency. Built metadata schemas that enable cross-referencing across previously siloed domains.' },
        { _type: 'step', number: '03', title: 'Architecture & Governance', description: 'Designed a tiered information architecture: a core knowledge base for organization-wide truths, department-specific layers for specialized content, and a dynamic integration layer that surfaces relevant connections. Established governance protocols including ownership matrices, review cycles, and deprecation workflows.' },
        { _type: 'step', number: '04', title: 'Implementation & Training', description: 'Rolled out the new architecture in phases, starting with the highest-impact knowledge domains. Created migration guides for existing content. Trained 120+ staff members on the new system, with role-specific workshops for content creators, reviewers, and consumers.' },
      ],
      deliverables: [
        'Comprehensive knowledge map & gap analysis',
        'Unified taxonomy with 340+ controlled terms',
        'Information architecture blueprint',
        'Governance framework & ownership matrix',
        'Migration strategy & implementation roadmap',
        'Training program for 120+ staff',
      ],
      results: 'Within six months, the organization reduced information search time by 62%. Cross-departmental knowledge conflicts dropped by 89%. The new architecture became the foundation for a digital transformation initiative that was previously blocked by inconsistent data foundations. Most importantly, staff reported feeling confident that when they found information, it was current, accurate, and complete.',
    },
    gallery: [
      { _type: 'image', asset: { _type: 'reference', _ref: 'unsplash-placeholder-1' } },
      { _type: 'image', asset: { _type: 'reference', _ref: 'unsplash-placeholder-2' } },
      { _type: 'image', asset: { _type: 'reference', _ref: 'unsplash-placeholder-3' } },
    ],
  },
  {
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'connecting-the-system' },
    year: '2025',
    en: {
      title: 'Connecting the System',
      industry: 'Energy',
      focus: 'Data Visualization',
      heroQuote: 'They had the data. They had the dashboards. What they didn\'t have was understanding.',
      challenge: 'A renewable energy company had invested heavily in data infrastructure but couldn\'t translate their wealth of operational data into actionable intelligence. Executives received 14 different weekly reports from 7 different systems, each telling a different story. Field teams made decisions based on gut feeling because they couldn\'t trust the numbers. The data existed — but the connections between data points were invisible.',
      approach: 'We treated the data ecosystem like a living organism rather than a machine. Instead of adding more dashboards, we redesigned how information flows between systems, how it\'s contextualized for different audiences, and how visual hierarchies guide attention to what actually matters. The goal wasn\'t more visibility — it was better comprehension.',
      process: [
        { _type: 'step', number: '01', title: 'System Audit', description: 'Mapped the complete data ecosystem: 7 source systems, 14 reporting pipelines, 23 dashboard instances. Documented how data transforms (and degrades) as it moves through the chain. Identified 8 points where contextual information was being stripped away, making downstream reports misleading.' },
        { _type: 'step', number: '02', title: 'Narrative Design', description: 'Developed a data narrative framework that structures information around decisions rather than sources. Each visualization layer answers a specific question: What happened? Why? What should we do? Created information density guidelines that match cognitive load to audience expertise.' },
        { _type: 'step', number: '03', title: 'Visual System', description: 'Designed a coherent visual language across all data touchpoints. Standardized color semantics, hierarchy patterns, and interaction models. Created a component library of visualization primitives that can be composed for different contexts while maintaining consistent interpretation.' },
        { _type: 'step', number: '04', title: 'Integration Architecture', description: 'Built a semantic integration layer that preserves context as data moves between systems. Implemented annotation capabilities so domain experts can add qualitative context to quantitative data. Designed alert hierarchies that distinguish signal from noise.' },
      ],
      deliverables: [
        'Data ecosystem map & transformation audit',
        'Decision-centered narrative framework',
        'Visual design system for data communication',
        'Integration architecture specification',
        'Executive dashboard prototype',
        'Field team mobile interface',
      ],
      results: 'The consolidated reporting structure replaced 14 weekly reports with 3 decision-focused views. Field team data trust scores improved from 2.1 to 4.3 (out of 5). Executive decision-making cycles shortened by 40% as leaders could finally see the connections between operational metrics. The company estimated $2.3M in annual savings from faster, more confident decision-making.',
    },
  },
  {
    _type: 'caseStudy',
    slug: { _type: 'slug', current: 'from-insight-to-action' },
    year: '2023',
    en: {
      title: 'From Insight to Action',
      industry: 'Education',
      focus: 'Experience Design',
      heroQuote: 'The institution had been collecting knowledge for 200 years. It had never learned how to share it.',
      challenge: 'A prestigious university had accumulated two centuries of institutional knowledge across faculties, research centers, and administrative bodies. But this knowledge lived in people\'s heads, in filing cabinets, in legacy systems no one maintained. When experienced staff retired, decades of expertise vanished. New faculty spent their first year rediscovering what their predecessors already knew. Research collaborations failed because departments didn\'t know what adjacent teams had already proven.',
      approach: 'We designed a knowledge experience that makes institutional memory accessible, alive, and useful. Not a static archive — a living system that captures expertise in context, surfaces relevant knowledge at the point of need, and grows more valuable with every interaction. The architecture mirrors how academics actually think: in connections, associations, and evolving understanding.',
      process: [
        { _type: 'step', number: '01', title: 'Knowledge Archaeology', description: 'Spent three months embedded in the institution, interviewing 80+ faculty, researchers, and administrators. Mapped informal knowledge networks — who people actually call when they need to know something. Documented 15 critical knowledge domains at risk of loss within 5 years due to retirement.' },
        { _type: 'step', number: '02', title: 'Experience Mapping', description: 'Created journey maps for five key personas: new faculty, senior researchers, administrators, students, and external collaborators. Identified 34 knowledge friction points where people get stuck, give up, or reinvent the wheel. Designed intervention points where the right knowledge at the right time transforms the experience.' },
        { _type: 'step', number: '03', title: 'Architecture Design', description: 'Built a graph-based knowledge architecture that reflects academic thinking: concepts connect to related concepts, findings link to methodologies, expertise maps to people. Designed contribution workflows that capture knowledge as a byproduct of existing work rather than requiring separate documentation effort.' },
        { _type: 'step', number: '04', title: 'Prototype & Iteration', description: 'Developed a working prototype with three pilot departments. Ran 8-week iteration cycles with continuous feedback from active users. Refined the contribution model based on actual behavior patterns — simplifying where people struggled, enriching where they engaged.' },
      ],
      deliverables: [
        'Institutional knowledge risk assessment',
        'Stakeholder journey maps (5 personas)',
        'Graph-based knowledge architecture',
        'Contribution workflow design',
        'Working prototype (3 departments)',
        'Scaling strategy & governance model',
      ],
      results: 'The pilot departments reported a 73% reduction in "rediscovery time" — the hours spent finding out something that was already known. New faculty onboarding time decreased by 35%. Most significantly, the system revealed 12 previously unknown research overlaps between departments, leading to 4 new cross-disciplinary collaborations. The university is now scaling the approach across all faculties.',
    },
  },
];

const mutations = cases.map((doc) => ({ create: doc }));

async function importCases() {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });

  const json = await res.json();

  if (!res.ok) {
    console.error('Import failed:', json);
    process.exit(1);
  }

  const results = json.results || [];
  console.log('Created documents:');
  results.forEach((r) => console.log(`  - ${r.id}`));

  // Now patch nextCase references
  const idMap = {};
  results.forEach((r, i) => {
    const slug = cases[i].slug.current;
    idMap[slug] = r.id;
  });

  const nextCaseMutations = [
    { patch: { id: idMap['reframing-complexity'], set: { nextCase: { _type: 'reference', _ref: idMap['connecting-the-system'] } } } },
    { patch: { id: idMap['connecting-the-system'], set: { nextCase: { _type: 'reference', _ref: idMap['from-insight-to-action'] } } } },
    { patch: { id: idMap['from-insight-to-action'], set: { nextCase: { _type: 'reference', _ref: idMap['reframing-complexity'] } } } },
  ];

  const patchRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations: nextCaseMutations }),
  });

  const patchJson = await patchRes.json();
  if (!patchRes.ok) {
    console.error('NextCase patch failed:', patchJson);
    process.exit(1);
  }

  console.log('Linked nextCase references successfully.');
}

importCases().catch((err) => {
  console.error(err);
  process.exit(1);
});
