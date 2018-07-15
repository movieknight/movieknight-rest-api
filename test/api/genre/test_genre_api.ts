import * as async from 'async';
import { createLogger } from 'bunyan';
import { IModelRoute, model_route_to_map } from 'nodejs-utils';
import { IOrmsOut, tearDownConnections } from 'orm-mw';
import { basename } from 'path';
import { Server } from 'restify';

import { AccessToken } from '../../../api/auth/models';
import { Genre } from '../../../api/genre/models';
import { _orms_out } from '../../../config';
import { all_models_and_routes_as_mr, setupOrmApp } from '../../../main';
import { create_and_auth_users } from '../../shared_tests';
import { AuthTestSDK } from '../auth/auth_test_sdk';
import { user_mocks } from '../user/user_mocks';
import { genre_mocks } from './genre_mocks';
import { GenreTestSDK } from './genre_test_sdk';
import { User } from '../../../api/user/models';
import { after, afterEach, before, describe, it } from 'mocha';

const models_and_routes: IModelRoute = {
    user: all_models_and_routes_as_mr['user'],
    auth: all_models_and_routes_as_mr['auth'],
    genre: all_models_and_routes_as_mr['genre']
};

process.env['NO_SAMPLE_DATA'] = 'true';
export const user_mocks_subset: User[] = user_mocks.successes.slice(20, 30);

const tapp_name = `test::${basename(__dirname)}`;
const logger = createLogger({ name: tapp_name });

describe('Genre::routes', () => {
    let sdk: GenreTestSDK;
    let auth_sdk: AuthTestSDK;

    const mocks: {successes: Genre[], failures: Array<{}>} = genre_mocks;

    before(done =>
        async.waterfall([
                cb => tearDownConnections(_orms_out.orms_out, e => cb(e)),
                cb => AccessToken.reset() || cb(void 0),
                cb => setupOrmApp(
                    model_route_to_map(models_and_routes), { logger },
                    { skip_start_app: true, app_name: tapp_name, logger },
                    cb
                ),
                (_app: Server, orms_out: IOrmsOut, cb) => {
                    _orms_out.orms_out = orms_out;

                    auth_sdk = new AuthTestSDK(_app);
                    sdk = new GenreTestSDK(_app);

                    return cb(void 0);
                },
                cb => create_and_auth_users(user_mocks_subset, auth_sdk, cb)
            ],
            done
        )
    );

    after('unregister all users', done => auth_sdk.unregister_all(user_mocks_subset, done));
    after('tearDownConnections', done => tearDownConnections(_orms_out.orms_out, done));

    describe('/api/genre', () => {
        it('POST should create genre', done =>
            sdk.create(user_mocks_subset[0].access_token, mocks.successes[0], done)
        );

        it('GET should get all genres', done => async.series([
                cb => sdk.create(user_mocks_subset[0].access_token, mocks.successes[1], cb),
                cb => sdk.getAll(user_mocks_subset[0].access_token, mocks.successes[0], cb)
            ], done)
        );
    });

    describe('/api/genre/:name', () => {
        before('createGenre', done => sdk.create(user_mocks_subset[0].access_token, mocks.successes[2], done));

        it('GET should retrieve genre', done =>
            sdk.retrieve(user_mocks_subset[0].access_token, mocks.successes[2], done)
        );

        /*
        it('PUT should update genre', done =>
            sdk.update(user_mocks_subset[0].access_token, mocks.successes[2],
                {
                    owner: mocks.successes[1].owner,
                    name: `NAME: ${mocks.successes[1].name}`
                } as Genre, done)
        );
        */

        /*
        it('DELETE should destroy genre', done =>
            sdk.destroy(user_mocks_subset[0].access_token, mocks.successes[2], done)
        );
        */
    });
});
