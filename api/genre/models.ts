import { Entity, PrimaryColumn } from 'typeorm';

@Entity('genre_tbl')
export class Genre {
    @PrimaryColumn({ type: 'varchar' })
    name: string;
}
