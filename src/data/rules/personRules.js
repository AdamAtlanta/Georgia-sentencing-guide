import {
  PUBLIC_CSL_NOTE,
  days,
  death,
  felony,
  fineOrPrison,
  highMisdemeanor,
  hours,
  life,
  lifeWithoutParole,
  misdemeanor,
  months,
  option,
  select,
  years,
} from './helpers';

const repeatMisdemeanor = option(
  'Fourth or later qualifying Chapter 5/6 misdemeanor within 10 years; conduct on or after July 1, 2026',
  felony('1 to 10 years', years(1), years(10), 0, 100000, null, {
    mandatory_minimum: 1,
    must_serve: 'The first year of the sentence shall not be suspended, probated, deferred, or withheld; the balance may be probated',
    parole_note: PUBLIC_CSL_NOTE,
    notes: 'O.C.G.A. § 17-10-3.2 (effective July 1, 2026). This statewide recidivist override can use qualifying misdemeanor convictions from different offenses in Chapters 5 and 6. The statute has detailed timing and counting rules.',
  }),
);

const seriousLife = (label = 'Life imprisonment') => option(label, felony(label, life, life, 0, 100000, null, {
  parole_status: 'statutory-no-parole',
  parole_note: 'For a post-July 1, 2006 serious violent felony, a parole-eligible life sentence is first considered after 30 years.',
  must_serve: '30 years before first parole consideration for a post-July 1, 2006 offense',
  probation_eligible: false,
}));

const seriousLwop = option('Life without parole', felony('Life without parole', lifeWithoutParole, lifeWithoutParole, 0, 100000, null, {
  parole_status: 'statutory-no-parole',
  parole_note: 'Life without parole has no parole eligibility.',
  must_serve: 'Life; no parole',
  probation_eligible: false,
}));

const duiDrivingRestrictions = {
  summary: 'Driver Services uses a separate five-year lookback for license consequences. That count can differ from the ten-year count used to select the criminal DUI sentence above.',
  items: [
    {
      label: 'First DUI within five years',
      detail: '12-month suspension. Full reinstatement may be requested after 120 days after completing the DUI risk-reduction program and paying the required fee. A limited permit may be available during the suspension if the statutory requirements are met.',
    },
    {
      label: 'Second DUI within five years',
      detail: 'Three-year suspension. An ignition-interlock limited permit may be requested after at least 120 days; full reinstatement is not available before 18 months and requires the DUI program, the required interlock period, and the restoration fee.',
    },
    {
      label: 'Third DUI within five years',
      detail: 'Habitual-violator status and a five-year license revocation. A probationary license may be requested after two years only if every statutory condition is satisfied.',
    },
  ],
  note: 'An implied-consent administrative suspension can arise before conviction and may run concurrently with the conviction suspension. Drivers under 21 and commercial drivers have separate rules. A habitual violator whose DUI collision caused a death is not eligible for the usual probationary license.',
};

const fleeingDrivingRestrictions = {
  summary: 'Every fleeing-or-eluding conviction triggers a separate Driver Services suspension. License consequences use a five-year lookback, while the criminal sentence above uses a ten-year lookback.',
  items: [
    {
      label: 'First listed driving conviction within five years',
      detail: '12-month suspension. Early reinstatement may be requested after 120 days after completing an approved defensive-driving or DUI risk-reduction course and paying the required fee. A limited permit may be available if the statutory requirements are met.',
    },
    {
      label: 'Second listed driving conviction within five years',
      detail: 'Three-year suspension. Because this is not a DUI conviction, early reinstatement may be requested after 120 days after completing an approved course and paying the required fee.',
    },
    {
      label: 'Third listed driving conviction within five years',
      detail: 'Habitual-violator status and a five-year license revocation. A probationary license may be requested after two years only if every statutory condition is satisfied.',
    },
    {
      label: 'Driver under age 21',
      detail: 'A separate youth-driver rule generally provides a six-month first suspension and a 12-month later suspension, with course-completion and reinstatement requirements.',
    },
  ],
  note: 'The five-year Driver Services count includes the listed serious driving offenses in O.C.G.A. §§ 40-5-54 and 40-5-58, not only prior fleeing convictions. Commercial-license consequences must be checked separately.',
};

