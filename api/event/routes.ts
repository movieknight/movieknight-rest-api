import { NotFoundError, restCatch } from 'custom-restify-errors';
import { IOrmReq } from 'orm-mw';
import * as restify from 'restify';
import { JsonSchema } from 'tv4';

import { has_auth } from '../auth/middleware';
import { Event_ } from './models';

/* tslint:disable:no-var-requires */
const event_schema: JsonSchema = require('./../../test/api/event/schema');

export const readAll = (app: restify.Server, namespace: string = ''): void => {
    app.get(`${namespace}s`, has_auth(),
        (req: restify.Request & IOrmReq, res: restify.Response, next: restify.Next) => {
            req.getOrm().typeorm.connection
                .getRepository(Event_)
                .find()
                .then((events: Event_[]) => {
                    if (events == null || !events.length) return next(new NotFoundError('Event_'));
                    res.json({ events });
                    return next();
                })
                .catch(restCatch(req, res, next));
        }
    );
};
