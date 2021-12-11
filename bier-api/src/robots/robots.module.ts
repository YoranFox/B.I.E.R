import { Module } from '@nestjs/common';
import { RobotsService } from './robots.service';
import { RobotsController } from './robots.controller';

@Module({
  controllers: [RobotsController],
  providers: [RobotsService]
})
export class RobotsModule {}
