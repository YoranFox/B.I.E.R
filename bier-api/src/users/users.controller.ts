import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { UserProfileDto } from './dto/response-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/roles.enum';
import { request } from 'express';

@ApiBearerAuth()
@ApiTags('UsersApi')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/self')
  getSelf(@Req() req: any) {
    return req.user.user;
  }

  @Patch('/self')
  updateSelf(@Req() req: any, @Body() UpdateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.user.id, UpdateUserDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() req: any): Promise<UserProfileDto> {
    return this.usersService.create(req.user.code, createUserDto);
  }

  @Get('/code/self')
  findAllSelf(@Req() req: any): Promise<UserProfileDto[]> {
    return this.usersService.findByCodeId(req.user.code.id);
  }

  @Get('/code/:codeId')
  findAllCode(@Param('codeId') codeId: string): Promise<UserProfileDto[]> {
    return this.usersService.findByCodeId(codeId);
  }

  @Get(':id')
  @UseInterceptors(new TransformInterceptor(UserProfileDto))
  findOne(@Param('id') id: string): Promise<UserProfileDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles([UserRole.CREATOR])
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles([UserRole.CREATOR])
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
