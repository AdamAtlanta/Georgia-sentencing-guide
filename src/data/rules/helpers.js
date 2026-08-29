export const months = (value) => ({ value, unit: 'months' });
export const days = (value) => ({ value, unit: 'days' });
export const hours = (value) => ({ value, unit: 'hours' });
export const years = (value) => months(value * 12);
export const life = { special: 'Life' };
export const lifeWithoutParole = { special: 'Life without parole' };
export const death = { special: 'Death sentence' };

export function felony(sentence, minimum, maximum, fineMinimum = 0, fineMaximum = 100000, csl = null, extra = {}) {
  return {
    sentence,
    sentence_minimum: minimum,
    sentence_maximum: maximum,
    fine_minimum: fineMinimum,
    fine_maximum: fineMaximum,
    classification: 'Felony',
    csl,
    parole_status: csl ? 'grid' : 'unlisted',
    ...extra,
  };
}

export function misdemeanor(sentence = '0 to 12 months', fineMinimum = 0, fineMaximum = 1000, extra = {}) {
  return {
    sentence,
    sentence_minimum: months(0),
    sentence_maximum: months(12),
    fine_minimum: fineMinimum,
    fine_maximum: fineMaximum,
    classification: 'Misdemeanor',
    csl: null,
    parole_status: 'not-applicable',
    ...extra,
  };
}

export function highMisdemeanor(sentence = '0 to 12 months', fineMinimum = 0, fineMaximum = 5000, extra = {}) {
  return {
    ...misdemeanor(sentence, fineMinimum, fineMaximum, extra),
    classification: 'High and Aggravated Misdemeanor',
  };
}

export function fineOrPrison(sentence, prisonMinimum, prisonMaximum, fineMinimum, fineMaximum, csl = null, extra = {}) {
  return felony(sentence, months(0), prisonMaximum, fineMinimum, fineMaximum, csl, {
    imprisonment_if_imposed: {
      minimum: prisonMinimum,
      maximum: prisonMaximum,
    },
    ...extra,
  });
}

export function option(label, penalty) {
  return { label, ...penalty };
}

export function select(id, label, options, extra = {}) {
  return { id, label, type: 'select', options, ...extra };
}

export function numeric(id, label, unit, ranges, extra = {}) {
  return { id, label, unit, type: 'number', ranges, ...extra };
}

export function range(min, max, penalty) {
  return { min, max, ...penalty };
}

export const PUBLIC_CSL_NOTE = 'This offense is not assigned a definite numeric CSL in the Parole Board\'s public chart. The Board may rate it by the most similar listed offense; confirmation from the Board is required.';
export const GUIDELINE_NOTE = 'The CSL time-to-serve figure is an advisory parole guideline, not a guaranteed release date.';
