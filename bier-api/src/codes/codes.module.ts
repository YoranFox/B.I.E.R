import { Module } from '@nestjs/common';
import { CodesService } from './codes.service';
import { CodesController } from './codes.controller';
import { Code } from './entities/code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Code])
  ],
  controllers: [CodesController],
  providers: [CodesService],
  exports: [CodesService, TypeOrmModule.forFeature([Code])]
})
export class CodesModule {}
