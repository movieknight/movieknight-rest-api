"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const g = require("ger");
const esm = new g.MemESM();
const ger = new g.GER(esm);
const typeorm_1 = require("typeorm");
exports._dependencies = ['event'];
let Liked_Movies = class Liked_Movies {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Liked_Movies.prototype, "movie_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Liked_Movies.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Liked_Movies.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Liked_Movies.prototype, "release_date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Liked_Movies.prototype, "rating", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Liked_Movies.prototype, "rated_at", void 0);
Liked_Movies = __decorate([
    typeorm_1.Entity('liked_movies_tbl')
], Liked_Movies);
exports.Liked_Movies = Liked_Movies;
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
]))
    .then(() => ger.recommendations_for_person('movies', 'alice', { actions: { likes: 1 } }))
    .then(recommendations => {
    console.log('\nRecommendations For \'alice\'');
    console.log(JSON.stringify(recommendations, null, 2));
})
    .then(() => ger.recommendations_for_thing('movies', 'xmen', { actions: { likes: 1 } }))
    .then(recommendations => {
    console.log('\nRecommendations Like \'xmen\'');
    console.log(JSON.stringify(recommendations, null, 2));
});
