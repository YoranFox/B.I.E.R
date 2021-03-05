import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Password } from './models/passwords/entities/password.entity';
import { PasswordsController } from './models/passwords/passwords.controller';
import { PasswordsModule } from './models/passwords/passwords.module';
import { PasswordsService } from './models/passwords/passwords.service';
import { Space } from './models/space/entities/space.entity';
import { SpaceController } from './models/space/space.controller';
import { SpaceModule } from './models/space/space.module';
import { SpaceService } from './models/space/space.service';

@Module({
  imports: [
    PasswordsModule,
    SpaceModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'bier_user',
      password: 'IL0VEB!ER',
      database: 'bier_db',
      entities: [Password, Space],
      synchronize: true,
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
