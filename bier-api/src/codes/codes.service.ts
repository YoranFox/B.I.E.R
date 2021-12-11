import { Injectable } from '@nestjs/common';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { MoreThan, Repository } from 'typeorm';
import { Code } from './entities/code.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CodesService {
  @InjectRepository(Code)
  private codeRep: Repository<Code>;

  /* CRUD operations */

  async create(createCodeDto: CreateCodeDto) {
    console.log(createCodeDto);

    return this.codeRep.save(createCodeDto);
  }

  findAll(): Promise<Code[]> {
    return this.codeRep.find();
  }

  findOne(id: string): Promise<Code> {
    return this.codeRep.findOne(id);
  }

  update(id: string, updateCodeDto: UpdateCodeDto) {
    return this.codeRep.save({ id, ...updateCodeDto });
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

    if (!validCodes || validCodes.length === 0) {
      return null;
    }

    const result = validCodes.find((c) => c.code === code);

    return result;
  }

  async findByCreator(creatorId: string): Promise<Code[]> {
    console.log(creatorId);

    return this.codeRep.find({
      where: {
        creator: { id: creatorId },
      },
    });
  }

  async findValidCodes(): Promise<Code[]> {
    return this.codeRep.find({
      where: [
        {
          active: true,
        },
        {
          active: true,
        },
      ],
    });
  }
}
