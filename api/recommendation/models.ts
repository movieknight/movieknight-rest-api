import { Column, Entity, PrimaryColumn } from 'typeorm';

export const _dependencies = ['event'];

@Entity('recommendation_tbl')
export class Recommendation {
    @PrimaryColumn()
    event_id: string;

    @Column('simple-array', { nullable: false })
    imdb_ids: string[];
}