const vehicularHomicideDrivingRestrictions = {
  summary: 'Every homicide-by-vehicle conviction triggers license action, but first- and second-degree convictions have different restrictions.',
  items: [
    {
      label: 'First-degree homicide by vehicle',
      detail: 'Three-year suspension with no early reinstatement and no limited driving permit.',
    },
    {
      label: 'Second-degree homicide by vehicle; first listed conviction within five years',
      detail: '12-month suspension. Early reinstatement may be requested after 120 days after completing an approved course and paying the required fee; a limited permit may be available if the statutory requirements are met.',
    },
    {
      label: 'Second-degree; second listed conviction within five years',
      detail: 'Three-year suspension, with possible early reinstatement after 120 days after completing an approved course and paying the required fee.',
    },
    {
      label: 'Third listed conviction within five years',
      detail: 'Habitual-violator status and a five-year license revocation. Any existing habitual-violator revocation remains a separate bar to driving.',
    },
  ],
  note: 'If the habitual-violator revocation stems from a DUI collision in which someone died, the usual probationary license is unavailable. Commercial-license consequences must be checked separately.',
};

export const personRules = {
  'malice-murder': {
    variables: [select('sentence_type', 'Sentence imposed', [
      seriousLife(),
      seriousLwop,
      option('Death sentence, when constitutionally and statutorily available', felony('Death sentence', death, death, 0, 100000, null, { parole_status: 'statutory-no-parole', must_serve: 'Capital sentence; no parole', probation_eligible: false })),
    ])],
  },

  'felony-murder': {
    variables: [select('sentence_type', 'Sentence imposed', [
      seriousLife(),
      seriousLwop,
      option('Death sentence, when constitutionally and statutorily available', felony('Death sentence', death, death, 0, 100000, null, { parole_status: 'statutory-no-parole', must_serve: 'Capital sentence; no parole', probation_eligible: false })),
    ])],
  },

  'murder-second-degree': {
    base_penalty: felony('10 to 30 years', years(10), years(30), 0, 100000, 8, { bdv: true }),
  },

  'aggravated-assault': {
    description: 'An assault elevated by weapon, intent, injury, victim, location, or another circumstance specified in O.C.G.A. § 16-5-21.',
    variables: [select('circumstance', 'Victim or circumstance', [
      option('Injury or deadly weapon; general case', felony('1 to 20 years', years(1), years(20), 0, 100000, 8, { bdv: true })),
      option('Intent to murder, rape, or rob without a separately listed injury/weapon basis', felony('1 to 20 years', years(1), years(20), 0, 100000, null, { parole_note: PUBLIC_CSL_NOTE })),
      option('Public-safety officer; firearm discharged; defendant age 17+', felony('10 to 20 years', years(10), years(20), 2000, 100000, 8, { must_serve: '10 years, subject to prosecutor-agreed statutory departure', probation_eligible: false, bdv: true })),
      option('Public-safety officer; weapon or object other than the body alone; no firearm discharge', felony('5 to 20 years', years(5), years(20), 2000, 100000, 8, { must_serve: '3 years for a defendant age 17+, subject to prosecutor-agreed statutory departure', probation_eligible: false, bdv: true, notes: 'The 3-year mandatory minimum in O.C.G.A. § 16-5-21(c)(1)(B) applies only to defendants who are at least 17; the 5-to-20-year range applies regardless of age.' })),
      option('Public-safety officer; assault using only the body', felony('5 to 20 years', years(5), years(20), 2000, 100000, 8, { bdv: true, notes: 'O.C.G.A. § 16-5-21(c)(1)(C): a body-only assault on a public safety officer carries the 5-to-20-year range and the $2,000 minimum fine, but no mandatory minimum prison term.' })),
      option('Victim age 65 or older', felony('3 to 20 years', years(3), years(20), 0, 100000, 8, { bdv: true })),
      option('Public transit vehicle or station', felony('3 to 20 years', years(3), years(20), 0, 100000, 8, { bdv: true })),
      option('Commercial-cargo theft circumstance', fineOrPrison('Fine, 5 to 20 years imprisonment, or both', years(5), years(20), 50000, 200000, null, { parole_note: PUBLIC_CSL_NOTE })),
      option('Drive-by shooting form', felony('5 to 20 years', years(5), years(20), 0, 100000, 8, { bdv: true })),
      option('Firearm against student, teacher, or school personnel', felony('5 to 20 years', years(5), years(20), 0, 100000, 8, { bdv: true })),
      option('Family-violence circumstance', felony('3 to 20 years', years(3), years(20), 0, 100000, 8, { bdv: true })),
      option('Intent to rape a child under 14', felony('25 to 50 years', years(25), years(50), 0, 100000, null, { parole_note: PUBLIC_CSL_NOTE })),
      option('Intent to rape; prior sexual-felony conviction', felony('Life, or a prison term followed by probation for life', years(1), life, 0, 100000, null, { parole_note: PUBLIC_CSL_NOTE, probation_eligible: false, must_serve: 'Split-sentence and minimum-term rules of O.C.G.A. § 17-10-6.2 apply', notes: 'O.C.G.A. § 16-5-21(j)(2)(B) does not restate a finite term range; electronic monitoring is a required probation condition. If the victim is under 14, the 25-to-50-year range in (j)(1) supplies the term minimum.' })),
      option('Court officer', felony('5 to 20 years', years(5), years(20), 0, 100000, 8, { bdv: true })),
      option('Emergency or health worker on hospital property', felony('3 to 20 years', years(3), years(20), 0, 100000, 8, { bdv: true })),
      option('Utility worker, or code-enforcement official for conduct on/after July 1, 2026', felony('3 to 20 years', years(3), years(20), 0, 100000, 8, { bdv: true })),
    ])],
  },

  'statutory-rape': {
    variables: [select('offender_victim_status', 'Ages and prior sexual-felony status', [
      option('Non-Romeo-and-Juliet case; defendant under 21', felony('1 to 20 years', years(1), years(20), 0, 100000, 8, { bdv: true })),
      option('Non-Romeo-and-Juliet case; defendant age 21 or older', felony('10 to 20 years, with statutory split-sentence rules', years(10), years(20), 0, 100000, 8, { bdv: true, must_serve: '10-year statutory minimum, subject to the limited departure provisions in O.C.G.A. § 17-10-6.2' })),
      option('Defendant age 21+ with a prior sexual-felony conviction', felony('Life, or a term followed by probation for life', years(10), life, 0, 100000, 8, { bdv: true, notes: 'O.C.G.A. § 16-6-3(d)(2) restates no finite term range; the 10-year floor carries over from subsection (b) via § 17-10-6.2(b). Because a prior sexual felony defeats the § 17-10-6.2(c)(1)(A) judicial-departure condition, only a prosecutor-agreed sentence can go below 10 years. Electronic monitoring is a required probation condition.' })),
      option('Romeo-and-Juliet: victim 14–15, defendant age 18 or younger and no more than 4 years older', misdemeanor()),
      repeatMisdemeanor,
    ])],
  },

  'child-molestation': {
    variables: [select('offense_category', 'Offense type and history', [
      option('Child molestation; first offense', felony('5 to 20 years, followed by probation as required', years(5), years(20), 0, 100000, 8, { bdv: true, must_serve: '5-year statutory minimum, subject to O.C.G.A. § 17-10-6.2 departure rules' })),
      option('Child molestation; second or later offense', felony('10 to 30 years or life', years(10), life, 0, 100000, 8, { bdv: true, must_serve: '10-year statutory minimum; on a second Chapter 6 conviction only a prosecutor-agreed § 17-10-6.2 departure is available', notes: 'A life sentence requires pretrial written notice that the State intends to seek life imprisonment.' })),
      option('Romeo-and-Juliet child molestation: victim 14–15, defendant age 18 or younger and no more than 4 years older', misdemeanor()),
      option('Prior sexual-felony conviction (child molestation or aggravated child molestation)', felony('Life, or a prison term followed by probation for life', years(5), life, 0, 100000, 8, { bdv: true, probation_eligible: false, must_serve: 'The applicable statutory minimum (5 or 10 years for child molestation under § 17-10-6.2; 25 years for aggravated child molestation under § 17-10-6.1)', notes: 'O.C.G.A. § 16-6-4(f)(2). Electronic monitoring is a required probation condition. If the prior sexual felony was itself a serious violent felony and the new offense is aggravated child molestation, O.C.G.A. § 17-10-7(b)(2) requires life without parole.' })),
      option('Aggravated child molestation; non-life split sentence', felony('25 years to life, followed by probation for life', years(25), life, 0, 100000, null, { parole_status: 'statutory-no-parole', must_serve: 'At least 25 years; the non-life prison term is served in full without parole', probation_eligible: false, bdv: true })),
      seriousLife('Aggravated child molestation; life sentence'),
      option('Romeo-and-Juliet aggravated child molestation based on sodomy: victim 13–15, defendant age 18 or younger and no more than 4 years older', misdemeanor()),
      repeatMisdemeanor,
    ])],
  },

  'aggravated-sexual-battery': {
    variables: [select('sentence_history', 'Sentence and prior sexual-felony status', [
      option('No prior sexual felony; non-life split sentence', felony('25 years to life, followed by probation for life', years(25), life, 0, 100000, null, { parole_status: 'statutory-no-parole', must_serve: 'At least 25 years; the non-life prison term is served in full without parole', probation_eligible: false, bdv: true })),
      seriousLife(),
      option('Prior sexual-felony conviction', felony('Life, or a prison term followed by probation for life', years(25), life, 0, 100000, null, { parole_status: 'statutory-no-parole', must_serve: 'At least 25 years for a non-life term (§ 17-10-6.1(b)(2)(E)); a first serious-violent-felony term is served in full without parole', probation_eligible: false, bdv: true, notes: 'O.C.G.A. § 16-6-22.2(e)(2) restates no finite term range; the 25-year floor comes from § 17-10-6.1. Electronic monitoring is a required probation condition. If the prior sexual felony was itself a serious violent felony, O.C.G.A. § 17-10-7(b)(2) requires life without parole.' })),
    ])],
  },

  'dui-alcohol': {
    variables: [select('offense_count', 'Ordinary DUI history within 10 years', [
      option('First offense', misdemeanor('10 days to 12 months', 300, 1000, { sentence_minimum: days(10), must_serve: '24 hours actual custody when BAC is at least 0.08; otherwise the confinement may be suspended as allowed by law' })),
      option('Second offense', misdemeanor('90 days to 12 months', 600, 1000, { sentence_minimum: days(90), must_serve: 'At least 72 hours actual custody; part of the sentence must be probated' })),
      option('Third offense', highMisdemeanor('120 days to 12 months', 1000, 5000, { sentence_minimum: days(120), must_serve: 'At least 15 days actual custody; part of the sentence must be probated' })),
      option('Fourth or subsequent offense', felony('1 to 5 years', years(1), years(5), 1000, 5000, null, { must_serve: '90 days actual custody; all but 90 days may be suspended, stayed, or probated', parole_note: PUBLIC_CSL_NOTE })),
    ])],
    driving_restrictions: duiDrivingRestrictions,
    notes: 'Under-21, commercial-driver, and child-passenger DUI provisions have additional classifications and separate-conviction consequences. Confirm those variants separately. Only convictions on or after July 1, 2008 count toward the fourth-offense felony, and a fourth offense whose 10-year window began before July 1, 2008 is punished as a high and aggravated misdemeanor.',
  },

  'fleeing-eluding': {
    variables: [select('offense_circumstances', 'History or aggravated circumstance', [
      option('First basic offense', highMisdemeanor('30 days to 12 months', 1000, 5000, { sentence_minimum: days(30), must_serve: 'First 30 days and the minimum fine are generally not suspendable' })),
      option('Second basic offense within 10 years', highMisdemeanor('90 days to 12 months', 2500, 5000, { sentence_minimum: days(90), must_serve: 'First 90 days and the minimum fine are generally not suspendable' })),
      option('Third basic offense within 10 years', highMisdemeanor('180 days to 12 months', 4000, 5000, { sentence_minimum: days(180), must_serve: 'First 180 days and the minimum fine are generally not suspendable' })),
      option('Fourth or later offense within 10 years', felony('1 to 10 years', years(1), years(10), 5000, 10000, 1, { must_serve: 'At least 1 year; sentence may not be suspended, probated, reduced, merged, or served concurrently', probation_eligible: false })),
      option('Aggravated fleeing circumstance', felony('1 to 10 years', years(1), years(10), 5000, 10000, 1, { must_serve: 'At least 1 year; sentence may not be suspended, probated, reduced, merged, or served concurrently', probation_eligible: false })),
      option('Covered Department of Public Safety pursuit; conduct on/after July 1, 2026', felony('Applicable misdemeanor or felony range, calculated at 30 days per mile', years(1), years(10), 1000, 10000, 1, { notes: 'The factfinder determines miles fled. The 30-days-per-mile calculation is capped by the otherwise-applicable first/second/third/felony range; undetermined distance is presumed zero.' })),
    ])],
    driving_restrictions: fleeingDrivingRestrictions,
  },

  'obstruction-officer': {
    variables: [select('obstruction_type', 'Conduct and violent-offense history', [
      option('Nonviolent obstruction', misdemeanor('0 to 12 months', 300, 1000, { must_serve: 'Mandatory minimum $300 fine' })),
      option('Violence; first offense', felony('1 to 5 years', years(1), years(5), 300, 100000, 3)),
      option('Violence; second offense', felony('2 to 10 years', years(2), years(10), 300, 100000, 3)),
      option('Violence; third or later offense', felony('3 to 15 years', years(3), years(15), 300, 100000, 3)),
      option('Throwing bodily or animal fluids', felony('1 to 5 years', years(1), years(5), 300, 100000, 3)),
    ])],
  },

  'failure-to-register-sex-offender': {
    variables: [select('offense_history', 'Conviction history', [
      option('First offense', felony('1 to 30 years', years(1), years(30), 0, 100000, 5)),
      option('Second offense', felony('5 to 30 years', years(5), years(30), 0, 100000, 5)),
    ])],
  },

  'stalking': {
    variables: [select('offense_history', 'Conviction history', [
      option('First offense', misdemeanor()),
      option('Second or later offense', felony('1 to 10 years', years(1), years(10), 0, 100000, 5)),
      repeatMisdemeanor,
    ])],
  },

  'aggravated-stalking': {
    base_penalty: felony('1 to 10 years and a fine up to $10,000', years(1), years(10), 0, 10000, 8, { bdv: true }),
  },

  'simple-assault': {
    variables: [select('circumstances', 'Victim or circumstance', [
      option('General', misdemeanor()),
      option('Family violence, pregnant victim, transit, school employee, or utility worker', highMisdemeanor()),
      option('Code-enforcement official; conduct on/after July 1, 2026', highMisdemeanor()),
      repeatMisdemeanor,
    ])],
  },

  'simple-battery': {
    variables: [select('circumstances', 'Victim or circumstance', [
      option('General', misdemeanor()),
      option('Victim 65+, pregnant, police/correction/detention officer, family member, sports official, school employee, transit setting, or utility worker', highMisdemeanor()),
      option('Code-enforcement official; conduct on/after July 1, 2026', highMisdemeanor()),
      repeatMisdemeanor,
    ])],
  },

  'battery': {
    variables: [select('circumstances', 'History or circumstance', [
      option('General; first offense', misdemeanor()),
      option('Second offense against the same victim', misdemeanor('10 days to 12 months', 0, 1000, { sentence_minimum: days(10), must_serve: '10 days, unless the court makes the statutory hardship/failure-of-justice finding' })),
      option('Third or later offense against the same victim', felony('1 to 5 years', years(1), years(5), 0, 100000, null, { parole_note: PUBLIC_CSL_NOTE, must_serve: 'The minimum sentence may not be suspended, probated, deferred, stayed, or withheld except under the § 16-5-23.1(d) weekend-service or hardship/failure-of-justice provisions' })),
      option('Family violence; first offense with a prior household forcible felony', felony('1 to 5 years', years(1), years(5), 0, 100000, 4)),
      option('Family violence; second or later battery', felony('1 to 5 years', years(1), years(5), 0, 100000, 4)),
      option('School personnel', fineOrPrison('Fine, 1 to 5 years imprisonment, or both', years(1), years(5), 0, 10000, null, { parole_note: PUBLIC_CSL_NOTE })),
      option('Transit, pregnant victim, sports official, utility worker, or qualifying code-enforcement official', highMisdemeanor()),
      repeatMisdemeanor,
    ])],
  },

  'aggravated-battery': {
    variables: [select('victim', 'Victim or circumstance', [
      option('General', felony('1 to 20 years', years(1), years(20), 0, 100000, 8, { bdv: true })),
      option('Public-safety officer; defendant age 17+', felony('10 to 20 years', years(10), years(20), 2000, 100000, 8, { bdv: true, must_serve: '3 years, subject to prosecutor-agreed statutory departure', probation_eligible: false })),
      option('Public-safety officer; defendant under age 17', felony('10 to 20 years', years(10), years(20), 2000, 100000, 8, { bdv: true, notes: 'The 10-to-20-year range and $2,000 minimum fine apply regardless of age; the 3-year mandatory minimum in O.C.G.A. § 16-5-24(c)(1) applies only to defendants who are at least 17.' })),
      option('Victim age 65+, transit, or school victim', felony('5 to 20 years', years(5), years(20), 0, 100000, 8, { bdv: true })),
      option('Family violence, hospital worker, utility worker, or qualifying code-enforcement official', felony('3 to 20 years', years(3), years(20), 0, 100000, 8, { bdv: true })),
    ])],
  },

  'family-violence-battery': {
    variables: [select('offense_history', 'Family-violence history', [
      option('First offense; no prior household forcible felony', misdemeanor()),
      option('First battery offense with a prior household forcible felony', felony('1 to 5 years', years(1), years(5), 0, 100000, 4)),
      option('Second or later family-violence battery', felony('1 to 5 years', years(1), years(5), 0, 100000, 4)),
      repeatMisdemeanor,
    ])],
  },

  'voluntary-manslaughter': {
    base_penalty: felony('1 to 20 years', years(1), years(20), 0, 100000, 8, { bdv: true }),
  },

  'involuntary-manslaughter': {
    variables: [select('type', 'Type of involuntary manslaughter', [
      option('During an unlawful act other than a felony', felony('1 to 10 years', years(1), years(10), 0, 100000, 8, { bdv: true })),
      option('During a lawful act performed unlawfully', misdemeanor()),
      repeatMisdemeanor,
    ])],
  },

  'vehicular-homicide': {
    variables: [select('degree_basis', 'Degree and underlying violation', [
      option('First degree; DUI or declared habitual-violator basis', felony('3 to 15 years', years(3), years(15), 0, 100000, 8, { bdv: true })),
      option('First degree; fleeing or other listed non-DUI/HV basis', felony('3 to 15 years', years(3), years(15), 0, 100000, 6)),
      option('First degree; declared habitual violator driving with revoked license', felony('5 to 20 years', years(5), years(20), 0, 100000, 8, { bdv: true, must_serve: 'At least 1 year actual custody before suspension or probation is permitted' })),
      option('Second degree; other traffic violation', misdemeanor()),
    ])],
    driving_restrictions: vehicularHomicideDrivingRestrictions,
  },

  'rape': {
    variables: [select('sentence_type', 'Sentence imposed', [
      option('Non-life split sentence', felony('25 years to life imprisonment, followed by probation for life', years(25), life, 0, 100000, null, { parole_status: 'statutory-no-parole', must_serve: 'At least 25 years; the non-life prison term is served in full without parole', probation_eligible: false, bdv: true })),
      seriousLife(),
      seriousLwop,
      option('Prior sexual-felony conviction', felony('Life, or a prison term followed by probation for life', years(25), life, 0, 100000, null, { parole_status: 'statutory-no-parole', must_serve: 'At least 25 years for a non-life term (§ 17-10-6.1(b)(2)); a first serious-violent-felony term is served in full without parole', probation_eligible: false, bdv: true, notes: 'O.C.G.A. § 16-6-1(d)(2). Electronic monitoring is a required probation condition. If the prior sexual felony was itself a serious violent felony, O.C.G.A. § 17-10-7(b)(2) requires life without parole.' })),
    ])],
    notes: 'The printed statute still contains the word “death,” but controlling U.S. Supreme Court law makes death constitutionally unavailable for an ordinary completed nonhomicide rape. It is not shown as an operative option here.',
  },

  'sexual-battery': {
    variables: [select('circumstances', 'Victim age and history', [
      option('Victim age 16+; first offense', highMisdemeanor()),
      option('Victim under 16; first offense', felony('1 to 5 years', years(1), years(5), 0, 100000, 4)),
      option('Second or later sexual-battery conviction', felony('1 to 5 years, with statutory split-sentence rules', years(1), years(5), 0, 100000, 4, { must_serve: '1-year statutory minimum under O.C.G.A. § 17-10-6.2, plus a probation tail of at least 1 year; on a second sexual-battery conviction only a prosecutor-agreed departure is available' })),
      repeatMisdemeanor,
    ])],
  },

  'firearm-by-felon': {
    variables: [select('offense_history', 'Prohibited-person status and history', [
      option('Possess/receive/transport; first offense; not under active supervision', felony('1 to 10 years', years(1), years(10), 0, 100000, 3)),
      option('Possess/receive/transport; second or later offense; not under active supervision', felony('5 to 10 years', years(5), years(10), 0, 100000, 3)),
      option('Possess/receive/transport while under active probation or parole supervision', felony('Applicable 1–10 or 5–10 year range', years(1), years(10), 0, 100000, 4)),
      option('Underlying forcible-felony prohibition', felony('Fixed 5 years', years(5), years(5), 0, 100000, 3)),
      option('Attempt to purchase or obtain transfer; first offense', felony('1 to 5 years', years(1), years(5), 0, 100000, 3)),
      option('Attempt to purchase or obtain transfer; second or later offense', felony('5 to 10 years', years(5), years(10), 0, 100000, 3)),
    ])],
  },

  'carrying-weapon-unauthorized': {
    variables: [select('location_status', 'Location and license/status', [
      option('General unauthorized location', misdemeanor()),
      option('Place of worship; lawful weapons carrier', misdemeanor('Fine only; no confinement', 0, 100, { sentence_minimum: months(0), sentence_maximum: months(0) })),
      option('School safety zone; non-lawful carrier', fineOrPrison('Fine, 2 to 10 years imprisonment, or both', years(2), years(10), 0, 10000, null, { parole_note: PUBLIC_CSL_NOTE })),
      option('School safety zone; dangerous weapon or machine gun', fineOrPrison('Fine, 5 to 10 years imprisonment, or both', years(5), years(10), 0, 10000, null, { parole_note: PUBLIC_CSL_NOTE })),
      option('Campus carry; first offense', misdemeanor('Fine only; no confinement', 25, 25, { sentence_minimum: months(0), sentence_maximum: months(0) })),
      option('Nuclear facility; no intent to cause bodily harm', misdemeanor()),
      option('Nuclear facility; intent to cause bodily harm', fineOrPrison('Fine, 2 to 20 years imprisonment, or both', years(2), years(20), 0, 10000, null, { parole_note: PUBLIC_CSL_NOTE })),
    ])],
  },

  'firearm-during-felony': {
    variables: [select('offense_history', 'Conviction history', [
      option('First offense', felony('Fixed 5 years, consecutive', years(5), years(5), 0, 100000, 2, { other: 'The five-year sentence is consecutive. Georgia appellate authority permits the judge to suspend or probate all or part of a first sentence.' })),
      option('Second or subsequent offense', felony('Fixed 10 years, consecutive', years(10), years(10), 0, 100000, 2, { must_serve: '10 years consecutive; may not be suspended or probated', probation_eligible: false })),
    ])],
  },
};
