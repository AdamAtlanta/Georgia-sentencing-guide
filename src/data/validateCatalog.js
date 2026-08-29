function penaltyOutcomes(crime) {
  if (crime.base_penalty) return [{ path: `${crime.id}.base_penalty`, penalty: crime.base_penalty }];

  return crime.variables.flatMap((variable) => {
    const entries = variable.options || variable.ranges || [];
    return entries.map((penalty, index) => ({
      path: `${crime.id}.${variable.id}[${index}]`,
      penalty,
    }));
  });
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function isDrivingOffense(crime) {
  return /^O\.C\.G\.A\. § 40-6-/.test(crime.statute || '');
}

export function validateCatalog(crimes) {
  const errors = [];
  const ids = new Set();

  if (crimes.length !== 67) {
    errors.push(`Expected 67 listed offenses; found ${crimes.length}`);
  }

  for (const crime of crimes) {
    if (!crime.id || ids.has(crime.id)) errors.push(`Missing or duplicate crime id: ${crime.id}`);
    ids.add(crime.id);

    if (!crime.title) errors.push(`${crime.id}: missing title`);
    if (!crime.description) errors.push(`${crime.id}: missing description`);
    if (!crime.statute) errors.push(`${crime.id}: missing statute`);
    if (!crime.reviewed_on) errors.push(`${crime.id}: missing review date`);
    if (!crime.sources?.length) errors.push(`${crime.id}: missing legal sources`);
    if (!crime.base_penalty && !crime.variables?.length) errors.push(`${crime.id}: missing penalty data`);

    if (isDrivingOffense(crime)) {
      const restrictions = crime.driving_restrictions;
      if (!restrictions?.summary) errors.push(`${crime.id}: missing driving-restriction summary`);
      if (!restrictions?.items?.length) errors.push(`${crime.id}: missing driving-restriction details`);
      for (const [index, item] of (restrictions?.items || []).entries()) {
        if (!item.label || !item.detail) errors.push(`${crime.id}.driving_restrictions[${index}]: incomplete restriction`);
      }
    }

    for (const variable of crime.variables || []) {
      const entries = variable.options || variable.ranges || [];
      if (!entries.length) errors.push(`${crime.id}.${variable.id}: no tiers`);

      if (variable.type === 'select') {
        const labels = entries.map((entry) => entry.label);
        if (labels.some((label) => !label)) errors.push(`${crime.id}.${variable.id}: option missing label`);
        if (new Set(labels).size !== labels.length) errors.push(`${crime.id}.${variable.id}: duplicate option label`);
      }

      if (variable.type === 'number' || variable.type === 'currency') {
        for (let index = 1; index < entries.length; index += 1) {
          if (entries[index - 1].max !== entries[index].min) {
            errors.push(`${crime.id}.${variable.id}: gap or overlap between numeric tiers ${index} and ${index + 1}`);
          }
        }
      }
    }

    for (const { path, penalty } of penaltyOutcomes(crime)) {
      if (!penalty.sentence) errors.push(`${path}: missing sentence summary`);
      if (!penalty.sentence_minimum) errors.push(`${path}: missing minimum sentence`);
      if (!penalty.sentence_maximum) errors.push(`${path}: missing maximum sentence`);
      if (!hasOwn(penalty, 'fine_minimum')) errors.push(`${path}: missing minimum fine`);
      if (!hasOwn(penalty, 'fine_maximum')) errors.push(`${path}: missing maximum fine`);
      if (!penalty.classification) errors.push(`${path}: missing classification`);
      if (!hasOwn(penalty, 'csl')) errors.push(`${path}: missing CSL field`);
      if (!penalty.parole_status) errors.push(`${path}: missing parole status`);
      if (penalty.csl !== null && (!Number.isInteger(penalty.csl) || penalty.csl < 1 || penalty.csl > 8)) {
        errors.push(`${path}: invalid CSL ${penalty.csl}`);
      }
      if (penalty.classification.includes('Misdemeanor') && penalty.csl !== null) {
        errors.push(`${path}: misdemeanor cannot have a felony CSL`);
      }
      if (penalty.classification === 'Felony' && penalty.csl === null && !['unlisted', 'statutory-no-parole'].includes(penalty.parole_status)) {
        errors.push(`${path}: felony without CSL needs an explicit public-chart or statutory override status`);
      }
    }
  }

  if (errors.length) {
    throw new Error(`Sentencing catalog validation failed:\n- ${errors.join('\n- ')}`);
  }

  return {
    offenses: crimes.length,
    outcomes: crimes.reduce((total, crime) => total + penaltyOutcomes(crime).length, 0),
  };
}
