import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HomesService } from './homes.service';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';

@Controller('homes')
export class HomesController {
  constructor(private readonly homesService: HomesService) {}

  @Post()
  create(@Body() createHomeDto: CreateHomeDto) {
    return this.homesService.create(createHomeDto);
  }

  @Get()
  findAll() {
    return this.homesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeDto: UpdateHomeDto) {
    return this.homesService.update(+id, updateHomeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homesService.remove(+id);
  }
}
