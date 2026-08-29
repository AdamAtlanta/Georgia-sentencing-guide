import {
  PUBLIC_CSL_NOTE,
  days,
  felony,
  fineOrPrison,
  highMisdemeanor,
  life,
  misdemeanor,
  numeric,
  option,
  range,
  select,
  years,
} from './helpers';

const theftMisdemeanor = misdemeanor('0 to 12 months');
const discretionaryFelony = (sentence, maximumYears, csl, notes) => felony(
  sentence,
  { value: 0, unit: 'months' },
  years(maximumYears),
  0,
  100000,
  csl,
  {
    classification: 'Felony with misdemeanor-sentencing discretion',
    notes: notes || 'The judge may impose misdemeanor punishment instead of the felony prison range. If treated as a misdemeanor, state parole does not apply.',
  },
);

const theftRanges = () => [
  range(0, 1500.01, theftMisdemeanor),
  range(1500.01, 5000, discretionaryFelony('1 to 5 years, or misdemeanor punishment at the judge’s discretion', 5, 1)),
  range(5000, 25000, discretionaryFelony('1 to 10 years, or misdemeanor punishment at the judge’s discretion', 10, 2)),
  range(25000, null, felony('2 to 20 years', years(2), years(20), 0, 100000, 3)),
];

const THEFT_OVERRIDES_NOTE = 'O.C.G.A. § 16-8-12 overrides the value bands in special cases: a third or subsequent theft conviction (§§ 16-8-2 through 16-8-9) is a felony of 1 to 5 years with misdemeanor discretion regardless of value; theft of a destructive device, explosive, or firearm is 1 to 10 years (5 to 10 on a second or subsequent conviction); theft by a fiduciary in breach of fiduciary obligation, or by a government or financial-institution officer or employee in breach of duty, is 1 to 15 years. Separate ranges also cover anhydrous ammonia (1 to 10), grave markers and memorials to the dead, deceptive home-repair or telemarketing offenses (up to 20 on a repeat), and regulated metal property (1 to 5 plus fine).';

