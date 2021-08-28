import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/roles.enum';
import { CodesService } from './codes.service';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';

@ApiBearerAuth()
@Roles([UserRole.ADMIN])
@ApiTags('Codes')
@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Post()
  create(@Body() createCodeDto: CreateCodeDto) {
    return this.codesService.create(createCodeDto);
  }

  @Get()
  findAll() {
    return this.codesService.findAll();
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
