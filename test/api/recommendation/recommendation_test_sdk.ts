import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiJsonSchema from 'chai-json-schema';
import { IncomingMessageError, sanitiseSchema, superEndCb, TCallback } from 'nodejs-utils';
import * as supertest from 'supertest';
import { Response } from 'supertest';

import * as recommendation_route from '../../../api/recommendation/route';
import * as recommendation_routes from '../../../api/recommendation/routes';
import { User } from '../../../api/user/models';
import { Recommendation } from '../../../api/recommendation/models';

/* tslint:disable:no-var-requires */
const user_schema = sanitiseSchema(require('./../user/schema.json'), User._omit);
const recommendation_schema = require('./schema.json');

chai.use(chaiJsonSchema);

export class RecommendationTestSDK {
    constructor(public app) {
    }

    public create(access_token: string, recommendation: Recommendation,
                  callback: TCallback<Error | IncomingMessageError, Response>) {
        if (access_token == null) return callback(new TypeError('`access_token` argument to `create` must be defined'));
        else if (recommendation == null) return callback(new TypeError('`recommendation` argument to `create` must be defined'));

        expect(recommendation_route.create).to.be.an.instanceOf(Function);
        supertest(this.app)
            .post(`/api/recommendation/${recommendation.event_id}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .expect('Content-Type', /json/)
            .end((err, res: Response) => {
                if (err != null) return superEndCb(callback)(err);
                else if (res.error != null) return superEndCb(callback)(res.error);

                try {
                    expect(res.status).to.be.equal(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.be.jsonSchema(recommendation_schema);
                } catch (e) {
                    err = e as Chai.AssertionError;
                } finally {
                    superEndCb(callback)(err, res);
                }
            });
    }

    public retrieve(access_token: string, recommendation: Recommendation,
                    callback: TCallback<Error | IncomingMessageError, Response>) {
        if (access_token == null) return callback(new TypeError('`access_token` argument to `retrieve` must be defined'));
        else if (recommendation == null) return callback(new TypeError('`recommendation` argument to `retrieve` must be defined'));
        else if (recommendation.event_id == null) return callback(new TypeError('`recommendation.event_id` argument to `retrieve` must be defined'));

        expect(recommendation_route.read).to.be.an.instanceOf(Function);
        console.info('RecommendationTestSDK::retrieve::recommendation =', recommendation, ';');
        supertest(this.app)
            .get(`/api/recommendation/${recommendation.event_id}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res: Response) => {
                if (err != null) return superEndCb(callback)(err);
                else if (res.error != null) return superEndCb(callback)(res.error);
                try {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.be.jsonSchema(recommendation_schema);
                } catch (e) {
                    err = e as Chai.AssertionError;
                } finally {
                    superEndCb(callback)(err, res);
                }
            });
    }
}
