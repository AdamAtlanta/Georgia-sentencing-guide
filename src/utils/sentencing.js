import { getParoleGridLevel } from '@/data/paroleGrid';

const YEAR_IN_MONTHS = 12;

function cleanNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return null;

  const parsed = Number(value.replace(/[$,]/g, '').trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function duration(value, unit) {
  if (value === null || value === undefined) return null;

  if (unit.startsWith('year')) {
    return { value: value * YEAR_IN_MONTHS, unit: 'months' };
  }

  if (unit.startsWith('month') || unit === 'mos') {
    return { value, unit: 'months' };
  }

  if (unit.startsWith('day')) {
    return { value, unit: 'days' };
  }

  if (unit.startsWith('hour') || unit === 'h') {
    return { value, unit: 'hours' };
  }

  return null;
}

export function formatDuration(value) {
  if (!value) return 'Not specified';
  if (value.special) return value.special;

  const amount = value.value;
  if (value.unit === 'months' && amount !== 0 && amount % YEAR_IN_MONTHS === 0) {
    const years = amount / YEAR_IN_MONTHS;
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }

  const singular = amount === 1;
  const label = singular ? value.unit.replace(/s$/, '') : value.unit;
  return `${amount.toLocaleString()} ${label}`;
}

export function parseSentenceRange(sentence, overrides = {}) {
  if (overrides.sentence_minimum && overrides.sentence_maximum) {
    return {
      minimum: overrides.sentence_minimum,
      maximum: overrides.sentence_maximum,
    };
  }

  const text = String(sentence || '').replace(/[–—]/g, '-').trim();
  const lower = text.toLowerCase();

  if (!text) return null;

  if (lower.includes('death')) {
    return {
      minimum: { special: 'Death sentence' },
      maximum: { special: 'Death sentence' },
    };
  }

  if (lower.includes('life without parole')) {
    return {
      minimum: { special: 'Life without parole' },
      maximum: { special: 'Life without parole' },
    };
  }

  const yearsToLife = lower.match(/(\d+(?:\.\d+)?)\s*years?\s*(?:to|-)\s*life/);
  if (yearsToLife) {
    return {
      minimum: duration(Number(yearsToLife[1]), 'years'),
      maximum: { special: 'Life' },
    };
  }

  if (lower.includes('life')) {
    const finiteRange = lower.match(/(\d+(?:\.\d+)?)\s*(?:to|-)\s*(\d+(?:\.\d+)?)\s*years?/);
    return {
      minimum: finiteRange ? duration(Number(finiteRange[1]), 'years') : { special: 'Life' },
      maximum: { special: 'Life' },
    };
  }

  const mixedRange = lower.match(/(\d+(?:\.\d+)?)\s*(days?|months?|mos|years?)\s*-\s*(\d+(?:\.\d+)?)\s*(days?|months?|mos|years?)/);
  if (mixedRange) {
    return {
      minimum: duration(Number(mixedRange[1]), mixedRange[2]),
      maximum: duration(Number(mixedRange[3]), mixedRange[4]),
    };
  }

  const sameUnitRange = lower.match(/(\d+(?:\.\d+)?)\s*(?:to|-)\s*(\d+(?:\.\d+)?)\s*(days?|months?|mos|years?)/);
  if (sameUnitRange) {
    return {
      minimum: duration(Number(sameUnitRange[1]), sameUnitRange[3]),
      maximum: duration(Number(sameUnitRange[2]), sameUnitRange[3]),
    };
  }

  const upTo = lower.match(/up to\s*(\d+(?:\.\d+)?)\s*(days?|months?|mos|years?)/);
  if (upTo) {
    return {
      minimum: duration(0, upTo[2]),
      maximum: duration(Number(upTo[1]), upTo[2]),
    };
  }

  const exact = lower.match(/(\d+(?:\.\d+)?)\s*(days?|months?|mos|years?)\s*(?:mandatory|consecutive|imprisonment)/);
  if (exact) {
    const parsed = duration(Number(exact[1]), exact[2]);
    return { minimum: parsed, maximum: parsed };
  }

  if (lower.includes('misdemeanor')) {
    return {
      minimum: duration(0, 'months'),
      maximum: duration(12, 'months'),
    };
  }

  return null;
}

function defaultFineMaximum(classification) {
  if (classification === 'Felony') return 100000;
  if (classification === 'High and Aggravated Misdemeanor') return 5000;
  if (classification === 'Misdemeanor') return 1000;
  return null;
}

export function parseFineRange(fine, classification, overrides = {}) {
  if (overrides.fine_minimum !== undefined && overrides.fine_maximum !== undefined) {
    return {
      minimum: overrides.fine_minimum,
      maximum: overrides.fine_maximum,
    };
  }

  if (typeof fine === 'number') {
    return { minimum: 0, maximum: fine };
  }

  const text = String(fine || '').replace(/[–—]/g, '-');
  const values = [...text.matchAll(/\$?([\d,]+)/g)].map((match) => cleanNumber(match[1]));

  if (/minimum/i.test(text) && values.length > 0) {
    return {
      minimum: values[0],
      maximum: overrides.fine_maximum ?? defaultFineMaximum(classification),
    };
  }

  if (values.length >= 2) {
    return { minimum: values[0], maximum: values[1] };
  }

  if (values.length === 1) {
    return { minimum: 0, maximum: values[0] };
  }

  const maximum = defaultFineMaximum(classification);
  return maximum === null ? null : { minimum: 0, maximum };
}

export function inferClassification(crime, penalty) {
  if (penalty.classification) return penalty.classification;

  const explicit = String(penalty.severity_level || '').toLowerCase();
  if (explicit.includes('high') && explicit.includes('misdemeanor')) {
    return 'High and Aggravated Misdemeanor';
  }
  if (explicit.includes('felony')) return 'Felony';
  if (explicit.includes('misdemeanor')) return 'Misdemeanor';

  const sentence = String(penalty.sentence || '').toLowerCase();
  if (sentence.includes('high') && sentence.includes('misdemeanor')) {
    return 'High and Aggravated Misdemeanor';
  }
  if (sentence.includes('felony') || /\b(?:[1-9]|\d{2,})\s*(?:to|-)\s*\d+\s*years?/.test(sentence)) {
    return 'Felony';
  }
  if (sentence.includes('misdemeanor') || sentence.includes('month')) {
    return 'Misdemeanor';
  }

  const crimeType = String(crime.type || '').toLowerCase();
  if (crimeType === 'felony') return 'Felony';
  if (crimeType === 'misdemeanor') return 'Misdemeanor';

  return null;
}

export function calculatePenalty(crime, inputs) {
  if (!crime) return { status: 'empty', penalty: null };

  if (!crime.variables || crime.variables.length === 0) {
    return { status: 'ready', penalty: { ...crime.base_penalty } };
  }

  let result = crime.base_penalty ? { ...crime.base_penalty } : {};

  for (const variable of crime.variables) {
    const value = inputs[variable.id];
    if (value === undefined || value === '') {
      return { status: 'incomplete', penalty: null };
    }

    let match = null;
    if (variable.type === 'number' || variable.type === 'currency') {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) {
        return { status: 'invalid', penalty: null };
      }

      match = variable.ranges.find((range) => {
        const minimumMatches = range.min === undefined || numericValue >= range.min;
        const maximumMatches = range.max === null || range.max === undefined || numericValue < range.max;
        return minimumMatches && maximumMatches;
      });
    } else if (variable.type === 'select') {
      match = variable.options.find((option) => option.label === value);
    }

    if (!match) return { status: 'no-match', penalty: null };
    result = { ...result, ...match };
  }

  return { status: 'ready', penalty: result };
}

export function buildPenaltySummary(crime, penalty) {
  if (!penalty) return null;

  const classification = inferClassification(crime, penalty);
  const sentenceRange = parseSentenceRange(penalty.sentence, penalty);
  const fineRange = parseFineRange(penalty.fine, classification, penalty);
  const csl = penalty.csl ?? crime.csl ?? null;
  const paroleGrid = csl ? getParoleGridLevel(csl) : null;

  return {
    ...penalty,
    classification,
    sentenceRange,
    fineRange,
    csl,
    paroleGrid,
    paroleStatus: penalty.parole_status ?? crime.parole_status ?? (
      classification === 'Felony' ? 'grid' : 'not-applicable'
    ),
    paroleNote: penalty.parole_note ?? crime.parole_note ?? null,
    notes: penalty.notes ?? crime.notes ?? null,
  };
}
