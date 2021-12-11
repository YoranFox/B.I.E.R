import { Order } from 'src/orders/entities/order.entity';
import { Injectable, Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  @InjectRepository(Order)
  private orderRep: Repository<Order>;

  findByCodeId(codeId: string) {
    return this.orderRep.find({ where: { code: { id: codeId } } });
  }

  async getCurrentAppectedOrders(codeId: string) {
    const orders = await this.findByCodeId(codeId);
    return orders.filter((order) => order.status === 'Accepted');
  }

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: string) {
    return this.orderRep.findOne(id);
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
