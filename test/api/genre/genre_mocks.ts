import { Genre } from '../../../api/genre/models';
import { user_mocks } from '../user/user_mocks';
import { event_mocks } from '../event/event_mocks';

export const genre_mocks: {successes: Genre[], failures: Array<{}>} = {
    failures: [
        {},
        { nom: false },
        { name: 'foo', bad_prop: true }
    ],
    successes:
        Array(5)
            .fill(null)
            .map((_, idx) => ({
                name: `chosen-${Math.floor(Math.random() * 1000)}`,
                owner: event_mocks.successes[idx].id
            }))
};

if (require.main === module) {
    /* tslint:disable:no-console */
    console.info(genre_mocks);
}
