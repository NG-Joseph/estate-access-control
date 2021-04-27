import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';


import {} from 'otp-generator';

import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
//five imports below are for file upload handling
import { Reply, Request } from '../global/custom.interfaces';

import { randomBytes } from 'crypto';
import {
  
  VISIT_TOKEN_EXPIRATION,
  smtpTransportGmail,
  grantVisitMailOptionSettings,
} from 'src/global/app.settings';
import { SendMailOptions } from 'nodemailer';

import { Visitor } from 'src/visitors/entities/visitor.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

    @InjectRepository(Visitor) private visitorRepository: Repository<Visitor>,
  ) {}

  /*CREATE section*/

  /**
   *
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto, req: Request): Promise<User> {
    try {
      const newUser = this.userRepository.create(createUserDto);
      //hash the password in dto
      await bcrypt.hash(newUser.passwordHash, 10).then((hash: string) => {
        newUser.passwordHash = hash;
      });
      const user = await this.userRepository.save(newUser);

      return user;
    } catch (error) {
      if (error) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: `There was a problem with user creation: ${error.message}`,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async update(id: number, user: UpdateUserDto): Promise<UpdateResult> {
    try {
      const { passwordHash, ...userToSave } = user;
      return await this.userRepository.update(id, { ...userToSave });
    } catch (error) {
        if (error) {
            throw new HttpException(
              {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem with user creation: ${error.message}`,
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        }
      }

  /**
   *
   * @param user
   * No partial update allowed here. Saves the user object supplied
   */

  async delete(id: number): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem deleting user data: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** READ section
   */
  /**
   * You can set options e.g. fields, relations to be returned etc. See https://typeorm.io/#/find-options
   */


  async findAll(): Promise<[User[], number]> {
    try {
      return await this.userRepository.findAndCount();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem accessing users data: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOne(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem accessing user data: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<User> {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `There was a problem with getting user: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async grantVisitRequestToken(
    email: string = null,
    visitorId: number = null,
    req: Request,
  ) {
    /*Logic here ln 159-165: Assume visitor is null (does not exist),
     if the visitorId passed exists i.e is not null (!= null) (meaning there is an existing visitor entry with that Id),
     assign it to the visitor variable here, else check if email exists (find by email) and assign
    */
    try {
      let visitor: Visitor = null;
      if (visitorId != null) {
        visitor = await this.visitorRepository.findOne(visitorId); 
      } else {
        visitor = await this.visitorRepository.findOne({
          where: { emailAddress: email },
        });
      }
      if (visitor != null) {
        //Generate a random token for visitor
        randomBytes(256, async (error, buf) => {
          if (error) throw error; 
          const token = buf.toString('hex');

          //success. Continue with email containing reset message with token
          const firstName = visitor.firstName;

          visitor.visitToken = token; //assign token to visitor in the table column called visitToken
          //update visitorTokenExpirationDate column by adding expiration duration to current time
          visitor.visitorTokenExpirationDate = new Date(
            Date.now() + VISIT_TOKEN_EXPIRATION,
          );
          //save the updated visitor
          await this.visitorRepository.save(visitor);

          
          const otp = '9777738';
          const mailText = grantVisitMailOptionSettings.textTemplate.replace(
            '{url}',
            otp,
          ); //TODO: check how to replace multiple vars in textTemplate

          //mailOptions
          const mailOptions: SendMailOptions = {
            to: visitor.emailAddress,
            from: grantVisitMailOptionSettings.from,
            subject: grantVisitMailOptionSettings.subject,
            text: mailText,
          };

          //send mail
          smtpTransportGmail.sendMail(mailOptions, async (error: Error) => {

            if (error) console.log(error);
          });
        });
        return {
          notificationClass: 'is-info',
          notificationMessage: `If valid user, you will receive email shortly for email address confirmation`,
        };
      } else {
        //email address or user not found
        //log bad request here and still respond
        return {
          notificationClass: 'is-info',
          notificationMessage: `If valid user, you will receive email shortly for email addres confirmation`,
        };
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Problem sending email address confirmation: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
