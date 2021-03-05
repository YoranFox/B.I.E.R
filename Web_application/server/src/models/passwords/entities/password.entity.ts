import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
const bcrypt = require('bcrypt');


@Entity()
export class Password {
    @BeforeInsert()
    async hashPassword() {
       this.hashedPassword = await bcrypt.hash(this.hashedPassword, Number(process.env.HASH_SALT));
    }

    @BeforeInsert()
    async setDate() {
       this.dateUpdated = new Date();
    }
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    hashedPassword: string;

    @Column()
    role: string;

    @Column({type: 'timestamp'})
    dateUpdated: Date;


   //  @Column()
   //  name: string;
}
