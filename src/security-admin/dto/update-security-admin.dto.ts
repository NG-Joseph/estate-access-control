import { PartialType } from '@nestjs/mapped-types';
import { CreateSecurityAdminDto } from './create-security-admin.dto';

export class UpdateSecurityAdminDto extends PartialType(CreateSecurityAdminDto) {}
