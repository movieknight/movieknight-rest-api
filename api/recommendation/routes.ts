import { NotFoundError, restCatch } from 'custom-restify-errors';
import { IOrmReq } from 'orm-mw';
import * as restify from 'restify';
import { JsonSchema } from 'tv4';
import { Recommendation } from './models';

/* tslint:disable:no-var-requires */
const recommendation_schema: JsonSchema = require('./../../test/api/recommendation/schema');

export const readAll = (app: restify.Server, namespace: string = ''): void => {
    app.get(`${namespace}s`,
        (req: restify.Request & IOrmReq, res: restify.Response, next: restify.Next) => {
            req.getOrm().typeorm.connection
                .getRepository(Recommendation)
                .find()
                .then((recommendations: Recommendation[]) => {
                    if (recommendations == null || !recommendations.length) return next(new NotFoundError('Recommendation'));
                    res.json({ recommendations });
                    return next();
                })
                .catch(restCatch(req, res, next));
        }
    );
};
