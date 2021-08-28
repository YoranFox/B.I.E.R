import { Code } from "src/codes/entities/code.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ipClient: string;

    @ManyToOne(
        () => Code, code => code.id,
        {
            cascade: false,
            eager: true
        }
    )
    @JoinColumn()
    code: Code;

    @ManyToOne(
        () => User, user => user.id,
        { 
            cascade: false,
            eager: true,
            nullable: true
        })
    @JoinColumn()
    user: User;

    @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    startSession: Date;

    @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    lastActive: Date
}
