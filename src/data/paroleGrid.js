export const PAROLE_GRID_SOURCE = {
  title: 'Georgia Parole Decision Guidelines',
  agency: 'Georgia State Board of Pardons and Paroles',
  gridUrl: 'https://pap.georgia.gov/document/document/click-here-see-current-parole-decision-guidelines-grid/download',
  rulesUrl: 'https://rules.sos.ga.gov/gac/475-3',
  cslUrl: 'https://pap.georgia.gov/document/document/notice-action-july-1-2023-google-docspdf/download',
  riskUrl: 'https://pap.georgia.gov/document/document/72023-updated-new-guidelines-risk-factor-infopdf/download',
  gridEffective: 'Cases considered on or after January 1, 2008',
  cslRevised: 'July 1, 2023',
  reviewedOn: 'August 2, 2026',
};

// Official time-to-serve recommendation ranges. The exact point inside a range
// is selected by the Board's guidelines process. These are recommendations,
// not parole eligibility dates or promises of release.
export const PAROLE_GRID = {
  1: {
    kind: 'months',
    overall: [15, 26],
    riskBands: {
      low: [15, 19],
      medium: [17, 22],
      high: [20, 26],
    },
  },
  2: {
    kind: 'months',
    overall: [18, 28],
    riskBands: {
      low: [18, 22],
      medium: [20, 24],
      high: [24, 28],
    },
  },
  3: {
    kind: 'months',
    overall: [20, 32],
    riskBands: {
      low: [20, 24],
      medium: [22, 28],
      high: [26, 32],
    },
  },
  4: {
    kind: 'months',
    overall: [22, 38],
    riskBands: {
      low: [22, 26],
      medium: [24, 34],
      high: [28, 38],
    },
  },
  5: {
    kind: 'months',
    overall: [32, 60],
    riskBands: {
      low: [32, 40],
      medium: [34, 48],
      high: [36, 60],
    },
  },
  6: {
    kind: 'months',
    overall: [34, 78],
    riskBands: {
      low: [34, 48],
      medium: [36, 60],
      high: [48, 78],
    },
  },
  7: {
    kind: 'months',
    overall: [38, 96],
    riskBands: {
      low: [38, 54],
      medium: [40, 78],
      high: [52, 96],
    },
  },
  8: {
    kind: 'percent',
    overall: [65, 90],
    riskBands: {
      low: 65,
      medium: 75,
      high: 90,
    },
  },
};

export function getParoleGridLevel(csl) {
  const numericLevel = Number(csl);
  return Number.isInteger(numericLevel) ? PAROLE_GRID[numericLevel] ?? null : null;
}
