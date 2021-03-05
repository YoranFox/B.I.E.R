import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Password } from './entities/password.entity';
import { SECRET } from '../../../config';
import { LoginPasswordDto } from './dto/login-password.dto';
const jwt = require('jsonwebtoken');


@Injectable()
export class PasswordsService {

  constructor(
    @InjectRepository(Password)
    private passwordsRepository: Repository<Password>,
  ) {}


  async create(createPasswordDto: CreatePasswordDto) {
    const {password, role} = createPasswordDto;

    let newPassword = new Password()
    console.log(newPassword);
    
    newPassword.hashedPassword = password;
    newPassword.role = role;
    const savedPassword = await this.passwordsRepository.save(newPassword);
    console.log(savedPassword);
    
    return savedPassword;
  }

  findAll() {
    return this.passwordsRepository.find();
  }

  async findOne({password}: LoginPasswordDto) {


    return this.passwordsRepository.findOne()
  }

  findById(id: number) {
    return this.passwordsRepository.findOne(id);
  }

  update(id: number, updatePasswordDto: UpdatePasswordDto) {
    return `This action updates a #${id} password`;
  }

  remove(id: number) {
    return this.passwordsRepository.delete(id);
  }

  public generateJWT(password) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: password.id,
      role: password.role,
      exp: exp.getTime() / 1000,
    }, process.env.JWT_PRIVATE_KEY);
  };
}
