import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';

@Controller('resident')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  @Post()
  create(@Body() createResidentDto: CreateResidentDto) {
    return this.residentService.create(createResidentDto);
  }

  @Get()
  findAll() {
    return this.residentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.residentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResidentDto: UpdateResidentDto) {
    return this.residentService.update(+id, updateResidentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.residentService.remove(+id);
  }
}