export const propertyRules = {
  'terroristic-threats': {
    description: 'A threat or act prohibited by O.C.G.A. § 16-11-37. The punishment changes with the nature and result of the conduct.',
    variables: [select('conduct', 'Threat or act tier', [
      option('Threat not suggesting death', misdemeanor()),
      option('Threat suggesting death', fineOrPrison('Fine, 1 to 5 years imprisonment, or both', years(1), years(5), 0, 1000, 3)),
      option('Terroristic act', fineOrPrison('Fine, 1 to 10 years imprisonment, or both', years(1), years(10), 0, 5000, null, { parole_note: PUBLIC_CSL_NOTE })),
      option('Act directly causing serious physical injury', fineOrPrison('Fine, 5 to 40 years imprisonment, or both', years(5), years(40), 0, 250000, null, { parole_note: PUBLIC_CSL_NOTE, notes: 'The § 16-11-37(d)(2) enhancement is written to reach serious physical injury resulting from “an act giving rise to a conviction under subsection (b)” (the threat subsection) — a drafting quirk; review its application in a filed case.' })),
      option('Retaliation or intimidation of a listed justice participant or information provider', fineOrPrison('Fine of at least $50,000, 5 to 20 years imprisonment, or both', years(5), years(20), 50000, null, null, {
        parole_note: PUBLIC_CSL_NOTE,
        notes: 'Verified against the current text: § 16-11-37(e) states a $50,000 minimum fine and no maximum fine.',
      })),
    ])],
  },

  'gang-act': {
    description: 'Participation in criminal street gang activity. Sentences run consecutively to other sentences and have statutory limits on suspension or probation.',
    variables: [select('conduct_date_tier', 'Conduct and offense date', [
      option('General violation; conduct on or after July 1, 2023', felony('5 to 20 years, consecutive', years(5), years(20), 0, 100000, 8, { mandatory_minimum: 5, must_serve: '5 years consecutive, subject to the statute’s assistance and safety-valve departures', probation_eligible: false })),
      option('General violation; conduct before July 1, 2023', felony('5 to 20 years, consecutive', years(5), years(20), 0, 100000, 5, { mandatory_minimum: 5, must_serve: '5 years consecutive, subject to the statute’s assistance and safety-valve departures', probation_eligible: false })),
      option('Recruit or coerce a person under 17 or a statutorily protected person; first offense', felony('10 to 20 years, consecutive', years(10), years(20), 0, 100000, 8, { mandatory_minimum: 10, must_serve: '10 years consecutive; the general departure provisions do not apply', probation_eligible: false })),
      option('Recruit or coerce a person under 17 or a statutorily protected person; second or later offense', felony('15 to 25 years, consecutive', years(15), years(25), 0, 100000, 8, { mandatory_minimum: 15, must_serve: '15 years consecutive; the general departure provisions do not apply', probation_eligible: false })),
    ])],
  },

  'armed-robbery': {
    description: 'Robbery committed with an offensive weapon or an object that appears to be one. It is a serious violent felony.',
    variables: [select('sentence_tier', 'Sentence or special circumstance', [
      option('Determinate prison term', felony('10 to 20 years', years(10), years(20), 0, 100000, null, { parole_status: 'statutory-no-parole', must_serve: 'The full imposed term; no parole for a non-life serious-violent-felony sentence', probation_eligible: false })),
      option('Life sentence', felony('Life imprisonment', life, life, 0, 100000, null, { parole_status: 'statutory-no-parole', parole_note: 'For a post-July 1, 2006 serious violent felony, a parole-eligible life sentence is first considered after 30 years.', must_serve: '30 years before first parole consideration for a post-July 1, 2006 offense', probation_eligible: false })),
      option('Pharmacy or wholesale-druggist controlled-substance robbery with intentional bodily injury', felony('15 years to life', years(15), life, 0, 100000, null, { parole_status: 'statutory-no-parole', must_serve: 'At least 15 years; serious-violent-felony rules apply', notes: 'Verified against the current text: O.C.G.A. § 16-8-41(c)(1) states only a 15-year floor; subsection (b)’s life term is the outer bound of the section.' })),
    ])],
    notes: 'The printed statute still contains the word “death,” but controlling U.S. Supreme Court law makes death constitutionally unavailable for an ordinary nonhomicide armed robbery. It is not shown as an operative option here.',
  },

  'theft-by-taking': {
    description: 'Unlawfully taking another person’s property with intent to deprive the owner. The ordinary punishment bands are based on value.',
    variables: [numeric('value', 'Value of property', 'USD', theftRanges(), { step: 0.01 })],
    notes: THEFT_OVERRIDES_NOTE,
  },

  'theft-by-receiving': {
    description: 'Receiving, disposing of, or retaining stolen property while knowing or having reason to know it was stolen. Ordinary punishment depends on value.',
    variables: [numeric('value', 'Value of property', 'USD', theftRanges(), { step: 0.01 })],
    notes: THEFT_OVERRIDES_NOTE,
  },

  'theft-by-deception': {
    description: 'Obtaining property through deceitful means or artful practice. Ordinary punishment depends on value.',
    variables: [numeric('value', 'Value of property', 'USD', theftRanges(), { step: 0.01 })],
    notes: THEFT_OVERRIDES_NOTE,
  },

  'theft-by-shoplifting': {
    description: 'Shoplifting punishment depends on merchandise value, aggregation rules, and conviction history.',
    variables: [select('tier', 'Value, aggregation, and history', [
      option('$500 or less; first conviction', misdemeanor()),
      option('$500 or less; second conviction', misdemeanor('0 to 12 months', 500, 1000, { must_serve: 'Mandatory $500 minimum fine; the statute limits suspension or probation of the fine' })),
      option('$500 or less; third conviction', misdemeanor('0 to 12 months', 0, 1000, { must_serve: 'At least 30 days in jail, or a specified 120-day custodial/monitoring alternative; the required sanction may not be suspended or probated' })),
      option('$500 or less; fourth or later conviction', felony('1 to 10 years', years(1), years(10), 0, 100000, 1, { csl_provisional: true, must_serve: '1 year unless the prosecutor and defendant agree to a lawful departure', probation_eligible: false })),
      option('More than $500 but less than $5,000, including qualifying aggregation', felony('1 to 10 years', years(1), years(10), 0, 100000, 1, { csl_provisional: true })),
      option('$5,000 to less than $25,000', felony('1 to 10 years', years(1), years(10), 0, 100000, 2, { csl_provisional: true })),
      option('$25,000 or more', felony('1 to 10 years', years(1), years(10), 0, 100000, 3, { csl_provisional: true })),
    ])],
    parole_note: 'Shoplifting is not separately named in the public CSL chart; the displayed felony CSL uses the generic theft bands and should be confirmed with the Board.',
  },

  'burglary-1': {
    description: 'Entering or remaining in a dwelling without authority and with intent to commit a felony or theft. History controls the prison range; occupancy controls the parole CSL.',
    variables: [select('history_occupancy', 'History and dwelling occupancy', [
      option('First offense; occupied residence', felony('1 to 20 years', years(1), years(20), 0, 100000, 8, { bdv: true })),
      option('First offense; unoccupied or vacant dwelling', felony('1 to 20 years', years(1), years(20), 0, 100000, 6)),
      option('Second offense; occupied residence', felony('2 to 20 years', years(2), years(20), 0, 100000, 8, { bdv: true })),
      option('Second offense; unoccupied or vacant dwelling', felony('2 to 20 years', years(2), years(20), 0, 100000, 6)),
      option('Third or subsequent offense; occupied residence', felony('5 to 25 years', years(5), years(25), 0, 100000, 8, { bdv: true })),
      option('Third or subsequent offense; unoccupied or vacant dwelling', felony('5 to 25 years', years(5), years(25), 0, 100000, 6)),
      option('Fourth or subsequent burglary conviction (any degree); occupied residence', felony('5 to 25 years', years(5), years(25), 0, 100000, 8, { bdv: true, probation_eligible: false, must_serve: 'Adjudication of guilt or imposition of sentence may not be suspended, probated, deferred, or withheld (O.C.G.A. § 16-7-1(d))' })),
      option('Fourth or subsequent burglary conviction (any degree); unoccupied or vacant dwelling', felony('5 to 25 years', years(5), years(25), 0, 100000, 6, { probation_eligible: false, must_serve: 'Adjudication of guilt or imposition of sentence may not be suspended, probated, deferred, or withheld (O.C.G.A. § 16-7-1(d))' })),
    ])],
  },

  'burglary-2': {
    description: 'Entering or remaining in a non-dwelling structure without authority and with intent to commit a felony or theft.',
    variables: [select('history_board_band', 'History and Board value/count band', [
      ...['First offense', 'Second or subsequent offense'].flatMap((history, historyIndex) => {
        const sentence = historyIndex === 0 ? ['1 to 5 years', 1, 5] : ['1 to 8 years', 1, 8];
        return [
          option(`${history}; under $300 and one count`, felony(sentence[0], years(sentence[1]), years(sentence[2]), 0, 100000, 1)),
          option(`${history}; $300–$2,000 and one count`, felony(sentence[0], years(sentence[1]), years(sentence[2]), 0, 100000, 2)),
          option(`${history}; 2–5 counts or $2,001–$5,000`, felony(sentence[0], years(sentence[1]), years(sentence[2]), 0, 100000, 3)),
          option(`${history}; 6+ counts or $5,001+`, felony(sentence[0], years(sentence[1]), years(sentence[2]), 0, 100000, 4)),
        ];
      }),
      option('Fourth or subsequent burglary conviction (any degree)', felony('1 to 8 years', years(1), years(8), 0, 100000, null, {
        probation_eligible: false,
        must_serve: 'Adjudication of guilt or imposition of sentence may not be suspended, probated, deferred, or withheld (O.C.G.A. § 16-7-1(d))',
        parole_note: 'The Board value/count bands shown in the other options still determine the CSL for a fourth conviction; this option surfaces the statutory probation bar.',
      })),
    ])],
  },

  'ftc-theft': {
    base_penalty: fineOrPrison('Fine, 1 to 3 years imprisonment, or both', years(1), years(3), 0, 5000, 1),
    description: 'Taking, receiving, or possessing a financial transaction card without consent or with knowledge that it was unlawfully obtained.',
  },

  'ftc-fraud': {
    variables: [select('conduct_value_count', 'Conduct, aggregate value, and count', [
      option('Card use under §16-9-33(a)/(b): $100 or less, under $1,000 total, and 10 or fewer counts', fineOrPrison('Fine, 1 to 2 years imprisonment, or both', years(1), years(2), 0, 1000, 2)),
      option('Card use under §16-9-33(a)/(b): over $100 but under $1,000, and 10 or fewer counts', fineOrPrison('Fine, 1 to 3 years imprisonment, or both', years(1), years(3), 0, 5000, 2)),
      option('Any covered fraud: $1,000 or more or 11 or more counts', fineOrPrison('Fine, 1 to 3 years imprisonment, or both', years(1), years(3), 0, 5000, 3)),
      option('Fraudulent application, false lost/stolen notice, or merchant laundering; under $1,000 and 10 or fewer counts', fineOrPrison('Fine, 1 to 3 years imprisonment, or both', years(1), years(3), 0, 5000, 2)),
    ])],
  },

  'forgery-1st': {
    variables: [select('value_count', 'Value and count for the parole rating', [
      option('Under $1,000 and 10 or fewer counts', felony('1 to 15 years', years(1), years(15), 0, 100000, 2)),
      option('$1,000 or more or 11 or more counts', felony('1 to 15 years', years(1), years(15), 0, 100000, 3)),
    ])],
  },

  'forgery-2nd': {
    variables: [select('value_count', 'Value and count for the parole rating', [
      option('Under $1,000 and 10 or fewer counts', felony('1 to 5 years', years(1), years(5), 0, 100000, 1)),
      option('$1,000 or more or 11 or more counts', felony('1 to 5 years', years(1), years(5), 0, 100000, 2)),
    ])],
  },

  'forgery-3rd': {
    variables: [select('check_category', 'Check offense type', [
      option('Check valued at $1,500 or more', felony('1 to 5 years', years(1), years(5), 0, 100000, null, { parole_note: PUBLIC_CSL_NOTE })),
      option('Possession of 10 or more checks written without a specified amount', felony('1 to 5 years', years(1), years(5), 0, 100000, null, { parole_note: PUBLIC_CSL_NOTE })),
    ])],
  },

  'forgery-4th': {
    variables: [select('offense_history', 'Conviction history', [
      option('First offense', misdemeanor()),
      option('Second offense', misdemeanor()),
      option('Third or subsequent offense', felony('1 to 5 years', years(1), years(5), 0, 100000, null, { parole_note: PUBLIC_CSL_NOTE })),
    ])],
  },

  'possession-tools-crime': {
    base_penalty: felony('1 to 5 years', years(1), years(5), 0, 100000, 1),
  },

  'robbery': {
    variables: [select('method_victim', 'Method and victim', [
      option('Force, intimidation, threat, or sudden snatching; victim under 65', felony('1 to 20 years', years(1), years(20), 0, 100000, 8, { bdv: true })),
      option('Any robbery method; victim age 65 or older', felony('5 to 20 years', years(5), years(20), 0, 100000, 8, { bdv: true })),
    ])],
  },

  'entering-automobile': {
    base_penalty: discretionaryFelony('1 to 5 years, or misdemeanor punishment at the judge’s discretion', 5, 1),
  },

  'criminal-damage-1st': {
    variables: [select('conduct', 'Type of property damage', [
      option('Endangering human life or prohibited drive-by building damage', felony('1 to 10 years', years(1), years(10), 0, 100000, 3)),
      option('Interference with critical infrastructure or a vital public service', felony('2 to 20 years', years(2), years(20), 0, 100000, 4)),
    ])],
  },

  'criminal-damage-2nd': {
    type: 'Felony',
    description: 'Intentional property damage exceeding $500, or specified reckless/intentional damage by fire, explosive, or fireworks.',
    variables: [select('value_conduct', 'Value or conduct', [
      option('More than $500 through $2,000', felony('1 to 5 years', years(1), years(5), 0, 100000, 2)),
      option('More than $2,000', felony('1 to 5 years', years(1), years(5), 0, 100000, 3)),
      option('Qualifying fire, explosive, or fireworks damage; value not established', felony('1 to 5 years', years(1), years(5), 0, 100000, null, { parole_note: PUBLIC_CSL_NOTE })),
    ])],
  },

  'criminal-trespass': {
    base_penalty: misdemeanor(),
    description: 'Knowingly damaging property of another by $500 or less, or committing one of the statute’s unauthorized entry, remaining, or interference forms.',
  },

  'arson-1st': {
    variables: [select('offense_date', 'Offense date', [
      option('On or after July 1, 2023', fineOrPrison('Fine, 1 to 20 years imprisonment, or both', years(1), years(20), 0, 50000, 6)),
      option('On or before June 30, 2023', fineOrPrison('Fine, 1 to 20 years imprisonment, or both', years(1), years(20), 0, 50000, 5)),
    ])],
  },

  'arson-2nd': {
    variables: [select('property_value', 'Property value for the parole rating', [
      option('Under $2,000', fineOrPrison('Fine, 1 to 10 years imprisonment, or both', years(1), years(10), 0, 25000, 3)),
      option('$2,000 or more', fineOrPrison('Fine, 1 to 10 years imprisonment, or both', years(1), years(10), 0, 25000, 4)),
    ])],
  },
};
