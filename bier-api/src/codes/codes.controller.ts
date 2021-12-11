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
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/roles.enum';
import { CodesService } from './codes.service';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';

@ApiBearerAuth()
@ApiTags('CodesApi')
@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Roles([UserRole.CREATOR])
  @Post()
  create(@Body() createCodeDto: CreateCodeDto, @Req() req: any) {
    createCodeDto.creator = req.user.creator;
    return this.codesService.create(createCodeDto);
  }

  @Get()
  findAll() {
    return this.codesService.findAll();
  }

  @Get('creator/self')
  findByCurrentCreator(@Req() req: any) {
    return this.codesService.findByCreator(req.user.creator.id);
  }

  @Roles([UserRole.ADMIN])
  @Get('creator/:creatorId')
  findByCreator(@Param('creatorId') creatorId: string) {
    return this.codesService.findByCreator(creatorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCodeDto: UpdateCodeDto) {
    return this.codesService.update(id, updateCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.codesService.remove(id);
  }
}
