import { Code } from 'src/codes/entities/code.entity';
import { Creator } from 'src/creator/entities/creator.entity';
import { Robot } from 'src/robots/entities/robot.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ipClient: string;

  @ManyToOne(() => Code, (code) => code.id, {
    onDelete: 'SET NULL',
    cascade: false,
    eager: true,
  })
  code?: Code;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: false,
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  user?: User;

  @ManyToOne(() => Creator, { nullable: true, eager: true, cascade: false })
  @JoinColumn()
  creator?: Creator;

  @ManyToOne(() => Robot, { nullable: true, eager: true, cascade: false })
  @JoinColumn()
  robot?: Robot;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startSession: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActive: Date;
}
