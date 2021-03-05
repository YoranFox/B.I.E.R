import { Controller, Get, Post, Body, Put, Param, Delete, HttpException } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LoginPasswordDto } from './dto/login-password.dto';
import { PasswordRO } from './password.interface';
import { LoginInfo } from './dto/login-info.dto';
const bcrypt = require('bcrypt');

@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Post()
  create(@Body() createPasswordDto: CreatePasswordDto) {
    return this.passwordsService.create(createPasswordDto);
  }

  @Get()
  findAll() {
    return this.passwordsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.passwordsService.findById(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.passwordsService.update(+id, updatePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordsService.remove(+id);
  }

  @Post('login')
  async login(@Body() loginPasswordDto: LoginPasswordDto): Promise<LoginInfo> {

    
    const errors = {Password: ' not found'};
    const password = loginPasswordDto.password;
    const passwords = await this.passwordsService.findAll();
    let login;
    for(const pass of passwords){
      const result = await bcrypt.compare(password, pass.hashedPassword);
      if(result){
        login = pass;
        console.log('login succesfull');
        
      }
    }
    
    if(!login) throw new HttpException({errors}, 401);

    const token = await this.passwordsService.generateJWT(login);
    const {role} = login;
    const loginInfo = {role, token};
    return loginInfo;

  }
}
