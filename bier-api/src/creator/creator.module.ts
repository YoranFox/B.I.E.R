import { Module } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creator } from './entities/creator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Creator])],
  controllers: [CreatorController],
  providers: [CreatorService],
  exports: [CreatorService, TypeOrmModule.forFeature([Creator])]
})
export class CreatorModule {}
