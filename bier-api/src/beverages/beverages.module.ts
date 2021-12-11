import { Module } from '@nestjs/common';
import { BeveragesService } from './beverages.service';
import { BeveragesController } from './beverages.controller';
import { Beverage } from './entities/beverage.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Beverage])],
  controllers: [BeveragesController],
  providers: [BeveragesService],
  exports: [BeveragesService, TypeOrmModule.forFeature([Beverage])]
})
export class BeveragesModule {}
