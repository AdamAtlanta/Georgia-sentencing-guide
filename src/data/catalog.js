import completedCrimes from './completeCrimes';
import { validateCatalog } from './validateCatalog';

const reviewedCrimeNotes = new Set([
  'armed-robbery',
  'dui-alcohol',
  'rape',
  'theft-by-deception',
  'theft-by-receiving',
  'theft-by-taking',
  'trafficking-fentanyl',
  'trafficking-mdma',
]);

const crimes = completedCrimes.map((crime) => {
  const cleaned = { ...crime };

  // Older free-text summaries mixed sentence ranges, custody minimums, and
  // parole rules. The completed tier data above now carries those concepts
  // separately, so stale prose is deliberately removed.
  delete cleaned.parole_info;
  delete cleaned.recidivist_info;
  if (!reviewedCrimeNotes.has(crime.id)) delete cleaned.notes;

  return cleaned;
});

export const sentencingCatalogStats = validateCatalog(crimes);

export default crimes;
