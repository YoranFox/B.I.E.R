import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { Creator } from './entities/creator.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreatorService {
  @InjectRepository(Creator)
  private creatorRep: Repository<Creator>;

  findByEmail(email: string) {
    return this.creatorRep.findOne({ where: { email: email } });
  }
  async create(createCreatorDto: CreateCreatorDto) {
    createCreatorDto.password = await this.saltPassword(
      createCreatorDto.password,
    );
    return this.creatorRep.save(createCreatorDto);
  }

  async changePassword(id: string, newPassword: string) {
    const creator = await this.findOne(id);
    const valid = await bcrypt.compare(newPassword, creator.password);
    if (!valid) {
      creator.password = await this.saltPassword(newPassword);
      return this.creatorRep.save(creator);
    } else {
      throw new HttpException('Password not available', HttpStatus.FORBIDDEN);
    }
  }

  findAll() {
    return `This action returns all creator`;
  }

  findOne(id: string) {
    return this.creatorRep.findOne(id);
  }

  update(id: string, updateCreatorDto: UpdateCreatorDto) {
    return `This action updates a #${id} creator`;
  }

  remove(id: string) {
    return `This action removes a #${id} creator`;
  }

  async saltPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }
}
