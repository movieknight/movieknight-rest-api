import * as g from 'ger';

const esm = new g.MemESM();
const ger = new g.GER(esm);


interface IRecommendMovie {
    namespace: 'movies';
    person: string;
    action: string;
    thing: string;
    expires_at: string;
}

export const recommend_movie = (recommend_movies: IRecommendMovie[]) =>
    ger.initialize_namespace('movies')
        .then(() => ger.events(recommend_movies))
        .then(() =>
            // What things might alice like?
            ger.recommendations_for_person('movies', 'alice', { actions: { likes: 1 } })
        )
        .then(recommendations => {
            console.log('\nRecommendations For \'alice\'');
            console.log(JSON.stringify(recommendations, null, 2))
        })
        .then(() =>
            // What things are similar to xmen?
            ger.recommendations_for_thing('movies', 'xmen', { actions: { likes: 1 } })
        )
        .then(recommendations => {
            console.log('\nRecommendations Like \'xmen\'');
            console.log(JSON.stringify(recommendations, null, 2))
        });

if (require.main === module) {
    recommend_movie([
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
    ]);
}
