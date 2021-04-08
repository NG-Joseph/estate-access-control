import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Reply } from 'src/global/custom.interfaces';

import { CreateRoleDto } from 'src/roles/dto/create-role.dto';

import { UpdateUserDto } from './dto/update-user.dto';
import { FileUploadDto } from '../global/file-upload.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import renderEngine from 'src/global/render.engine';
import { API_VERSION } from 'src/global/app.settings';
import { renderToNodeStream } from 'react-dom/server';
import {CreateUserDto, CreateUserDtos} from "./dto/create-user.dto";

import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Role } from 'src/roles/entities/role.entity';

import { GenericBulmaNotificationResponseDto } from 'src/global/custom.dto';
import { InsertResult, UpdateResult } from 'typeorm';

@ApiTags('users')
@Controller('users')
export class UsersController {

    /**
     * 
     * @param usersService 
     */
    constructor(private readonly usersService: UsersService) { }

    /**
     * Post a single user
     * @param createUserDto 
     * @param req 
     */
    @ApiOperation({ description: "Create a new user" })
    @ApiCreatedResponse({description: 'User has been successfully created.'})
    @ApiBadRequestResponse({description: "Bad request: constraint problem"})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Post()
    //TODO: still to find out why CreateUserDto as type is failing below. I am using User meanwhile
    create(@Body() createUserDto: CreateUserDto, @Req() req: Request): Promise<User>{
        return this.usersService.create(createUserDto, req);
    }

    /**
     * Post multiple users
     * @param createUserDtos 
     * @param req 
     */
    @ApiOperation({ description: "Create one or more new users in one go" })
    @ApiCreatedResponse({description: 'Users have been successfully created.'})
    @ApiBadRequestResponse({description: "Bad request: constraint problem"})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Post('insert')
    insert(@Body() createUserDtos: CreateUserDtos, @Req() req: Request): Promise<InsertResult> {
        return this.usersService.insertUsers(createUserDtos.dtos, req);
    }

