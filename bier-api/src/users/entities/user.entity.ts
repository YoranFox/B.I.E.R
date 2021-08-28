import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;

    @Column({nullable: true})
    pictureBase64String?: string;

    @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    createdOn: Date;
}
