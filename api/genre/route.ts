import { NotFoundError, restCatch } from 'custom-restify-errors';
import { IOrmReq } from 'orm-mw';
import * as restify from 'restify';
import { JsonSchema } from 'tv4';
import { Genre } from './models';

const slugify: (s: string) => string = require('slugify');

/* tslint:disable:no-var-requires */
const genre_schema: JsonSchema = require('./../../test/api/genre/schema');

const zip = (a0: any[], a1: any[]) => a0.map((x, i) => [x, a1[i]]);

export const create = (app: restify.Server, namespace: string = ''): void => {
    app.post(`${namespace}/:name`,
        (req: restify.Request & IOrmReq & {user_id: string}, res: restify.Response, next: restify.Next) => {
            const genre = new Genre();
            genre.name = slugify(req.params.name.replace('_', '-'));

            req.getOrm().typeorm.connection.manager
                .save(genre)
                .then((genre_obj: Genre) => {
                    if (genre_obj == null) return next(new NotFoundError('Genre'));
                    res.json(201, genre_obj);
                    return next();
                })
                .catch(restCatch(req, res, next));
        }
    );
};

export const read = (app: restify.Server, namespace: string = ''): void => {
    app.get(`${namespace}/:name`,
        (req: restify.Request & IOrmReq, res: restify.Response, next: restify.Next) => {
            req.getOrm().typeorm.connection
                .getRepository(Genre)
                .findOne({ name: req.params.name })
                .then((genre: Genre) => {
                    if (genre == null) return next(new NotFoundError('Genre'));
                    res.json(200, genre);
                    return next();
                })
                .catch(restCatch(req, res, next));
        }
    );
};
