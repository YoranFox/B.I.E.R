
import { Award } from "src/awards/entities/award.entity";
import { Code } from "src/codes/entities/code.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;

    @Column({nullable: true})
    moto: string;

    @Column({nullable: true})
    pictureBase64String?: string;

    @OneToMany(() => UserAward, (userAward) => userAward.user)
    awards: UserAward[];

    @ManyToMany(() => Code, code => code.users)
    codes: Code[];

    @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    createdOn: Date;
}


@Entity()
export class UserAward {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.awards)
    public user: User;

    @ManyToOne(() => Award)
    public award: Award;

    @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    obtainedAt: Date;
}
