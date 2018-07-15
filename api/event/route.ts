import { series } from 'async';
import { fmtError, NotFoundError, restCatch } from 'custom-restify-errors';
import { IOrmReq } from 'orm-mw';
import * as restify from 'restify';
import { has_body, mk_valid_body_mw_ignore } from 'restify-validators';
import { JsonSchema } from 'tv4';

import { has_auth } from '../auth/middleware';
import { name_owner_split_mw } from './middleware';
import { Event_ } from './models';

const slugify: (s: string) => string = require('slugify');

/* tslint:disable:no-var-requires */
const event_schema: JsonSchema = require('./../../test/api/event/schema');

const zip = (a0: any[], a1: any[]) => a0.map((x, i) => [x, a1[i]]);

export const create = (app: restify.Server, namespace: string = ''): void => {
    app.post(`${namespace}/:title`, has_auth(), has_body,
        (req: restify.Request & IOrmReq & {user_id: string}, res: restify.Response, next: restify.Next) => {
            const event = new Event_();
            event.id = req.body.id;
            event.title = slugify(req.params.title.replace('_', '-'));
            event.owner = req.user_id;
            event.public = req.body.public || false;

            req.getOrm().typeorm.connection.manager
                .save(event)
                .then((event_obj: Event_) => {
                    if (event_obj == null) return next(new NotFoundError('Event_'));
                    res.json(201, event_obj);
                    return next();
                })
                .catch(restCatch(req, res, next));
        }
    );
};

export const read = (app: restify.Server, namespace: string = ''): void => {
    app.get(`${namespace}/:name`, has_body, has_auth(),
        (req: restify.Request & IOrmReq, res: restify.Response, next: restify.Next) => {
            req.getOrm().typeorm.connection
                .getRepository(Event_)
                .findOne({ title: req.params.name, owner: req['user_id'] })
                .then((event: Event_) => {
                    if (event == null) return next(new NotFoundError('Event_'));
                    res.json(200, event);
                    return next();
                })
                .catch(restCatch(req, res, next));
        }
    );
};

export const update = (app: restify.Server, namespace: string = ''): void => {
    app.put(`${namespace}/:name_owner`, has_body, has_auth(),
        mk_valid_body_mw_ignore(event_schema, ['Missing required property']), name_owner_split_mw,
        (req: restify.Request & IOrmReq, res: restify.Response, next: restify.Next) => {
            const eventR = req.getOrm().typeorm.connection.getRepository(Event_);

            // TODO: Transaction
            series([
                cb =>
                    eventR
                        .update({ title: req.params.title, owner: req['user_id'] }, req.body)
                        .then(() => cb(void 0))
                        .catch(cb),
                cb =>
                    eventR
                        .findOne(req.body)
                        .then(event => {
                            if (event == null) return cb(new NotFoundError('Event_'));
                            return cb();
                        })
                        .catch(cb)
            ], error => {
                if (error != null) return next(fmtError(error));
                res.json(200, req.body);
                return next();
            });
        }
    );
};

export const del = (app: restify.Server, namespace: string = ''): void => {
    app.del(`${namespace}/:name`, has_auth(),
        (req: restify.Request & IOrmReq, res: restify.Response, next: restify.Next) => {
            req.getOrm().typeorm.connection
                .getRepository(Event_)
                .remove({ owner: req['user_id'], title: req.params.title } as any)
                .then(() => {
                    res.send(204);
                    return next();
                })
                .catch(restCatch(req, res, next));
        }
    );
};