    /**
     * Do partial update of a user.
     * @param id The user id
     * @param updateUserDto This dto does not contain user id. Deconstruct in usersService
     */
    @ApiOperation({ description: "Update a user. Only the fields sent from client will be updated" })
    @ApiOkResponse({description: 'User has been successfully updated.'})
    @ApiBadRequestResponse({description: "Bad request: constraint problem"})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return this.usersService.update(id, updateUserDto);
    }

    /**
     * 
     * @param user 
     * Non-partial update. Takes a full tenant without param.
     */
    @ApiOperation({ description: "Update a user. Fully replaces all fields" })
    @ApiOkResponse({description: 'User has been successfully updated.'})
    @ApiBadRequestResponse({description: "Bad request: constraint problem"})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Put()
    save(@Body() user: User): Promise<User> {
        return this.usersService.save(user);
    }

    /**
     * Delete a user with the given id
     * @param id 
     */
    @ApiOperation({ description: "Delete a user." })
    @ApiOkResponse({description: 'User has been successfully deleted.'})
    @ApiBadRequestResponse({description: "Bad request: likely user does not exist"})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.delete(id);
    }

    /**READ section */
    /**
     * Get all users. Returns an array of users found and the total number of users
     * @param query May contain findOptions
     */
    @ApiOperation({ description: "Get all users that meet the criteria specified in query options, if any." })
    @ApiOkResponse({description: 'Users returned.'})
    @ApiBadRequestResponse({description: "Bad request: likely incorrect options sent"})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Get()
    findAll(@Query() query: string): Promise<[User[], number]> {
        for (const queryKey of Object.keys(query)) {
            if (queryKey == "findOptions") {
                return this.usersService.findAllWithOptions(decodeURI(query[queryKey]));
            }
        }
        return this.usersService.findAll();
    }

    /**
     * Find user by id
     * @param id 
     * 
     */
    @ApiOperation({ description: "Get a user with the id sent as param" })
    @ApiOkResponse({description: 'User returned.'})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.findOne(id);
    }

    /**
     * Returns html
     * @param reply 
     */
    @ApiOperation({ description: "This url is for web client involving both server-side and client-side rendering" })
    @ApiOkResponse({description: 'Rendered web page is returned.'})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Get('web*')
    async web(@Res() reply: Reply, @Req() req: Request) {
        //We want to render the raw way so that we can call renderToStream
        const res = reply.raw;

        const beforeStream = renderEngine().render('users/before-react-stream.fragment.html',
            { title: 'User Management', UserAdminctive: true, apiVersion: API_VERSION!==null? `${API_VERSION}`: '' , currentUrlSlug: API_VERSION!==null?`/${API_VERSION}/users/web`: '/users/web'})

        const afterStream = renderEngine().render('users/after-react-stream.fragment.html')

        //Write the first rendered fragment (upper html part)
        res.write(beforeStream);

        //write the React app using renderToNodeStream
        const context = {};
        const stream = renderToNodeStream(
            <StaticRouter location={req.url} context={context}>
                <App  baseUrl={`${API_VERSION!==null? `/${API_VERSION}`: '' }/users/web`} />
            </StaticRouter>
        )

        stream.addListener('end', () => {
            res.write(afterStream); //Write the last rendered fragment (lower html part)
            res.end();
        });

        //enable stream piping
        stream.pipe(res, { end: false });
    }

    /*Work on relationships*/
    //1. Roles
    /**
     * Post a new role and associate it with the user with userId. This may not be very useful
     * @param createRoleDto 
     * @param userId 
     */

    @ApiOperation({ description: "Post a new role and associate it with the user with userId." })
    @ApiOkResponse({description: 'New role created and associated with the user.'})
    @ApiBadRequestResponse({description: "Bad request: likely, user does not exist or role already exists"})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Post(':userId/roles')
    createAndAddRole(@Body() createRoleDto: CreateRoleDto, @Param('userId', ParseIntPipe) userId: number){
        this.usersService.createAndAddRole(userId, createRoleDto);
    }
    
    /**
     * Add role to a user by id
     * @param userId 
     * @param roleId 
     */
    @ApiOperation({ description: "Assign role with roleId to user with userId." })
    @ApiOkResponse({description: 'Role assigned to user successfully.'})
    @ApiBadRequestResponse({description: "Bad request: likely, user or role does not exist"})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Patch(':userId/roles/:roleId')
    addRoleById(@Param('userId', ParseIntPipe) userId: number, @Param('roleId', ParseIntPipe) roleId: number){
        this.usersService.addRoleById(userId, roleId);
    }

    /**
     * 
     * @param query This should contain an array of roleIds in query key named roleid e.g. ?roleid=1&roleid=2&roleid=3...
     * @param userId 
     */
    @ApiOperation({ description: "Assign multiple roles to user with userId. The query should contain an array of roleIds in query key named roleid e.g. ?roleid=1&roleid=2&roleid=3..." })
    @ApiOkResponse({description: 'Roles assigned to user successfully.'})
    @ApiBadRequestResponse({description: "Bad request: likely, user or role(s) does not exist"})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Patch(':userId/roles')
    addRolesById(@Query() query: string, @Param('userId', ParseIntPipe) userId: number): Promise<Role[]>{
        return this.usersService.addRolesById(userId, query['roleid']);
    }

    /**
     * Remove role from a user
     * @param userId 
     * @param roleId 
     */
    @ApiOperation({ description: "Remove role with roleId from user with userId" })
    @ApiOkResponse({description: 'Role removed from user successfully.'})
    @ApiBadRequestResponse({description: "Bad request: likely, user or role does not exist"})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Delete(':userId/roles/:roleId')
    removeRoleById(@Param('userId', ParseIntPipe) userId: number, @Param('roleId', ParseIntPipe) roleId: number): Promise<Role[]>{
        return this.usersService.removeRoleById(userId, roleId);
    }

    /**
     * Remove multiple roles from a user
     * @param query This should contain an array of roleId in query named as roleid e.g. ?roleid=1&roleid=2&roleid=3...
     * @param userId 
     */
    @ApiOperation({ description: "Remove multiple roles from user with userId. The query should contain an array of roleIds in query key named roleid e.g. ?roleid=1&roleid=2&roleid=3..." })
    @ApiOkResponse({description: 'Roles removed from user successfully.'})
    @ApiBadRequestResponse({description: "Bad request: likely, user or role(s) does not exist"})
    @ApiInternalServerErrorResponse({description: 'Internal server error'})
    @Delete(':userId/roles')
    removeRolesById(@Query() query: string, @Param('userId', ParseIntPipe) userId: number): Promise<Role[]>{
        return this.usersService.removeRoleById(userId, query['roleid']);
    }

    /*Work on other relationships*/
    /**
     * Create a new tenant and set user with userId as the primary contact
     * @param createTenantDto 
     * @param userId 
/*

    

    /*Some user perculiarities*/
    /**
     * Set the password of a user with userId
     * @param userId 
     * @param password 
     */
    @Patch(':userId/set-password')
    setUserPassword(@Param('userId', ParseIntPipe) userId: number, @Body() password: string): Promise<UpdateResult> {
        return this.usersService.setUserPassword(userId, password);
    }

    /**
     * Upload photo of a user with userId
     * @param userId 
     * @param req 
     * @param reply 
     */
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'User photo',
        type: FileUploadDto,
      })
    @Post(':userId/photo')
    setUserPhoto(@Param('userId', ParseIntPipe) userId: number, @Req() req: Request, @Res() reply: Reply): Promise<void>{
        return this.usersService.setUserPhoto(userId, req, reply);
    }

    /**
     * Get the photo of a user. This link is used on client side for image URL
     * @param userId 
     * @param reply 
     */
    @Get(':userId/photo')
    async getUserPhoto(@Param('userId', ParseIntPipe) userId: number, @Res() reply: Reply){
        return this.usersService.getUserPhoto(userId, reply);
    }

   

    /**
     * Receives request to confirm primary email address of user with userId. Calls service to send a token.
     * @param userId 
     * @param req 
     */
    @Get(':userId/confirm-primary-email-request')
    confirmPrimaryEmailRequest(@Param('userId', ParseIntPipe) userId: number, @Req() req: Request){
        //may be safer to get userId from cookie
        return this.usersService.confirmEmailRequest(null, userId, true, req);

    }  

    /**
     * Receives request to confirm backup email address of user with userId. Calls service to send a token.
     * @param userId 
     * @param req 
     */
    @Get(':userId/confirm-backup-email-request')
    confirmBackupEmailRequest(@Param('userId', ParseIntPipe) userId: number, @Req() req: Request){
        //may be safer to get userId from cookie
        return this.usersService.confirmEmailRequest(null, userId, false, req);

    } 

    /**
     * Called to confirm primary email address. Passes token to service to validate and then confirm email
     * @param token 
     * @param reply 
     */
    @Get('confirm-primary-email/:token')
    confirmPrimaryEmail(@Param('token') token: string, @Res() reply: Reply){
        return this.usersService.confirmEmail(token, true, reply);

    }

    /**
     * Called to confirm primary email address. Passes token to service to validate and then confirm email
     * @param token 
     * @param reply 
     */
    @Get('confirm-backup-email/:token')
    confirmBackupEmail(@Param('token') token: string, @Res() reply: Reply){
        return this.usersService.confirmEmail(token, false, reply);
    }
    

}
