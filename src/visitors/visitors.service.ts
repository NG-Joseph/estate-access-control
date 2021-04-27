import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { Visitor } from './entities/visitor.entity';

@Injectable()

export class VisitorsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

    @InjectRepository(Visitor) private visitorsRepository: Repository<Visitor>,
  ) {}
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
