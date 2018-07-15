import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const _dependencies = ['event'];

@Entity('recommendation_tbl')
export class Recommendation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    event_id: number;

    @Column('simple-array', { nullable: false })
    imdb_ids: string[];
}

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
