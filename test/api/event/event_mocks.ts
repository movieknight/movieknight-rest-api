import { Event_ } from '../../../api/event/models';
import { user_mocks } from '../user/user_mocks';

export const event_mocks: {successes: Event_[], failures: Array<{}>} = {
    failures: [
        {},
        { nom: false },
        { name: 'foo', bad_prop: true }
    ],
    successes:
        Array(5)
            .fill(null)
            .map((_, idx) => ({
                id: `${idx}`,
                title: `chosen-${Math.floor(Math.random() * 1000)}`,
                owner: user_mocks.successes[idx].email
            })) as Event_[]
};

if (require.main === module) {
    /* tslint:disable:no-console */
    console.info(event_mocks);
}
