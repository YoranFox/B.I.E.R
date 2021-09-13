import { Module } from '@nestjs/common';
import { BeveragesService } from './beverages.service';
import { BeveragesController } from './beverages.controller';

@Module({
  controllers: [BeveragesController],
  providers: [BeveragesService]
})
export class BeveragesModule {}
