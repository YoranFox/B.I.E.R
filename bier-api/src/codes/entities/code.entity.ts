import { Beverage } from 'src/beverages/entities/beverage.entity';
import { Creator } from 'src/creator/entities/creator.entity';
import { Map } from 'src/maps/entities/map.entity';
import { Robot } from 'src/robots/entities/robot.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Code {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  code: string;

  @ManyToMany(() => User, (user) => user.codes, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  users: User[];

  @ManyToMany(() => Beverage, {
    eager: true,
  })
  @JoinTable()
  beverages: Beverage[];

  @ManyToMany(() => Robot, {
    eager: true,
  })
  @JoinTable()
  robots: Robot[];

  @ManyToOne(() => Map, {
    eager: true,
  })
  map: Map;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => Creator, { eager: true })
  creator: Creator;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;
}
