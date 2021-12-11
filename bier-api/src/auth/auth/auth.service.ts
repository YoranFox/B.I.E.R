import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { CodesService } from 'src/codes/codes.service';
import { Code } from 'src/codes/entities/code.entity';
import { CreatorService } from 'src/creator/creator.service';
import { Creator } from 'src/creator/entities/creator.entity';
import { CreateSessionDto } from 'src/sessions/dto/create-session.dto';
import { Session } from 'src/sessions/entities/session.entity';
import { SessionsService } from 'src/sessions/sessions.service';
import { User } from 'src/users/entities/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginCreatorDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(private codeService: CodesService, private creatorService: CreatorService ,private sessionService: SessionsService){}

  async verifyCode(code: string): Promise<Code> {
      const codeObject = await this.codeService.validateCode(code);
      return codeObject;
  }

  async verifyCredentials(cred: LoginCreatorDto): Promise<Creator> {
    const creator = await this.creatorService.findByEmail(cred.email);
    const valid = await bcrypt.compare(cred.password, creator.password);
    return valid ? creator : null;
  }

  createJwtToken(session: Session) {
      const payload = {
        sessionId: session.id
      }
      return sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: 36000})
  }

    
  async loginWithCode(code: string, ip:string): Promise<LoginResponseDto> {
    const codeObject = await this.verifyCode(code);
    if(codeObject) {
      const newSession: CreateSessionDto = {
        code: codeObject,
        ipClient: ip
      }
      const createdSession = await this.sessionService.create(newSession);
      const jwt = this.createJwtToken(createdSession);
      return {
        jwt: jwt,
        sessionId: createdSession.id
      }
    }
    throw new UnauthorizedException('Code is not valid');
  }

  async loginAsCreator(loginDto: LoginCreatorDto, ip: string): Promise<LoginResponseDto> {
    const creator = await this.verifyCredentials(loginDto);
    if(creator) {
      const newSession: CreateSessionDto = {
        creator,
        ipClient: ip
      }
      const createdSession = await this.sessionService.create(newSession);
      const jwt = this.createJwtToken(createdSession);
      return {
        jwt: jwt,
        sessionId: createdSession.id
      }
    }
    throw new UnauthorizedException('Credentials is not valid');
  }
  
}

