import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { CodesModule } from './codes/codes.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot(),
    SessionsModule,
    CodesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}
