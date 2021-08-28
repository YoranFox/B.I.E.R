import { Injectable } from '@nestjs/common';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import * as bcrypt from 'bcrypt';
import { MoreThan, Repository } from 'typeorm';
import { Code } from './entities/code.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CodesService {

  @InjectRepository(Code)
  private codeRep: Repository<Code>;

  /* CRUD operations */
 
  async create(createCodeDto: CreateCodeDto) {
    const saltOrRounds = 10;
    const hashedCode = await bcrypt.hash(createCodeDto.code, saltOrRounds);
    createCodeDto.code = hashedCode;
    return this.codeRep.save(createCodeDto);
  }

  findAll(): Promise<Code[]> {
    return this.codeRep.find();
  }

  findOne(id: string): Promise<Code> {
    return this.codeRep.findOne(id);
  }

  update(id: string, updateCodeDto: UpdateCodeDto) {
    const code = this.codeRep.findOne(id);
    return this.codeRep.save({...code, ...updateCodeDto});
  }

  async remove(id: string): Promise<Code> {
    const code = await this.findOne(id);
    return this.codeRep.remove(code);
  }


  /* other */

  /**
   * @author Yoran
   * @param code code to check if exists in valid codes
   * @returns Code object if code is valid else null
   */
  async validateCode(code: string): Promise<Code> {
    const validCodes = await this.findValidCodes();

    const results = await Promise.all(validCodes.map(async c => await bcrypt.compare(code, c.code)));

    const index = results.findIndex(result => result);
    return validCodes[index];
  }

  async findValidCodes(): Promise<Code[]> {
    return this.codeRep.find({where: {
      active: true,
      endDate:  MoreThan(new Date())
    }})
  }
}
