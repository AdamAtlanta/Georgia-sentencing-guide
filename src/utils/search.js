import Fuse from 'fuse.js';
import crimes from '@/data/crimes.json';

const options = {
    keys: [
        { name: 'title', weight: 0.7 },
        { name: 'statute', weight: 0.5 },
        { name: 'id', weight: 0.3 },
        { name: 'description', weight: 0.2 },
    ],
    threshold: 0.3, // Lower = more strict
    includeScore: true,
};

const fuse = new Fuse(crimes, options);

export function searchCrimes(query) {
    if (!query) {
        return [];
    }
    return fuse.search(query).map(result => result.item);
}
