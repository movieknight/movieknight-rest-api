import * as g from 'ger';

const esm = new g.MemESM();
const ger = new g.GER(esm);

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const _dependencies = ['event'];

@Entity('liked_movies_tbl')
export class Liked_Movies {
    @PrimaryGeneratedColumn()
    movie_id: number;

    @Column()
    user_id: number;

    @Column()
    title: string;

    @Column()
    release_date: string;

    @Column()
    rating: number;

    @Column()
    rated_at: string;
}


ger.initialize_namespace('movies')
    .then(() => ger.events([
            {
                namespace: 'movies',
                person: 'bob',
                action: 'likes',
                thing: 'xmen',
                expires_at: '2020-06-06'
            },
            {
                namespace: 'movies',
                person: 'bob',
                action: 'likes',
                thing: 'avengers',
                expires_at: '2020-06-06'
            },
            {
                namespace: 'movies',
                person: 'alice',
                action: 'likes',
                thing: 'xmen',
                expires_at: '2020-06-06'
            },
        ])
    )
    .then(() =>
        // What things might alice like?
        ger.recommendations_for_person('movies', 'alice', { actions: { likes: 1 } })
    )
    .then(recommendations => {
        console.log('\nRecommendations For \'alice\'')
        console.log(JSON.stringify(recommendations, null, 2))
    })
    .then(() =>
        // What things are similar to xmen?
        ger.recommendations_for_thing('movies', 'xmen', { actions: { likes: 1 } })
    )
    .then(recommendations => {
        console.log('\nRecommendations Like \'xmen\'')
        console.log(JSON.stringify(recommendations, null, 2))
    });
