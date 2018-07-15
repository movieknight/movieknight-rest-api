import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiJsonSchema from 'chai-json-schema';
import { IncomingMessageError, sanitiseSchema, superEndCb, TCallback } from 'nodejs-utils';
import * as supertest from 'supertest';
import { Response } from 'supertest';

import { Genre } from '../../../api/genre/models';
import * as genre_route from '../../../api/genre/route';
import * as genre_routes from '../../../api/genre/routes';
import { User } from '../../../api/user/models';

/* tslint:disable:no-var-requires */
const user_schema = sanitiseSchema(require('./../user/schema.json'), User._omit);
const genre_schema = require('./schema.json');

chai.use(chaiJsonSchema);

export class GenreTestSDK {
    constructor(public app) {
    }

    public create(access_token: string, genre: Genre,
                  callback: TCallback<Error | IncomingMessageError, Response>) {
        if (access_token == null) return callback(new TypeError('`access_token` argument to `create` must be defined'));
        else if (genre == null) return callback(new TypeError('`genre` argument to `create` must be defined'));

        expect(genre_route.create).to.be.an.instanceOf(Function);
        supertest(this.app)
            .post(`/api/genre/${genre.name}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .expect('Content-Type', /json/)
            .end((err, res: Response) => {
                if (err != null) return superEndCb(callback)(err);
                else if (res.error != null) return superEndCb(callback)(res.error);

                try {
                    expect(res.status).to.be.equal(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.be.jsonSchema(genre_schema);
                } catch (e) {
                    err = e as Chai.AssertionError;
                } finally {
                    superEndCb(callback)(err, res);
                }
            });
    }

    public getAll(access_token: string, genre: Genre,
                  callback: TCallback<Error | IncomingMessageError, Response>) {
        if (access_token == null) return callback(new TypeError('`access_token` argument to `getAll` must be defined'));
        else if (genre == null) return callback(new TypeError('`genre` argument to `getAll` must be defined'));

        expect(genre_routes.readAll).to.be.an.instanceOf(Function);
        supertest(this.app)
            .get('/api/genres')
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res: Response) => {
                if (err != null) return superEndCb(callback)(err);
                else if (res.error != null) return superEndCb(callback)(res.error);
                try {
                    expect(res.body).to.have.property('owner');
                    expect(res.body).to.have.property('genres');
                    expect(res.body.genres).to.be.instanceOf(Array);
                    res.body.genres.map(_genre => {
                        expect(_genre).to.be.an('object');
                        expect(_genre).to.be.jsonSchema(genre_schema);
                    });
                } catch (e) {
                    err = e as Chai.AssertionError;
                } finally {
                    superEndCb(callback)(err, res);
                }
            });
    }

    public retrieve(access_token: string, genre: Genre,
                    callback: TCallback<Error | IncomingMessageError, Response>) {
        if (access_token == null) return callback(new TypeError('`access_token` argument to `retrieve` must be defined'));
        else if (genre == null) return callback(new TypeError('`genre` argument to `retrieve` must be defined'));
        else if (genre.name == null) return callback(new TypeError('`genre.name` argument to `retrieve` must be defined'));

        expect(genre_route.read).to.be.an.instanceOf(Function);
        console.info('GenreTestSDK::retrieve::genre =', genre, ';');
        supertest(this.app)
            .get(`/api/genre/${genre.name}`)
            .set('Connection', 'keep-alive')
            .set('X-Access-Token', access_token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res: Response) => {
                if (err != null) return superEndCb(callback)(err);
                else if (res.error != null) return superEndCb(callback)(res.error);
                try {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.be.jsonSchema(genre_schema);
                } catch (e) {
                    err = e as Chai.AssertionError;
                } finally {
                    superEndCb(callback)(err, res);
                }
            });
    }
}
