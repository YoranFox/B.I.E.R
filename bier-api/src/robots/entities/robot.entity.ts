import { Session } from 'inspector';
import { Code } from 'src/codes/entities/code.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Robot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  accessKey: string;

  @Column()
  status: string;

  @ManyToMany(() => Code, (code) => code.robots)
  codes: Code[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;
}
