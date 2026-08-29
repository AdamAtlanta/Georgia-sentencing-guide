import rawCrimes from './crimes.json';
import { PAROLE_GRID_SOURCE } from './paroleGrid';
import { drugRules } from './rules/drugRules';
import { personRules } from './rules/personRules';
import { propertyRules } from './rules/propertyRules';

const rules = { ...drugRules, ...personRules, ...propertyRules };
const code = 'https://law.justia.com/codes/georgia';

const statuteSources = {
  'malice-murder': `${code}/title-16/chapter-5/article-1/section-16-5-1/`,
  'felony-murder': `${code}/title-16/chapter-5/article-1/section-16-5-1/`,
  'murder-second-degree': `${code}/title-16/chapter-5/article-1/section-16-5-1/`,
  'voluntary-manslaughter': `${code}/title-16/chapter-5/article-1/section-16-5-2/`,
  'involuntary-manslaughter': `${code}/title-16/chapter-5/article-1/section-16-5-3/`,
  'simple-assault': `${code}/title-16/chapter-5/article-2/section-16-5-20/`,
  'aggravated-assault': `${code}/title-16/chapter-5/article-2/section-16-5-21/`,
  'simple-battery': `${code}/title-16/chapter-5/article-2/section-16-5-23/`,
  battery: `${code}/title-16/chapter-5/article-2/section-16-5-23-1/`,
  'family-violence-battery': `${code}/title-16/chapter-5/article-2/section-16-5-23-1/`,
  'aggravated-battery': `${code}/title-16/chapter-5/article-2/section-16-5-24/`,
  stalking: `${code}/title-16/chapter-5/article-7/section-16-5-90/`,
  'aggravated-stalking': `${code}/title-16/chapter-5/article-7/section-16-5-91/`,
  rape: `${code}/title-16/chapter-6/section-16-6-1/`,
  'statutory-rape': `${code}/title-16/chapter-6/section-16-6-3/`,
  'child-molestation': `${code}/title-16/chapter-6/section-16-6-4/`,
  'sexual-battery': `${code}/title-16/chapter-6/section-16-6-22-1/`,
  'aggravated-sexual-battery': `${code}/title-16/chapter-6/section-16-6-22-2/`,
  'burglary-1': `${code}/title-16/chapter-7/article-1/section-16-7-1/`,
  'burglary-2': `${code}/title-16/chapter-7/article-1/section-16-7-1/`,
  'criminal-trespass': `${code}/title-16/chapter-7/article-2/part-1/section-16-7-21/`,
  'criminal-damage-1st': `${code}/title-16/chapter-7/article-2/part-1/section-16-7-22/`,
  'criminal-damage-2nd': `${code}/title-16/chapter-7/article-2/part-1/section-16-7-23/`,
  'possession-tools-crime': `${code}/title-16/chapter-7/article-2/part-1/section-16-7-20/`,
  'arson-1st': `${code}/title-16/chapter-7/article-3/section-16-7-60/`,
  'arson-2nd': `${code}/title-16/chapter-7/article-3/section-16-7-61/`,
  'theft-by-taking': `${code}/title-16/chapter-8/article-1/section-16-8-12/`,
  'theft-by-receiving': `${code}/title-16/chapter-8/article-1/section-16-8-12/`,
  'theft-by-deception': `${code}/title-16/chapter-8/article-1/section-16-8-12/`,
  'theft-by-shoplifting': `${code}/title-16/chapter-8/article-1/section-16-8-14/`,
  robbery: `${code}/title-16/chapter-8/article-2/section-16-8-40/`,
  'armed-robbery': `${code}/title-16/chapter-8/article-2/section-16-8-41/`,
  'entering-automobile': `${code}/title-16/chapter-8/article-1/section-16-8-18/`,
  'forgery-1st': `${code}/title-16/chapter-9/article-1/section-16-9-2/`,
  'forgery-2nd': `${code}/title-16/chapter-9/article-1/section-16-9-2/`,
  'forgery-3rd': `${code}/title-16/chapter-9/article-1/section-16-9-2/`,
  'forgery-4th': `${code}/title-16/chapter-9/article-1/section-16-9-2/`,
  'ftc-theft': `${code}/title-16/chapter-9/article-3/section-16-9-38/`,
  'ftc-fraud': `${code}/title-16/chapter-9/article-3/section-16-9-38/`,
  'obstruction-officer': `${code}/title-16/chapter-10/article-2/section-16-10-24/`,
  'terroristic-threats': `${code}/title-16/chapter-11/article-2/section-16-11-37/`,
  'firearm-during-felony': `${code}/title-16/chapter-11/article-4/part-1/section-16-11-106/`,
  'carrying-weapon-unauthorized': `${code}/title-16/chapter-11/article-4/part-3/section-16-11-127/`,
  'firearm-by-felon': `${code}/title-16/chapter-11/article-4/part-3/section-16-11-131/`,
  'possession-marijuana-misd': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-2/`,
  'possession-marijuana-felony': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-30/`,
  'possession-sch-1-2': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-30/`,
  'possession-sch-3-4-5': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-30/`,
  'possession-cocaine': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-30/`,
  'possession-methamphetamine': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-30/`,
  'possession-fentanyl': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-30/`,
  'possession-heroin': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-30/`,
  'possession-mdma': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-30/`,
  'psilocybin-possession': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-30/`,
  'pwid-schedule-1-2': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-30/`,
  'pwid-schedule-3-4-5': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-30/`,
  'trafficking-cocaine': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-31/`,
  'trafficking-heroin': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-31/`,
  'trafficking-marijuana': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-31/`,
  'trafficking-mdma': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-31-1/`,
  'trafficking-meth': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-31/`,
  'trafficking-fentanyl': `${code}/title-16/chapter-13/article-2/part-1/section-16-13-31/`,
  'gang-act': `${code}/title-16/chapter-15/section-16-15-4/`,
  'failure-to-register-sex-offender': `${code}/title-42/chapter-1/article-2/section-42-1-12/`,
  'dui-alcohol': `${code}/title-40/chapter-6/article-15/section-40-6-391/`,
  'vehicular-homicide': `${code}/title-40/chapter-6/article-15/section-40-6-393/`,
  'fleeing-eluding': `${code}/title-40/chapter-6/article-15/section-40-6-395/`,
};

const officialCodePortal = {
  label: 'Official Georgia Code portal (LexisNexis)',
  url: 'https://www.lexisnexis.com/hottopics/gacode/Default.asp',
};

const paroleSource = {
  label: 'Official Georgia Parole Decision Guidelines',
  url: PAROLE_GRID_SOURCE.rulesUrl,
};

const actSources = {
  'trafficking-fentanyl': [
    { label: 'Official 2026 HB 535 signed act', url: 'https://gov.georgia.gov/document/2026-signed-legislation/hb-535/download' },
  ],
  'simple-assault': [
    { label: 'Official 2026 HB 483 signed act', url: 'https://gov.georgia.gov/document/2026-signed-legislation/hb-483/download' },
    { label: 'Official 2026 HB 1075 signed act', url: 'https://gov.georgia.gov/document/2026-signed-legislation/hb-1075/download' },
  ],
  'simple-battery': [
    { label: 'Official 2026 HB 483 signed act', url: 'https://gov.georgia.gov/document/2026-signed-legislation/hb-483/download' },
    { label: 'Official 2026 HB 1075 signed act', url: 'https://gov.georgia.gov/document/2026-signed-legislation/hb-1075/download' },
  ],
  battery: [
    { label: 'Official 2026 HB 483 signed act', url: 'https://gov.georgia.gov/document/2026-signed-legislation/hb-483/download' },
    { label: 'Official 2026 HB 1075 signed act', url: 'https://gov.georgia.gov/document/2026-signed-legislation/hb-1075/download' },
  ],
  'aggravated-assault': [
    { label: 'Official 2026 HB 483 signed act', url: 'https://gov.georgia.gov/document/2026-signed-legislation/hb-483/download' },
  ],
  'aggravated-battery': [
    { label: 'Official 2026 HB 483 signed act', url: 'https://gov.georgia.gov/document/2026-signed-legislation/hb-483/download' },
  ],
  'fleeing-eluding': [
    { label: 'Official 2026 HB 1161 signed act', url: 'https://gov.georgia.gov/document/2026-signed-legislation/hb-1161/download' },
  ],
};

const drivingRestrictionSources = {
  'dui-alcohol': [
    { label: 'DUI conviction suspension periods — O.C.G.A. § 40-5-63', url: `${code}/title-40/chapter-5/article-3/section-40-5-63/` },
    { label: 'Limited driving permits — O.C.G.A. § 40-5-64', url: `${code}/title-40/chapter-5/article-3/section-40-5-64/` },
    { label: 'Ignition-interlock limited permits — O.C.G.A. § 40-5-64.1', url: `${code}/title-40/chapter-5/article-3/section-40-5-64-1/` },
    { label: 'Habitual-violator revocation — O.C.G.A. § 40-5-58', url: `${code}/title-40/chapter-5/article-3/section-40-5-58/` },
    { label: 'Under-21 license suspensions — O.C.G.A. § 40-5-57.1', url: `${code}/title-40/chapter-5/article-3/section-40-5-57-1/` },
    { label: 'Implied-consent suspension interaction — O.C.G.A. § 40-5-67.2', url: `${code}/title-40/chapter-5/article-3/section-40-5-67-2/` },
  ],
  'fleeing-eluding': [
    { label: 'Mandatory suspension offenses — O.C.G.A. § 40-5-54', url: `${code}/title-40/chapter-5/article-3/section-40-5-54/` },
    { label: 'Suspension periods and reinstatement — O.C.G.A. § 40-5-63', url: `${code}/title-40/chapter-5/article-3/section-40-5-63/` },
    { label: 'Habitual-violator revocation — O.C.G.A. § 40-5-58', url: `${code}/title-40/chapter-5/article-3/section-40-5-58/` },
    { label: 'Under-21 license suspensions — O.C.G.A. § 40-5-57.1', url: `${code}/title-40/chapter-5/article-3/section-40-5-57-1/` },
  ],
  'vehicular-homicide': [
    { label: 'Mandatory suspension offenses — O.C.G.A. § 40-5-54', url: `${code}/title-40/chapter-5/article-3/section-40-5-54/` },
    { label: 'Homicide-by-vehicle suspension periods — O.C.G.A. § 40-5-63', url: `${code}/title-40/chapter-5/article-3/section-40-5-63/` },
    { label: 'Habitual-violator revocation — O.C.G.A. § 40-5-58', url: `${code}/title-40/chapter-5/article-3/section-40-5-58/` },
  ],
};

function completeCrime(crime) {
  const override = rules[crime.id];
  if (!override) {
    throw new Error(`No completed sentencing rule exists for ${crime.id}`);
  }

  const completed = {
    ...crime,
    ...override,
    reviewed_on: 'August 29, 2026',
    sources: [
      officialCodePortal,
      ...(statuteSources[crime.id] ? [{ label: 'Current consolidated O.C.G.A. section', url: statuteSources[crime.id] }] : []),
      ...(actSources[crime.id] || []),
      ...(drivingRestrictionSources[crime.id] || []),
      paroleSource,
    ],
  };

  delete completed.parole_info;
  if (Object.hasOwn(override, 'variables')) delete completed.base_penalty;
  if (Object.hasOwn(override, 'base_penalty')) delete completed.variables;

  return completed;
}

const completedCrimes = rawCrimes.map(completeCrime);

export default completedCrimes;
