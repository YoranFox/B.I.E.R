import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { CodesModule } from 'src/codes/codes.module';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [UsersModule, CodesModule, SessionsModule]
})
export class AuthModule {}