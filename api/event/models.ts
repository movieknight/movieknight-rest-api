import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event_tbl')
export class Event_ {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    title: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'boolean' })
    public?: boolean;

    @Column()
    owner: string;

    @Column({ type: 'integer', nullable: true })
    user_limit?: number;
}
