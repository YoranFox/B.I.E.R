import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth/auth.service';
import { Code } from 'src/codes/entities/code.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  @InjectRepository(User)
  private userRep: Repository<User>;

  async create(code: Code, createUserDto: CreateUserDto): Promise<User> {
    const userWithName = await this.userRep.find(
      {
        where: {name: createUserDto.name}
      })

    if(userWithName.length > 0) {
      throw new HttpException('User name already exists', HttpStatus.CONFLICT)
    }
    return this.userRep.save({...createUserDto, codes: [code]});
  }

  findAll() {
    return this.userRep.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRep.findOne(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.userRep.findOne(id);
    return this.userRep.save({...user, ...updateUserDto});
  }

  async remove(id: string): Promise<User> {
    const user = await this.userRep.findOne(id);
    return this.userRep.remove(user);
  }

  findByCodeId(codeId: string): Promise<User[]> {
    // return this.userRep.find({relations: ['codes'], where: { codes: { id: codeId }}})

    return this.userRep.createQueryBuilder("user").innerJoin('user.codes', 'code').where('code.id = :codeId', {codeId: codeId}).getMany();
  }
}