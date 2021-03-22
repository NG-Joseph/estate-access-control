import { Injectable } from '@nestjs/common';
import { CreateSecurityAdminDto } from './dto/create-security-admin.dto';
import { UpdateSecurityAdminDto } from './dto/update-security-admin.dto';

@Injectable()
export class SecurityAdminsService {
  create(createSecurityAdminDto: CreateSecurityAdminDto) {
    return 'This action adds a new securityAdmin';
  }

  findAll() {
    return `This action returns all securityAdmins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} securityAdmin`;
  }

  update(id: number, updateSecurityAdminDto: UpdateSecurityAdminDto) {
    return `This action updates a #${id} securityAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} securityAdmin`;
  }
}
