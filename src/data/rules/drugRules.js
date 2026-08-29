import {
  PUBLIC_CSL_NOTE,
  felony,
  misdemeanor,
  numeric,
  option,
  range,
  select,
  years,
} from './helpers';

const genericFine = [0, 100000];
const possession = (sentence, minimum, maximum, csl, extra = {}) => felony(
  sentence,
  years(minimum),
  years(maximum),
  ...genericFine,
  csl,
  extra,
);

function schedulePossessionOptions(tiers, traffickingNote) {
  const history = [
    ['First offense', 1, false],
    ['Second offense', 2, false],
    ['Third or subsequent offense', 3, true],
  ];

  return tiers.flatMap((tier) => history.map(([historyLabel, csl, doublesMaximum]) => {
    const maximum = doublesMaximum ? tier.maximum * 2 : tier.maximum;
    return option(
      `${tier.label}; ${historyLabel}`,
      possession(`${tier.minimum} to ${maximum} years`, tier.minimum, maximum, csl, {
        notes: doublesMaximum
          ? 'For a third or later simple-possession conviction, the statute doubles the otherwise-applicable maximum. The minimum is not restated and should be confirmed for a filed case.'
          : traffickingNote,
      }),
    );
  }));
}

const narcoticTiers = [
  { label: 'Less than 1 gram or 1 mL', minimum: 1, maximum: 3 },
  { label: '1 to less than 4 grams or mL', minimum: 1, maximum: 8 },
  { label: '4 to less than 28 grams or mL (when no lower trafficking threshold applies)', minimum: 1, maximum: 15 },
];

const nonNarcoticTiers = [
  { label: 'Less than 2 grams or 2 mL', minimum: 1, maximum: 3 },
  { label: '2 to less than 4 grams or mL', minimum: 1, maximum: 8 },
  { label: '4 to less than 28 grams or mL', minimum: 1, maximum: 15 },
];

const trafficking = (sentence, minimum, maximum, fineMinimum, fineMaximum, csl, mustServe, extra = {}) => felony(
  sentence,
  years(minimum),
  years(maximum),
  fineMinimum,
  fineMaximum,
  csl,
  {
    mandatory_minimum: minimum,
    must_serve: mustServe || `${minimum} years, subject to statutory departure provisions`,
    ...extra,
  },
);

