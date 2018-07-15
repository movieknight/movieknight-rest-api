import { NotFoundError, restCatch } from 'custom-restify-errors';
import { IOrmReq } from 'orm-mw';
import * as restify from 'restify';
import { JsonSchema } from 'tv4';

import { has_auth } from '../auth/middleware';
import { Genre } from './models';

/* tslint:disable:no-var-requires */
const genre_schema: JsonSchema = require('./../../test/api/genre/schema');

export const readAll = (app: restify.Server, namespace: string = ''): void => {
    app.get(`${namespace}s`, has_auth(),
        (req: restify.Request & IOrmReq, res: restify.Response, next: restify.Next) => {
            req.getOrm().typeorm.connection
                .getRepository(Genre)
                .find()
                .then((genres: Genre[]) => {
                    if (genres == null || !genres.length) return next(new NotFoundError('Genre'));
                    res.json({ genres });
                    return next();
                })
                .catch(restCatch(req, res, next));
        }
    );
};
