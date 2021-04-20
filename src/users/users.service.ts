import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/global/error.codes';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { Role } from 'src/roles/entities/role.entity';
import {} from 'otp-generator';

import { Connection, DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
//five imports below are for file upload handling
import {  Reply, Request } from '../global/custom.interfaces';
import {Gender} from '../global/app.enum'
import util from 'util'; //for uploaded file streaming to file
import { pipeline } from 'stream';//also for uploaded file streaming to file
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { API_VERSION, AUTO_SEND_CONFIRM_EMAIL, confirmEmailMailOptionSettings, EMAIL_VERIFICATION_EXPIRATION, VISIT_TOKEN_EXPIRATION, PHOTO_FILE_SIZE_LIMIT, PROTOCOL, resetPasswordMailOptionSettings, smtpTransport, smtpTransportGmail,  USE_API_VERSION_IN_URL, grantVisitMailOptionSettings } from 'src/global/app.settings';
import { SendMailOptions } from 'nodemailer';


import * as randomstring from 'randomstring';
import { Visitor } from 'src/visitors/entities/visitor.entity';
import { SecurityAdmin } from 'src/security-admins/entities/security-admin.entity';
import { Resident } from 'src/residents/entities/resident.entity';
import { Home } from 'src/homes/entities/home.entity';
import { GenericBulmaNotificationResponseDto } from 'src/global/custom.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        @InjectRepository(Visitor) private visitorRepository: Repository<Visitor>,
        @InjectRepository(SecurityAdmin) private securityAdminRepository: Repository<SecurityAdmin>,
        @InjectRepository(Resident) private residentRepository: Repository<Resident>,
        @InjectRepository(Home) private homeRepository: Repository<Home>,


    ) { }

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
                newUser.passwordHash = hash
            })
            const user = await this.userRepository.save(newUser);
            //call confirmEmailRequest() without await.
            if (AUTO_SEND_CONFIRM_EMAIL) this.confirmEmailRequest(user.emailAddress, null,  req)
            return user;
        } catch (error) {
            if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `There was a problem with user creation: : ${error.message}`,
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `There was a problem with user creation: ${error.message}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    



    //insert using query builder - more efficient than save. Can be used for single or bulk save. See https://github.com/typeorm/typeorm/blob/master/docs/insert-query-builder.md
    async insertUsers(users: CreateUserDto[], req: Request): Promise<InsertResult> {//users is an array of objects
        try {
            //iteratively hash the passwords
            let usersWithHashedPasswords = [];
            users.map(async (user) => {
                //hash the password in dto
                await bcrypt.hash(user.passwordHash, 10).then((hash: string) => {
                    user.passwordHash = hash;
                    usersWithHashedPasswords.push(user);
                })
            })
            const insertResult = await this.userRepository.createQueryBuilder()
                .insert()
                .into(User)
                .values(usersWithHashedPasswords)
                .execute();

            //iteratively call confirmEmailRequest() for users without await.
            if (AUTO_SEND_CONFIRM_EMAIL) {
                users.map((user) => {
                    this.confirmEmailRequest(user.emailAddress, null, req)
                })
            }

            return insertResult;

        } catch (error) {
            if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `There was a problem with user(s) insertion: : ${error.message}`,
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `There was a problem with user(s) insertion: ${error.message}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    }
    //Below is not necessary. It is only for the purpose of explaining transactions.
    /**If the query to be executed is expected to be involved in a transaction 
     * at the controller level for example, the function here should be used to return the raw sql instead
     * of an execute(), getOne() or getMany() call that will return a Promise.
     * The insertUserSQL below returns SQL string
     */
    async insertUserSQL(user: CreateUserDto): Promise<string> {
        //hash the password in dto
        await bcrypt.hash(user.passwordHash, 10).then((hash: string) => {
            user.passwordHash = hash
        })
        return this.userRepository.createQueryBuilder()
            .insert()
            .into(User)
            .values(user)
            .getSql();
    }

    /*UPDATE section*/

    async update(id: number, user: UpdateUserDto): Promise<UpdateResult> {
        try {
            /*
            if (user.passwordHash != '') { //new password was sent. Not ideal though. There should be a different process for updating password
                await bcrypt.hash(user.passwordHash, 10).then((hash: string) => {
                    user.passwordHash = hash
                })
            }*/
            //exclude user password, if any. Password should be edited either by user setPassword or admin resetPassword
            const { passwordHash, ...userToSave } = user
            return await this.userRepository.update(id, { ...userToSave })
        } catch (error) {
            if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `There was a problem updating user data: : ${error.message}`,
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `There was a problem updating user data: ${error.message}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    /**
     * 
     * @param user 
     * No partial update allowed here. Saves the user object supplied
     */
    async save(user: User): Promise<User> {

        try {
            /*
            if (user.passwordHash && user.passwordHash != '') { //new password was sent. Not ideal though. There should be a different process for updating password
                await bcrypt.hash(user.passwordHash, 10).then((hash: string) => {
                    user.passwordHash = hash
                })
            }*/
            //exclude user password if any. Password should be edited either by user setPassword or admin resetPassword
            const { passwordHash, ...userToSave } = user
            return await this.userRepository.save({ ...userToSave })
        } catch (error) {
            if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `There was a problem updating user: : ${error.message}`,
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `There was a problem updating user: ${error.message}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    //Let's also do partial update using query builder. Also more efficient
    async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        try {
            /*
            if (updateUserDto.passwordHash != '') { //new password was sent. Not ideal though. There should be a different process for updating password
                await bcrypt.hash(updateUserDto.passwordHash, 10).then((hash: string) => {
                    updateUserDto.passwordHash = hash
                })
            }*/
            //exclude user password, if any. Password should be edited either by user setPassword or admin resetPassword
            const { passwordHash, ...userToSave } = updateUserDto
            return await this.userRepository.createQueryBuilder()
                .update(User)
                .set({ ...userToSave })
                .where("id = :id", { id: userId })
                .execute();
        } catch (error) {
            if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `There was a problem updating user: : ${error.message}`,
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `There was a problem updating user: ${error.message}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


    /* DELETE section */

    async delete(id: number): Promise<void> {
        try {
            await this.userRepository.delete(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem deleting user data: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //query builder equivalent of delete shown above
    async deleteUser(userId: number): Promise<DeleteResult> {
        try {
            return await this.userRepository.createQueryBuilder()
                .delete()
                .from(User)
                .where("id = :id", { id: userId })
                .execute();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem deleting user data: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 
     * @param user 
     * Remove the User specifed. Returns User removed.
     */
    async remove(user: User): Promise<User> {
        try {
            return await this.userRepository.remove(user);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem deleting user data: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /** READ section
     */
    /**
     * You can set options e.g. fields, relations to be returned etc. See https://typeorm.io/#/find-options
     */
    async findAllWithOptions(findOptions: string): Promise<[User[], number]> {
        try {
            return await this.userRepository.findAndCount(JSON.parse(findOptions));
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem accessing users data: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<[User[], number]> {
        try {
            return await this.userRepository.findAndCount();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem accessing users data: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 
     * @param id 
     * find one by id
     */
    async findOne(id: number): Promise<User> {
        try {
            return await this.userRepository.findOne(id);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem accessing user data: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    

    /*Let's work on functions to set/add and unset/remove relations. set/unset applies to x-to-one and add/remove applies to x-to-many */
    //1. Roles
    async createAndAddRole(userId: number, createRoleDto: CreateRoleDto): Promise<void> {
        try {
            
                const newRole = this.roleRepository.create(createRoleDto);
                const role = await this.userRepository.save(newRole);
                await this.userRepository.createQueryBuilder()
                    .relation(User, "roles")
                    .of(userId)
                    .add(role);//using add because of to-many
            
        } catch (error) {
            if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `There was a problem with adding role to user: ${error.message}`,
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `There was a problem with adding role to user: ${error.message}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async addRoleById(userId: number, roleId: number): Promise<void> {
        try {
            return await this.userRepository.createQueryBuilder()
                .relation(User, "roles")
                .of(userId)
                .add(roleId)
        } catch (error) {
            if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `There was a problem adding role to user: ${error.message}`,
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `There was a problem with adding role to user: ${error.message}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async addRolesById(userId: number, roleIds: number[]): Promise<Role[]> {
        try {
            await this.userRepository.createQueryBuilder()
                .relation(User, "roles")
                .of(userId)
                .add(roleIds)
            //return the user roles modified for redisplay
            const user = await this.userRepository.findOne(userId, { relations: ['roles'] });
            return user.roles;
        } catch (error) {
            if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `There was a problem adding roles to user: ${error.message}`,
                }, HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `There was a problem with adding roles to user: ${error.message}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async removeRoleById(userId: number, roleId: number): Promise<Role[]> {
        try {
            await this.userRepository.createQueryBuilder()
                .relation(User, "roles")
                .of(userId)
                .remove(roleId)
            //return the user roles modified for redisplay
            const user = await this.userRepository.findOne(userId, { relations: ['roles'] });
            return user.roles;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem removing role from user: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async removeRolesById(userId: number, roleIds: number[]): Promise<Role[]> {
        try {
            await this.userRepository.createQueryBuilder()
                .relation(User, "roles")
                .of(userId)
                .remove(roleIds)
            //return the user roles modified for redisplay
            const user = await this.userRepository.findOne(userId, { relations: ['roles'] });
            return user.roles;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem removing roles from user: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }








    /*Some user perculiarities*/

    async setUserPassword(userId: number, password: string): Promise<UpdateResult> {
        try {
            await bcrypt.hash(password, 10).then((hash: string) => {
                password = hash
            })
            return await this.userRepository.createQueryBuilder()
                .update()
                .set({ passwordHash: password })
                .where("id = :userId", { userId })
                .execute();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem updating user password: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async setUserPhoto(userId: number, req: Request, reply: Reply): Promise<any> {
        /*This is a special case. 
        References: 
        https://github.com/fastify/fastify-multipart; https://medium.com/@427anuragsharma/upload-files-using-multipart-with-fastify-and-nestjs-3f74aafef331,
        

        For ideas on send files, see https://expressjs.com/en/api.html#res.sendFile, https://stackoverflow.com/questions/51045980/how-to-serve-assets-from-nest-js-and-add-middleware-to-detect-image-request, https://github.com/fastify/fastify/issues/163#issuecomment-323070670, 
        Steps:
        1. npm i fastify-multipart
        2. Assuming that uploads will be to /uploads folder under project directory, create the folder.
        For multitenant implementations, we will read this from connectionResourse.rootFileSystem
        3. For user photos, we will assume the path photos/filename. We will use uuid to generate unique filename and store in photo fieldThe filename will be stored in photo field
        4. We will store the mime type for file in user field photoFileEncoding, for setting content type when sending file
        5. Register the installed fastify-multipart in main.ts
        */
        //Check request is multipart
        if (!req.isMultipart()) {
            reply.send(
                new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `There was a problem uploading photo. No photo was sent`,
                }, HttpStatus.BAD_REQUEST)
            )
        }
        //It is multipart, so proceed to get the file
        try {
            const options = { limits: { fileSize: PHOTO_FILE_SIZE_LIMIT } }; //limit options may be passed. Unit is bytes. See main.ts for comments on other options
            const data = await req.file(options);
            //save to file
            //We will use uuid (see https://github.com/uuidjs/uuid) to generate filename instead of using data.filename
            //note: npm install uuid @types/uuid
            let { fileName } = await this.getPhotoInfo(userId);
            if (fileName == null) fileName = uuidv4(); //no previous photo, generate new fileName
            //time to write
            const pump = util.promisify(pipeline)
            await pump(data.file, fs.createWriteStream(`uploads/photos/${fileName}`))//beware of filesystem permissions

            //save the fileName to photo and mimetype to user photoMimeType field
            const updateResult = await this.userRepository.createQueryBuilder()
                .update(User)
                .set({ photo: fileName, photoMimeType: data.mimetype })
                .where("id = :userId", { userId })
                .execute();

            reply.send(updateResult);
        } catch (error) {
            //const fastify = require('fastify');//Below only works with this.Hence this weird entry here
            /*
            if (error instanceof fastify.multipartErrors.FilesLimitError) {
                reply.send(new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `There was a problem uploading photo. Keep upload to size limit of ${PHOTO_FILE_SIZE_LIMIT} bytes`,
                }, HttpStatus.BAD_REQUEST))
                */
            //} else {
            reply.send(
                new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: `There was a problem uploading photo: ${error.message}`,
                }, HttpStatus.INTERNAL_SERVER_ERROR)
            )
            //}
        }
    }

    /**
     * Get information about user photo
     * @param userId 
     */
    async getPhotoInfo(userId: number): Promise<{ fileName: string, mimeType: string }> {
        try {
            /* Below is not working. .select has a problem with case sensitivity
            return await this.userRepository.createQueryBuilder("user")
                .select(["user.photo AS fileName", "user.photoMimeType AS mimeType"])
                .where("id = :userId", { userId })
                .cache(1000) //1sec by default. You can change the value
                .execute();
                */
            const user: User = await this.userRepository.findOne(userId)
            return { fileName: user.photo, mimeType: user.photoMimeType }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem with getting user photo info: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async getUserPhoto(userId: number, reply: Reply) {
        const photoInfo = await this.getPhotoInfo(userId);
        let { fileName, mimeType } = photoInfo;
        //if fileName is not found, it means that there was no previous upload. Use generic avatar
        if (fileName == null || undefined) {

            fileName = "randomphoto.png";//make sure that it exists
            mimeType = "image/png";
        }
        const filePath = `uploads/photos/${fileName}`;
        //read the file as stream and send out
        try {
            const stream = fs.createReadStream(filePath)
            reply.type(mimeType).send(stream);
        } catch (error) {
            reply.send(new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem with getting user photo info: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    async findByPrimaryEmailVerificationToken(primaryEmailVerificationToken: string): Promise<User> {
        try {
            return await this.userRepository.createQueryBuilder("user")
                .where("user.primaryEmailVerificationToken = :primaryEmailVerificationToken", { primaryEmailVerificationToken })
                .getOne();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem with getting user: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    async findById(id: number): Promise<User> {
        try {
            return await this.userRepository.createQueryBuilder("user")
                .addSelect("user.refreshTokenHash")
                .leftJoinAndSelect("user.roles", "roles")
                .where("user.id = :id", { id })
                .getOne();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem with getting user: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }





    /**
     * This service is for handling password reset requests.
     * In principle, it should be called via the user controller endpoint reset-password-request, from the login page under auth module
     * The login page should handle the notification response as well, via ajax, just like reset-password handles its notification response via ajax
     * It uses randomBytes from crypto module to generate a unique token that will be sent to the user in 
     * a URL, by email. The user has to click on that URL with the right token, to be allowed to change the password
     * For sending emails, nodemailer installation (npm install nodemailer @types/nodemailer) is required.
     * 
     * @param email 
     */
    
   


    /**
     * 
     * @param email This may be sent if called after user has just been added in usersService
     * @param userId This may be sent from controller
     * @param primary 
     * @param backup 
     */ 

    async confirmEmailRequest(email: string = null, userId: number = null, req: Request) {
        try {
            let user: User = null;
            if (userId != null) {
                user = await this.userRepository.findOne(userId);
            } else {
                user =  await this.userRepository.findOne({ where: { emailAddress: email } }) 
            }
            if (user != null) {
                //generate the token (for primary or backup). See resetPasswordRequest above for ideas
                randomBytes(256, async (error, buf) => {
                    if (error)
                        throw error; //strange. the catch part below will handle it
                    const token = buf.toString('hex');

                    //success. Continue with email containing reset message with token
                     user.primaryEmailVerificationToken = token 
                    user.emailVerificationTokenExpiration = new Date(Date.now() + EMAIL_VERIFICATION_EXPIRATION);
                    //save the updated user
                    await this.userRepository.save(user);

                    //construct and send email using nodemailer
                    const globalPrefixUrl = USE_API_VERSION_IN_URL ? `/${API_VERSION}` : '';
                    const url =  `${req.protocol || PROTOCOL}://${req.hostname}${globalPrefixUrl}/users/confirm-primary-email/${token}` 
                    const mailText = confirmEmailMailOptionSettings.textTemplate.replace('{url}', url);

                    //mailOptions
                    const mailOptions: SendMailOptions = {
                        to: user.emailAddress,
                        from: confirmEmailMailOptionSettings.from,
                        subject: confirmEmailMailOptionSettings.subject,
                        text: mailText,
                    };

                    //send mail
                    smtpTransportGmail.sendMail(mailOptions, async (error: Error) => {
                        //if (error)
                        //    throw error; //throw error that will be caught at the end?
                        if (error)
                            console.log(error)
                    });
                });
                return {
                    notificationClass: "is-info",
                    notificationMessage: `If valid user, you will receive email shortly for email address confirmation`
                };
            } else {//email address or user not found
                //log bad request here and still respond
                return {
                    notificationClass: "is-info",
                    notificationMessage: `If valid user, you will receive email shortly for email addres confirmation`
                };
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `Problem sending email address confirmation: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async grantVisitRequestToken(email: string = null, visitorId: number = null, req: Request) {
        try {
            let visitor: Visitor = null;
            if (visitorId != null) {
                visitor = await this.visitorRepository.findOne(visitorId);
            } else {
                visitor =  await this.visitorRepository.findOne({ where: { emailAddress: email } }) 
            }
            if (visitor != null) {
                //generate the token (for primary or backup). See resetPasswordRequest above for ideas
                randomBytes(256, async (error, buf) => {
                    if (error)
                        throw error; //strange. the catch part below will handle it
                    const token = buf.toString('hex');

                    //success. Continue with email containing reset message with token
                     visitor.visitToken = token 
                    visitor.visitorTokenExpirationDate = new Date(Date.now() + VISIT_TOKEN_EXPIRATION);
                    //save the updated visitor
                    await this.userRepository.save(visitor);

                    //construct and send email using nodemailer
                    const otp = '9777738'
                    const mailText = grantVisitMailOptionSettings.textTemplate.replace('{url}', otp);

                    //mailOptions
                    const mailOptions: SendMailOptions = {
                        to: visitor.emailAddress,
                        from: confirmEmailMailOptionSettings.from,
                        subject: confirmEmailMailOptionSettings.subject,
                        text: mailText,
                    };

                    //send mail
                    smtpTransportGmail.sendMail(mailOptions, async (error: Error) => {
                        //if (error)
                        //    throw error; //throw error that will be caught at the end?
                        if (error)
                            console.log(error)
                    });
                });
                return {
                    notificationClass: "is-info",
                    notificationMessage: `If valid user, you will receive email shortly for email address confirmation`
                };
            } else {//email address or user not found
                //log bad request here and still respond
                return {
                    notificationClass: "is-info",
                    notificationMessage: `If valid user, you will receive email shortly for email addres confirmation`
                };
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `Problem sending email address confirmation: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByPrimaryEmailAddress(emailAddress: string): Promise<User> {
        try {
            return await this.userRepository.createQueryBuilder("user")
                .leftJoinAndSelect("user.roles", "roles")
                .addSelect("user.passwordHash")
                .where("user.emailAddress = :emailAddress", { emailAddress })
                .getOne();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem with getting user: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async findByConfirmedPrimaryEmailAddress(emailAddress: string): Promise<User> {
        try {
            return await this.userRepository.createQueryBuilder("user")
                .where("user.emailAddress = :emailAddress", { emailAddress })
                .andWhere("user.isPrimaryEmailAddressVerified = :isPrimaryEmailAddressVerified", { isPrimaryEmailAddressVerified: true })
                .getOne();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `There was a problem with getting user: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async confirmEmail(token: string, primary: boolean, reply: Reply) {
        try {
            //find user by token (primary or backup)
            let user: User = null;
            user = await this.findByPrimaryEmailVerificationToken(token) 
            if (user) {
                if (user.emailVerificationTokenExpiration.valueOf() > Date.now()) {
                    if (primary) {
                        user.isPrimaryEmailAddressVerified = true;
                        user.primaryEmailVerificationToken = null;
                    } 
                    user.emailVerificationTokenExpiration = null;

                    await this.userRepository.save(user);

                    reply.view('users/confirm-email-feedback.html', { title: 'MyEstate - Confirm Email', notificationClass: "is-success", notificationMessage: "Email confirmed!" });
                } else {//expired token
                    reply.view('users/confirm-email-feedback.html', { title: 'MyEstate - Confirm Email', notificationClass: "is-danger", notificationMessage: "Problem confirming email. Token has expired!" });
                }
            } else {//user with the sent token not found
                reply.view('users/confirm-email-feedback.html', { title: 'MyEstate - Confirm Email', notificationClass: "is-danger", notificationMessage: "Problem confirming email" });
            }

        } catch (error) {
            reply.view('users/confirm-email-feedback.html', { title: 'MyEstate - Confirm Email', notificationClass: "is-danger", notificationMessage: "Problem confirming email!" });
        }
    }

    /**
     * Invoked to setRefreshTokenHash after successful login.
     * @param refreshToken 
     * @param userId 
     */
    async setRefreshTokenHash(refreshToken: string, userId: number) {
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(userId, {
            refreshTokenHash
        });
    }

}
