import { Recommendation } from '../../../api/recommendation/models';
import { event_mocks } from '../event/event_mocks';

export const recommendation_mocks: {successes: Recommendation[], failures: Array<{}>} = {
    failures: [
        {},
        { nom: false },
        { name: 'foo', bad_prop: true }
    ],
    successes:
        Array(5)
            .fill(null)
            .map((_, idx) => ({
                id: Math.floor(Math.random() * 1000),
                event_id: event_mocks.successes[idx].id,
                imdb_ids: [
                    `imdb-${Math.floor(Math.random() * 1000)}`,
                    `imdb-${Math.floor(Math.random() * 1000)}`,
                    `imdb-${Math.floor(Math.random() * 1000)}`,
                    `imdb-${Math.floor(Math.random() * 1000)}`
                ]
            }))
};

if (require.main === module) {
    /* tslint:disable:no-console */
    console.info(recommendation_mocks);
}
