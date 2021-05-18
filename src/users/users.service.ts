import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {} from 'otp-generator';

import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

import { Request } from '../global/custom.interfaces';

import {
  VISIT_OTP_EXPIRATION,
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
      return await this.userRepository.update(id, user);
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

  async grantVisitRequestOtp(
    visitorEmail: string = null,
    req: Request,
    userId: number = null,
    userPassword: string,
  ) {
    /*Logic here ln 159-165: Assume visitor is null (does not exist),
     if the visitorId passed exists i.e is not null (!= null) (meaning there is an existing visitor entry with that Id),
     assign it to the visitor variable here, else check if email exists (find by email) and assign
    */
    try {
      let visitor: Visitor = null;
      let user: User = null;
      if (visitorEmail != null || userId != null) {
        console.log('They exist');
        visitor = await this.visitorRepository.findOne({
          where: { emailAddress: visitorEmail },
        });
        user = await this.userRepository.findOne(userId);
        console.log(user);
        console.log(visitor);
      }

      if (visitor != null || user != null) {
        console.log('they exist');

        const isPasswordCorrect = await bcrypt.compare(
          userPassword,
          user.passwordHash,
        );

        //console.log(isPasswordCorrect)
        //if (isPasswordCorrect == false)
        if (!isPasswordCorrect) {
          user = null;
          console.log('Incorrect Password')

          return {
            
            response: 'Wrong password entered for user',
          };
        }
        console.log('Password correct... proceeding')

        const VisitorFirstName = visitor.firstName;
        const visitorLastName = visitor.lastName;
        const userFirstName = user.firstName;
        const userLastName = user.lastName;
        const otpGenerator = require('generate-otp'); // Package isn't ES6 compliant, import as a variable (the old way)
        const otp = otpGenerator.generate(6);
        visitor.visitOtp = otp;

        visitor.visitorOtpExpirationDate = new Date(
          Date.now() + VISIT_OTP_EXPIRATION,
        );
        //save the updated visitor
        await this.visitorRepository.save(visitor);

        const mailText = grantVisitMailOptionSettings.textTemplate.replace(
          '{otp}',
          otp,
        ); //TODO: check how to replace multiple vars in text, .replace() does not seem to take an object for multiple args

        //Workaround: Procedurual replacement of text
        //Better *future* workaround: Shorten code with regex

        const mailText2 = mailText.replace(
          '{visitorFirstName}',
          VisitorFirstName,
        );

        const mailText3 = mailText2.replace(
          '{visitorLastName}',
          visitorLastName,
        );

        const mailText4 = mailText3.replace('{userFirstName}', userFirstName);

        const subject = grantVisitMailOptionSettings.subject.replace(
          '{userFirstName}',
          userFirstName,
        );
        const subject2 = subject.replace('{userLastName}', userLastName);

        //mailOptions
        const mailOptions: SendMailOptions = {
          to: visitor.emailAddress,
          from: grantVisitMailOptionSettings.from,
          subject: subject2,
          text: mailText4,
        };

        //send mail
        smtpTransportGmail.sendMail(mailOptions, async (error: Error) => {
          if (error) console.log(error);
        });
        return {
          response: `Processing... If user is valid you would recieve an email soon`,
        };
      } else {
        //email address or user not found
        //log bad request here and still respond
        return {
          response: `Processing... If user is valid you would recieve an email soon`,
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Problem sending invite: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      //TODO: Add Visit History Feature by appending date.now() each time an invite-request is made to a visitHistory 'simple-json' column.
    }
  }
}
