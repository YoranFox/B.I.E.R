import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Award {
    @PrimaryGeneratedColumn('uuid')
    id: string; 
  
    @Column()
    title: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    iconBase64String?: string;

    @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    createdOn: Date;
}
