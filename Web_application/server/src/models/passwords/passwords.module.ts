import { Module } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { PasswordsController } from './passwords.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from './entities/password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Password])],
  controllers: [PasswordsController],
  providers: [PasswordsService],
  exports: [TypeOrmModule]
})
export class PasswordsModule {}
