import {
  Body,
  Controller,
  Delete,
  Put,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  Query,
} from '@nestjs/common';

import { Request, Reply, } from 'src/global/custom.interfaces';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InviteDto } from 'src/global/invite-dto';


@Controller('users')
export class UsersController {
  /**
   *
   * @param usersService
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Post a single user
   * @param createUserDto
   * @param req
   */

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
  ): Promise<User> {
    return this.usersService.create(createUserDto, req);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Get('invite')
  async inviteForm(@Req() req:Request, @Res() reply: Reply, @Query() query:string)
  {
    const next = query['next']
    reply.view('invite-visitor.html',{
      title: 'Invite a Visitor',
      next: next ? 'users/failure' : '/users/success',
      inviteUrl: 'users/invite',
      successUrl: 'users/success',
      failureUrl: 'users/failed',
     
      
    }
    )
  }

  @Post('invite-request')
   async grantVisitRequestOtp(@Body() invitationDetails: InviteDto, /*@Res()reply:Reply,*/ @Req() req:Request){
    
     
     
     return await this.usersService.grantVisitRequestOtp(invitationDetails.visitorEmail,req,17, invitationDetails.userPassword);
  } 

  @Get('invite-request/success')
  async successPage(@Res() reply:Reply){
    reply.view('invite-success.html')
  }


   @Get()
   findAll() {
     return this.usersService.findAll();
   }

// find by id

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }


}
