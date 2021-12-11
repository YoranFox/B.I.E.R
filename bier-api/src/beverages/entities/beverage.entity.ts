import { Creator } from "src/creator/entities/creator.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Beverage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    pictureBase64String?: string;

    @ManyToOne(() => Creator, {eager: true})
    creator: Creator;
}
