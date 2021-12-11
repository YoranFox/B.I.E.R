import { Order } from 'src/orders/entities/order.entity';
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [TypeOrmModule.forFeature([Order]), OrdersService]
})
export class OrdersModule {}
