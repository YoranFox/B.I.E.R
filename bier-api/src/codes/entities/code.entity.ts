import { UserRole } from "src/enums/roles.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Code {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: true})
    description: string;

    @Column()
    code: string;

    @Column({
        type: "enum",
        enum: UserRole,             
    })
    role: UserRole;

    @Column({default: true})
    active: boolean;

    @Column({type: "timestamp"})
    endDate: Date;

    @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    createdOn: Date;
}
