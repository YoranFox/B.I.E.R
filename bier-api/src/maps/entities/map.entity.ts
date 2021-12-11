import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Map {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    createdOn: Date;
}
