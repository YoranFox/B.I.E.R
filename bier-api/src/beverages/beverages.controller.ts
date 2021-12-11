import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BeveragesService } from './beverages.service';
import { CreateBeverageDto } from './dto/create-beverage.dto';
import { UpdateBeverageDto } from './dto/update-beverage.dto';

@ApiBearerAuth()
@ApiTags('BeveragesApi')
@Controller('beverages')
export class BeveragesController {
  constructor(private readonly beveragesService: BeveragesService) {}

  @Get('creator/self')
  findByCurrentCreator(@Req() req: any) {
    return this.beveragesService.findByCreator(req.user.creator.id);
  }

  @Get('creator/:creatorId')
  findByCreator(@Param('creatorId') creatorId: string) {
    return this.beveragesService.findByCreator(creatorId);
  }

  @Get('code/self')
  findByCurrentCode(@Req() req: any) {
    return this.beveragesService.findByCode(req.user.creator.id);
  }

  @Get('code/:codeId')
  findByCode(@Param('creatorId') creatorId: string) {
    return this.beveragesService.findByCode(creatorId);
  }

  @Post()
  create(@Req() req: any, @Body() createBeverageDto: CreateBeverageDto) {
    createBeverageDto.creator = req.user.creator;
    return this.beveragesService.create(createBeverageDto);
  }

  @Get()
  findAll() {
    return this.beveragesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.beveragesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBeverageDto: UpdateBeverageDto) {
    return this.beveragesService.update(id, updateBeverageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.beveragesService.remove(id);
  }
}
