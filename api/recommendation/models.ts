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

@Entity('get_liked_movies')
export class Liked_Movies {
    @PrimaryGeneratedColumn({type: 'integer'})
    movie_id: number;

    @Column({type: 'integer'})
    user_id: number;

    @Column({type: 'varchar', length: 255})
    title: string;

    @Column({type: 'date'})
    release_date: string;

    @Column({type: 'integer'})
    rating: number;

    @Column({type: 'timestamp without time zone'})
    rated_at: string;
}
