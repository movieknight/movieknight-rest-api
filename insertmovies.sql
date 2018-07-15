--movieId,title,genres

CREATE TABLE movie_table (
    movieID integer,
    title text,
    genres text,
    primary key (movieID)
);

--\copy movie_table FROM 'ml-20m/movies.csv' WITH (FORMAT csv);
\copy movie_table FROM "/Users/mitchell/Documents/aepi-hackathons/hackathon0/movieknight-rest-api/ml-20m/movies.csv" DELIMITER E',' CSV HEADER;
