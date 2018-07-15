import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiJsonSchema from 'chai-json-schema';
import { IncomingMessageError, sanitiseSchema, superEndCb, TCallback } from 'nodejs-utils';
import * as supertest from 'supertest';
import { Response } from 'supertest';

import { Event_ } from '../../../api/event/models';
import * as event_route from '../../../api/event/route';
import * as event_routes from '../../../api/event/routes';
import { User } from '../../../api/user/models';

/* tslint:disable:no-var-requires */
const user_schema = sanitiseSchema(require('./../user/schema.json'), User._omit);
const event_schema = require('./schema.json');

chai.use(chaiJsonSchema);

export class EventTestSDK {
    constructor(public app) {
    }

    public create(access_token: string, event: Event_,
                  callback: TCallback<Error | IncomingMessageError, Response>) {
        if (access_token == null) return callback(new TypeError('`access_token` argument to `create` must be defined'));
        else if (event == null) return callback(new TypeError('`event` argument to `create` must be defined'));
        else if (event.title == null) return callback(new TypeError('`event.title` argument to `create` must be defined'));

        expect(event_route.create).to.be.an.instanceOf(Function);
        supertest(this.app)
            .post(`/api/event/${event.title}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .send(event)
            .expect('Content-Type', /json/)
            .end((err, res: Response) => {
                if (err != null) return superEndCb(callback)(err);
                else if (res.error != null) return superEndCb(callback)(res.error);

                try {
                    expect(res.status).to.be.equal(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.be.jsonSchema(event_schema);
                } catch (e) {
                    err = e as Chai.AssertionError;
                } finally {
                    superEndCb(callback)(err, res);
                }
            });
    }

    public getAll(access_token: string, event: Event_,
                  callback: TCallback<Error | IncomingMessageError, Response>) {
        if (access_token == null) return callback(new TypeError('`access_token` argument to `getAll` must be defined'));
        else if (event == null) return callback(new TypeError('`event` argument to `getAll` must be defined'));

        expect(event_routes.readAll).to.be.an.instanceOf(Function);
        supertest(this.app)
            .get('/api/events')
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res: Response) => {
                if (err != null) return superEndCb(callback)(err);
                else if (res.error != null) return superEndCb(callback)(res.error);
                try {
                    expect(res.body).to.have.property('owner');
                    expect(res.body).to.have.property('events');
                    expect(res.body.events).to.be.instanceOf(Array);
                    res.body.events.map(_event => {
                        expect(_event).to.be.an('object');
                        expect(_event).to.be.jsonSchema(event_schema);
                    });
                } catch (e) {
                    err = e as Chai.AssertionError;
                } finally {
                    superEndCb(callback)(err, res);
                }
            });
    }

    public retrieve(access_token: string, event: Event_,
                    callback: TCallback<Error | IncomingMessageError, Response>) {
        if (access_token == null) return callback(new TypeError('`access_token` argument to `retrieve` must be defined'));
        else if (event == null) return callback(new TypeError('`event` argument to `retrieve` must be defined'));
        else if (event.owner == null) return callback(new TypeError('`event.owner` argument to `retrieve` must be defined'));

        expect(event_route.read).to.be.an.instanceOf(Function);
        supertest(this.app)
            .get(`/api/event/${event.title}_${event.owner}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res: Response) => {
                if (err != null) return superEndCb(callback)(err);
                else if (res.error != null) return superEndCb(callback)(res.error);
                try {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.be.jsonSchema(event_schema);
                } catch (e) {
                    err = e as Chai.AssertionError;
                } finally {
                    superEndCb(callback)(err, res);
                }
            });
    }

    public update(access_token: string, initial_event: Event_,
                  updated_event: Event_, callback: TCallback<Error | IncomingMessageError, Response>) {
        if (access_token == null)
            return callback(new TypeError('`access_token` argument to `update` must be defined'));
        else if (initial_event == null)
            return callback(new TypeError('`initial_event` argument to `update` must be defined'));
        else if (updated_event == null)
            return callback(new TypeError('`updated_event` argument to `update` must be defined'));
        else if (initial_event.owner !== updated_event.owner)
            return callback(
                new ReferenceError(`${initial_event.owner} != ${updated_event.owner} (\`owner\`s between events)`)
            );

        expect(event_route.update).to.be.an.instanceOf(Function);
        supertest(this.app)
            .put(`/api/event/${initial_event.title}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .send(updated_event)
            .end((err, res: Response) => {
                if (err != null) return superEndCb(callback)(err);
                else if (res.error != null) return superEndCb(callback)(res.error);
                try {
                    expect(res.body).to.be.an('object');
                    Object.keys(updated_event).map(
                        attr => expect(updated_event[attr]).to.be.equal(res.body[attr])
                    );
                    expect(res.body).to.be.jsonSchema(event_schema);
                } catch (e) {
                    err = e as Chai.AssertionError;
                } finally {
                    superEndCb(callback)(err, res);
                }
            });
    }

    public destroy(access_token: string, event: Event_,
                   callback: TCallback<Error | IncomingMessageError, Response>) {
        if (access_token == null)
            return callback(new TypeError('`access_token` argument to `destroy` must be defined'));
        else if (event == null)
            return callback(new TypeError('`event` argument to `destroy` must be defined'));

        expect(event_route.del).to.be.an.instanceOf(Function);
        supertest(this.app)
            .del(`/api/event/${event.title}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .end((err, res: Response) => {
                if (err != null) return superEndCb(callback)(err);
                else if (res.error != null) return superEndCb(callback)(res.error);
                try {
                    expect(res.status).to.be.equal(204);
                } catch (e) {
                    err = e as Chai.AssertionError;
                } finally {
                    superEndCb(callback)(err, res);
                }
            });
    }
}
