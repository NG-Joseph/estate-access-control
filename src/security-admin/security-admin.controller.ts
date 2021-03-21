import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SecurityAdminService } from './security-admin.service';
import { CreateSecurityAdminDto } from './dto/create-security-admin.dto';
import { UpdateSecurityAdminDto } from './dto/update-security-admin.dto';

@Controller('security-admin')
export class SecurityAdminController {
  constructor(private readonly securityAdminService: SecurityAdminService) {}

  @Post()
  create(@Body() createSecurityAdminDto: CreateSecurityAdminDto) {
    return this.securityAdminService.create(createSecurityAdminDto);
  }

  @Get()
  findAll() {
    return this.securityAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.securityAdminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSecurityAdminDto: UpdateSecurityAdminDto) {
    return this.securityAdminService.update(+id, updateSecurityAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.securityAdminService.remove(+id);
  }
}
