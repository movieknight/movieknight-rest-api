"use strict";
exports.__esModule = true;
var g = require("ger");
var esm = new g.MemESM();
var ger = new g.GER(esm);

/*var genres = [
    'Action',
    'Adventure',
    'Family',
    'Horror',
    'Romance'
]

var movies = [
    'Xmen',
    'Incredibles',
    'Hangover'
]*/

console.log("Printing genres to movies");
var genres_to_movies = new Map();

genres_to_movies.set("Action", ["Xmen","Incredibles"]);
genres_to_movies.set("Family", ["Incredibles"]);
genres_to_movies.set("Adventure", ["Hangover"]);

for (var [key, value] of genres_to_movies) {
    for (var element of value) {
        console.log(key + ' = ' + element);
    }
}

console.log("Printing movies to genres");
var movies_to_genres = new Map();

movies_to_genres.set("Xmen", ["Action"]);
movies_to_genres.set("Incredibles", ["Action", "Family"]);
movies_to_genres.set("Hangover", ["Adventure"]);

for (var [key, value] of movies_to_genres) {
    for (var element of value) {
        console.log(key + ' = ' + element);
    }
}

ger.initialize_namespace('movies')
    .then(function () {
    return ger.events([
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
        {
            namespace: 'movies',
            person: 'bob',
            action: 'likes',
            thing: 'incredibles',
            expires_at: '2020-06-06'
        },
        {
            namespace: 'movies',
            person: 'john',
            action: 'likes',
            thing: 'incredibles',
            expires_at: '2020-06-06'
        },
        {
            namespace: 'movies',
            person: 'jazza',
            action: 'likes',
            thing: 'incredibles',
            expires_at: '2020-06-06'
        },
        {
            namespace: 'movies',
            person: 'jazza',
            action: 'likes',
            thing: 'xmen',
            expires_at: '2020-06-06'
        },
        {
            namespace: 'movies',
            person: 'jazza',
            action: 'likes',
            thing: 'hangover',
            expires_at: '2020-06-06'
        },
        {
            namespace: 'movies',
            person: 'jazza',
            action: 'likes',
            thing: 'xmen',
            expires_at: '2020-06-06'
        },
        {
            namespace: 'movies',
            person: 'bob',
            action: 'likes',
            thing: 'hangover',
            expires_at: '2020-06-06'
        },
        {
            namespace: 'movies',
            person: 'jerro',
            action: 'likes',
            thing: 'xmen',
            expires_at: '2020-06-06'
        },
        {
            namespace: 'movies',
            person: 'jerro',
            action: 'likes',
            thing: 'hangover',
            expires_at: '2020-06-06'
        },
    ]);
})
    .then(function () {
    // What things might alice like?
    return ger.recommendations_for_person('movies', 'alice', { actions: { likes: 1 } });
})
    .then(function (recommendations) {
    console.log("\nRecommendations For 'alice'");
    console.log(JSON.stringify(recommendations, null, 2));
})
    .then(function () {
    // What things are similar to xmen?
    return ger.recommendations_for_thing('movies', 'xmen', { actions: { likes: 1 } });
})
    .then(function (recommendations) {
    console.log("\nRecommendations Like 'xmen'");
    console.log(JSON.stringify(recommendations, null, 2));
});
