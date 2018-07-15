create or replace view get_movies_and_genres
as
    select m.title, g.name, m.release_date from genres_movies gm
    join genres g on (g.id = gm.genre_id)
    join movies m on (m.id = gm.movie_id)

;

create or replace view get_liked_movies
as
    select m.id as movieID, u.id as userID, m.title, m.release_date, r.rating, r.rated_at from ratings r
    join movies m on (m.id = r.movie_id)
    join users u on (u.id = r.user_id)
    where r.rating > 3
;

create or replace view get_disliked_movies
as
    select m.id as movieID, u.id as userID, m.title, m.release_date, r.rating, r.rated_at from ratings r
    join movies m on (m.id = r.movie_id)
    join users u on (u.id = r.user_id)
    where r.rating <= 3
;
