import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/roles.enum';
import { CreatorService } from './creator.service';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';

@ApiBearerAuth()
@ApiTags('CreatorApi')
@Controller('creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get('/self')
  self(@Req() req: any) {
    return req.user?.creator;
  }

  @Patch('/self/password/:password')
  updatePassword(@Param('password') password: string, @Req() req: any) {
    return this.creatorService.changePassword(req.user.creator.id, password);
  }

  @Public()
  @Post()
  create(@Body() createCreatorDto: CreateCreatorDto) {
    return this.creatorService.create(createCreatorDto);
  }

  @Roles([UserRole.ADMIN])
  @Get()
  findAll() {
    return this.creatorService.findAll();
  }

  @Roles([UserRole.ADMIN])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creatorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreatorDto: UpdateCreatorDto) {
    return this.creatorService.update(id, updateCreatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creatorService.remove(id);
  }
}
