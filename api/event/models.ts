import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('event_tbl')
export class Event_ {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({nullable: false})
    title: string;

    @Column({nullable: true})
    description?: string;

    @Column({type: 'boolean'})
    public?: boolean;

    @Column()
    owner: string;

    @Column('int64')
    user_limit?: number;
}
