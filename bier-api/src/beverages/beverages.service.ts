import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBeverageDto } from './dto/create-beverage.dto';
import { UpdateBeverageDto } from './dto/update-beverage.dto';
import { Beverage } from './entities/beverage.entity';

@Injectable()
export class BeveragesService {


  @InjectRepository(Beverage)
  private beverageRep: Repository<Beverage>;

  create(createBeverageDto: CreateBeverageDto) {
    return this.beverageRep.save(createBeverageDto);
  }

  findAll() {
    return this.beverageRep.find();
  }

  findOne(id: string) {
    return this.beverageRep.findOne(id);
  }

  update(id: string, updateBeverageDto: UpdateBeverageDto) {
    return this.beverageRep.save({id, ...updateBeverageDto});
  }

  remove(id: string) {
    return this.beverageRep.softDelete({id});
  }

  async findByCreator(creatorId: string): Promise<Beverage[]> {
    return this.beverageRep.find({where: {
      creator: {id: creatorId}
    }})
  }

  async findByCode(codeId: string): Promise<Beverage[]> {
    return this.beverageRep.find({where: {
      code: {id: codeId}
    }})
  }
}
