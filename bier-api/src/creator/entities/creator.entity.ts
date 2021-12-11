import { Beverage } from 'src/beverages/entities/beverage.entity';
import { Code } from 'src/codes/entities/code.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Creator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Code, (code) => code.creator)
  codes: Code[];

  @OneToMany(() => Beverage, (beverage) => beverage.creator)
  beverages: Beverage[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;
}
