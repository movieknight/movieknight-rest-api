import { NotFoundError, restCatch } from 'custom-restify-errors';
import { IOrmReq } from 'orm-mw';
import * as restify from 'restify';
import { has_body } from 'restify-validators';
import { JsonSchema } from 'tv4';
import { Recommendation, Liked_Movies } from './models';

const slugify: (s: string) => string = require('slugify');

/* tslint:disable:no-var-requires */
const recommendation_schema: JsonSchema = require('./../../test/api/recommendation/schema');

const zip = (a0: any[], a1: any[]) => a0.map((x, i) => [x, a1[i]]);

export const create = (app: restify.Server, namespace: string = ''): void => {
    app.post(`${namespace}/:name`, has_body,
        (req: restify.Request & IOrmReq & {user_id: string}, res: restify.Response, next: restify.Next) => {
            const recommendation = new Recommendation();
            recommendation.imdb_ids = req.body.imdb_ids;
            recommendation.event_id = Math.floor(Math.random() * 1000);

            req.getOrm().typeorm.connection.manager
                .save(recommendation)
                .then((recommendation_obj: Recommendation) => {
                    if (recommendation_obj == null) return next(new NotFoundError('Recommendation'));
                    res.json(201, recommendation_obj);
                    return next();
                })
                .catch(restCatch(req, res, next));
        }
    );
};

export const read = (app: restify.Server, namespace: string = ''): void => {
    app.get(`${namespace}/:event_id`,
        (req: restify.Request & IOrmReq, res: restify.Response, next: restify.Next) => {
            req.getOrm().typeorm.connection
                .getRepository(Recommendation)
                .findOne({ event_id: req.params.event_id })
                .then((recommendation: Recommendation) => {
                    if (recommendation == null) return next(new NotFoundError('Recommendation'));
                    res.json(200, recommendation);
                    return next();
                })
                .catch(restCatch(req, res, next));
        }
    );
};

export const get = (app: restify.Server, namespace: string = ''): void => {
    app.get(`${namespace.replace('recommendation', 'liked')}/liked_movies`, // has_body,
        (req: restify.Request & IOrmReq & {user_id: string}, res: restify.Response, next: restify.Next) => {
            req.getOrm().typeorm.connection
                .getRepository(Liked_Movies)
                .find({})
                .then((liked_movies: Liked_Movies[]) => {
                    if (liked_movies == null || !liked_movies.length)
                        return next(new NotFoundError('Liked_Movies'));
                    res.json(200, liked_movies);
                    return next();
                })
                .catch(restCatch(req, res, next));
        }
    );
};
