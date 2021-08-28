import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { session } from 'passport';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {

  constructor(private userService: UsersService) {}

  @InjectRepository(Session)
  private sessionRep: Repository<Session>;

  /* CRUD operations */

  create(createSessionDto: CreateSessionDto) {
    return this.sessionRep.save(createSessionDto);
  }

  findAll(): Promise<Session[]> {
    return this.sessionRep.find();
  }

  findOne(id: string): Promise<Session> {
    return this.sessionRep.findOne(id);
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    const session = await this.findOne(id);
    return this.sessionRep.save({...session, ...updateSessionDto});
  }

  async remove(id: string): Promise<Session> {
    const session = await this.sessionRep.findOne(id);
    return this.sessionRep.remove(session);
  }

  /* Other */
  
  async setUser(session: Session, userId: string) {
    session.user = await this.userService.findOne(userId)
    return this.sessionRep.save(session);
  }

  removeUser(session: Session) {
    session.user = null;
    return this.sessionRep.save(session);
  }

  updateLastActive(session: Session) {
      session.lastActive = new Date()
      return this.sessionRep.save(session);
  }
}
