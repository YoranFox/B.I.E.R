import { Injectable } from '@nestjs/common';
import { CreateRobotDto } from './dto/create-robot.dto';
import { UpdateRobotDto } from './dto/update-robot.dto';

@Injectable()
export class RobotsService {
  create(createRobotDto: CreateRobotDto) {
    return 'This action adds a new robot';
  }

  findAll() {
    return `This action returns all robots`;
  }

  findOne(id: number) {
    return `This action returns a #${id} robot`;
  }

  update(id: number, updateRobotDto: UpdateRobotDto) {
    return `This action updates a #${id} robot`;
  }

  remove(id: number) {
    return `This action removes a #${id} robot`;
  }
}
