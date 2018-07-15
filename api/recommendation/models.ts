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
