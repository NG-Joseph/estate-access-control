import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { Visitor } from './entities/visitor.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()

export class VisitorsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

    @InjectRepository(Visitor) private visitorsRepository: Repository<Visitor>,
  ) {}
// Experimental: Using NestJS's 'Cron' API to check for expired OTP every 30 seconds and delete visitor if expired. NOT FULLY TESTED.
  @Cron(CronExpression.EVERY_30_SECONDS)
    /**
     * Deletes Visitor entry if OTP is expired. What is the best approach? To delete visitor entirely (could be bad for audit purposes),
     * or to store visitor data ( if this then figure out how to delete a field from a record, rather than the entire record)
     */
    async deleteExpiredOtp(): Promise<void> {
      try {
        const currentDate: Date = new Date();
        const nullValue = null
        await this.visitorsRepository
        
        .createQueryBuilder('visitor')
        //.select('visitor.visitOtp')
        .update('visitor')
        .set({visitOtp: null})
        .where("visitor.visitorOtpExpirationDate <= :currentDate", {currentDate})
        .execute()

        
        
        
        console.log('Cleared Obsolete OTPs')
      } catch (error) {
        console.log(error)
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: `Could not delete OTP record from database: ${error.message}`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  

  async create(createVisitorDto: CreateVisitorDto) {
    const newVisitor: Visitor = this.visitorsRepository.create(createVisitorDto)
    return this.visitorsRepository.save(newVisitor);
    //return 'This action adds a new user';
  }

 async findAll() {
    return await this.visitorsRepository.find()
    //return `This action returns all visitors`;
  }

  async findOne(id: number) {
    return this.visitorsRepository.findOne(id);
  }

  async update(id: number, updateVisitorDto: UpdateVisitorDto) {
    return await this.visitorsRepository.update(id, updateVisitorDto);
  }

  async remove(id: number) {
    return await this.visitorsRepository.delete(id);
  }
}