export const drugRules = {
  'trafficking-fentanyl': {
    statute: 'O.C.G.A. § 16-13-31(b.1)',
    description: 'Trafficking in fentanyl is weight-tiered. The four current tiers below apply to conduct on or after July 1, 2026.',
    variables: [numeric('weight', 'Fentanyl weight', 'grams', [
      range(4, 8, trafficking('10 to 40 years', 10, 40, 75000, 1000000, 5, '10 years, unless a statutory departure applies', { csl_provisional: true })),
      range(8, 14, trafficking('15 to 40 years', 15, 40, 150000, 1000000, 5, '15 years, unless a statutory departure applies', { csl_provisional: true })),
      range(14, 28, trafficking('25 to 40 years', 25, 40, 250000, 1000000, 6, '25 years, unless a statutory departure applies', { csl_provisional: true })),
      range(28, null, trafficking('35 to 40 years', 35, 40, 750000, 1000000, 8, '35 years, unless a statutory departure applies', { csl_provisional: true })),
    ], {
      input_min: 4,
      help: 'Current tiers effective July 1, 2026. The signed act has ambiguous mixture wording; verify the controlling weight calculation for a real case.',
    })],
    notes: 'HB 535 permits several distinct departure routes. A five-factor judicial departure has lower enumerated ranges; substantial-assistance and agreed-sentence routes operate separately.',
  },

  'possession-sch-1-2': {
    description: 'Simple possession of a Schedule I substance or Schedule II substance. The sentencing tier depends on drug category, weight, and conviction history.',
    variables: [select('weight_history', 'Drug category, weight, and history', [
      ...schedulePossessionOptions(narcoticTiers, 'Some opioids and fentanyl become trafficking offenses at 4 grams.'),
      ...schedulePossessionOptions(nonNarcoticTiers, 'Non-narcotic Schedule II substances use a 2-gram first breakpoint.'),
    ])],
  },

  'possession-sch-3-4-5': {
    description: 'Simple possession of a Schedule III, IV, or V controlled substance. Flunitrazepam has separate weight rules.',
    variables: [select('substance_history', 'Substance and conviction history', [
      option('General Schedule III/IV/V; first offense', possession('1 to 3 years', 1, 3, 1)),
      option('General Schedule III/IV/V; second offense', possession('1 to 3 years', 1, 3, 2)),
      option('General Schedule III/IV/V; third or subsequent offense', possession('1 to 5 years', 1, 5, 3)),
      option('Flunitrazepam; less than 2 grams', possession('1 to 3 years', 1, 3, 1)),
      option('Flunitrazepam; 2 to less than 4 grams', possession('1 to 8 years', 1, 8, 1)),
      option('Flunitrazepam; 4 grams or more', possession('1 to 15 years', 1, 15, 1)),
    ])],
  },

  'trafficking-cocaine': {
    variables: [numeric('weight', 'Cocaine weight', 'grams', [
      range(28, 200, trafficking('10 to 30 years', 10, 30, 200000, 1000000, 5)),
      range(200, 400, trafficking('15 to 30 years', 15, 30, 300000, 1000000, 6)),
      range(400, null, trafficking('25 to 30 years', 25, 30, 1000000, 1000000, 8)),
    ], { input_min: 28 })],
  },

  'trafficking-meth': {
    variables: [select('method_weight', 'Conduct and methamphetamine weight', [
      option('Possess, sell, deliver, or import: 28 to less than 200 grams', trafficking('10 to 30 years', 10, 30, 200000, 1000000, 5)),
      option('Possess, sell, deliver, or import: 200 to less than 400 grams', trafficking('15 to 30 years', 15, 30, 300000, 1000000, 6)),
      option('Possess, sell, deliver, or import: 400 grams or more', trafficking('25 to 30 years', 25, 30, 1000000, 1000000, 8)),
      option('Manufacture: less than 200 grams (any amount qualifies)', trafficking('10 to 30 years', 10, 30, 200000, 1000000, 5)),
      option('Manufacture: 200 to less than 400 grams', trafficking('15 to 30 years', 15, 30, 300000, 1000000, 6)),
      option('Manufacture: 400 grams or more', trafficking('25 to 30 years', 25, 30, 1000000, 1000000, 8)),
    ])],
  },

  'trafficking-heroin': {
    variables: [numeric('weight', 'Heroin or illegal-drug weight', 'grams', [
      range(4, 14, trafficking('5 to 30 years', 5, 30, 50000, 1000000, 5)),
      range(14, 28, trafficking('10 to 30 years', 10, 30, 100000, 1000000, 6)),
      range(28, null, trafficking('25 to 30 years', 25, 30, 500000, 1000000, 8)),
    ], { input_min: 4 })],
  },

  'trafficking-mdma': {
    statute: 'O.C.G.A. § 16-13-31.1',
    description: 'Trafficking in MDMA or MDA (ecstasy/molly): selling, delivering, bringing into the state, or possessing 28 grams or more of MDA/MDMA or any mixture containing them.',
    variables: [numeric('weight', 'MDMA/MDA weight', 'grams', [
      range(28, 200, trafficking('3 to 30 years', 3, 30, 25000, 250000, null, '3 years, subject to statutory departure provisions', { parole_note: PUBLIC_CSL_NOTE })),
      range(200, 400, trafficking('5 to 30 years', 5, 30, 50000, 250000, null, '5 years, subject to statutory departure provisions', { parole_note: PUBLIC_CSL_NOTE })),
      range(400, null, trafficking('10 to 30 years', 10, 30, 100000, 250000, null, '10 years, subject to statutory departure provisions', { parole_note: PUBLIC_CSL_NOTE })),
    ], { input_min: 28 })],
    notes: 'Unlike § 16-13-31, this section states its 30-year maximum and $250,000 fine cap inside each tier. Departure routes: a five-factor judicial departure with reduced floors of 1.5, 2.5, and 5 years by tier; substantial assistance on the district attorney’s motion; and a prosecutor-agreed sentence below the minimum. A judicial-departure sentence is excluded from earned time and parole except final-year transitional-center or work-release eligibility.',
  },

  'trafficking-marijuana': {
    variables: [numeric('weight', 'Marijuana weight', 'pounds', [
      range(10.000001, 2000, trafficking('5 to 30 years', 5, 30, 100000, 1000000, 5)),
      range(2000, 10000, trafficking('7 to 30 years', 7, 30, 250000, 1000000, 6)),
      range(10000, null, trafficking('15 to 30 years', 15, 30, 1000000, 1000000, 8)),
    ], { input_min: 10.000001, help: 'The first trafficking tier begins above 10 pounds; 10 pounds exactly remains in the felony-possession range.' })],
  },

  'possession-marijuana-misd': {
    base_penalty: misdemeanor('0 to 12 months, public works up to 12 months, a fine, or alternatives', 0, 1000),
    description: 'Possession of one ounce or less of marijuana is a misdemeanor, subject to statutory alternatives and lawful-medical-cannabis exclusions.',
  },

  'possession-marijuana-felony': {
    description: 'Possession of more than one ounce through 10 pounds of marijuana. More than 10 pounds is trafficking.',
    variables: [select('offense_history', 'Conviction history', [
      option('First offense', possession('1 to 10 years', 1, 10, 1)),
      option('Second offense', possession('1 to 10 years', 1, 10, 2)),
      option('Third or subsequent offense', possession('1 to 10 years', 1, 10, 3)),
    ])],
  },

  'psilocybin-possession': {
    variables: [select('weight_history', 'Weight and conviction history', schedulePossessionOptions(narcoticTiers, 'No psilocybin-specific trafficking threshold is stated at 28 grams; amounts at or above that point require legal review.'))],
  },

  'possession-cocaine': {
    variables: [select('weight_history', 'Weight and conviction history', schedulePossessionOptions(narcoticTiers, 'At 28 grams, cocaine trafficking tiers apply.'))],
  },

  'possession-methamphetamine': {
    variables: [select('weight_history', 'Weight and conviction history', schedulePossessionOptions(nonNarcoticTiers, 'At 28 grams, methamphetamine trafficking tiers apply.'))],
  },

  'possession-fentanyl': {
    description: 'Simple fentanyl possession below the 4-gram trafficking threshold. The current trafficking amendments apply to conduct on or after July 1, 2026.',
    variables: [select('weight_history', 'Weight and conviction history', schedulePossessionOptions(narcoticTiers.slice(0, 2), 'At 4 grams, fentanyl trafficking tiers apply.').map((entry) => ({ ...entry, csl_provisional: true })))],
    parole_note: PUBLIC_CSL_NOTE,
  },

  'possession-heroin': {
    variables: [select('weight_history', 'Weight and conviction history', schedulePossessionOptions(narcoticTiers.slice(0, 2), 'At 4 grams, heroin trafficking tiers apply.'))],
  },

  'possession-mdma': {
    description: 'Simple possession of MDMA below 28 grams. At 28 grams, Georgia has separate ecstasy-trafficking penalties.',
    variables: [select('weight_history', 'Weight and conviction history', schedulePossessionOptions(narcoticTiers, 'At 28 grams, MDMA/ecstasy trafficking under O.C.G.A. § 16-13-31.1 applies.'))],
  },

  'pwid-schedule-1-2': {
    variables: [select('offense_history', 'Conviction history', [
      option('First offense', felony('5 to 30 years', years(5), years(30), 0, 100000, 2)),
      option('Second offense', felony('10 to 40 years or life', years(10), { special: 'Life' }, 0, 100000, 3)),
      option('Third or subsequent offense', felony('10 to 40 years or life', years(10), { special: 'Life' }, 0, 100000, 4)),
    ])],
  },

  'pwid-schedule-3-4-5': {
    variables: [select('substance_history', 'Substance and conviction history', [
      option('General Schedule III/IV/V; first offense', felony('1 to 10 years', years(1), years(10), 0, 100000, 2)),
      option('General Schedule III/IV/V; second offense', felony('1 to 10 years', years(1), years(10), 0, 100000, 3)),
      option('General Schedule III/IV/V; third or subsequent offense', felony('1 to 10 years', years(1), years(10), 0, 100000, 4)),
      option('Flunitrazepam; first offense', felony('5 to 30 years', years(5), years(30), 0, 100000, 2)),
      option('Flunitrazepam; second or subsequent offense', felony('10 to 40 years or life', years(10), { special: 'Life' }, 0, 100000, 3)),
    ])],
  },
};
