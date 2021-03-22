import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SecurityAdminsService } from './security-admins.service';
import { CreateSecurityAdminDto } from './dto/create-security-admin.dto';
import { UpdateSecurityAdminDto } from './dto/update-security-admin.dto';

@Controller('security-admins')
export class SecurityAdminsController {
  constructor(private readonly securityAdminsService: SecurityAdminsService) {}

  @Post()
  create(@Body() createSecurityAdminDto: CreateSecurityAdminDto) {
    return this.securityAdminsService.create(createSecurityAdminDto);
  }

  @Get()
  findAll() {
    return this.securityAdminsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.securityAdminsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSecurityAdminDto: UpdateSecurityAdminDto) {
    return this.securityAdminsService.update(+id, updateSecurityAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.securityAdminsService.remove(+id);
  }
}
