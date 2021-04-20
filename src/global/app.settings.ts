//The values used here should really come from a settings table in database.

import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
/*Below is to directly read .env file from settings. 
See https://www.npmjs.com/package/dotenv.
It is used to get the particulars of Gmail account for SMTP mailer
*/
require('dotenv').config({ path: 'config.env' });

//user management
export const PASSWORD_RESET_EXPIRATION = 86400000 * 2 //24 hours * 2 in milliseconds
export const VISIT_TOKEN_EXPIRATION = 900000 * 2

export const EMAIL_VERIFICATION_EXPIRATION = 86400000 * 2 //24 hours * 2 in milliseconds

export const LOGO_FILE_SIZE_LIMIT = 1000 * 1024;
export const PHOTO_FILE_SIZE_LIMIT = 1000 * 1024;

//Prepare nodemailer using sendgrid. I signed up for one. 
//See https://nodemailer.com/smtp/; https://nodemailer.com/smtp/#authentication
/* sendGrid account not active. Using Gmail instead. See below.*/
const nodemailerOptions = {
    pool: true,
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {//I generated these with my free account
        user: "",
        pass: ""
    },
    logger: true,
    //debug: true

}
export const smtpTransport: Mail = nodemailer.createTransport(nodemailerOptions);

/**
 * Settings for Gmail as SMTP server
 */
const nodemailerOptionsGmail = {
    service: 'gmail',
    auth: {
        user: process.env.SMTPUSER,
        pass: process.env.SMTPPWORD
    }
}

export const smtpTransportGmail: Mail = nodemailer.createTransport(nodemailerOptionsGmail);


export const resetPasswordMailOptionSettings = {
    textTemplate: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    {url}
    If you did not request this, please ignore this email and your password will remain unchanged.\n\n`,
    
    subject: "Reset Password - estate.com",
    from: "noreply@estate.com"

}

export const confirmEmailMailOptionSettings = {
    textTemplate: `You are receiving this because the email address associated with your account requires confirmation.\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    {url}`,
    subject: "Confirm Email - estate.com",
    from: "noreply@estate.com"

}
export const grantVisitMailOptionSettings = {
    textTemplate: `Hello {visitor.firstName}, \n 
    {user.firstName} has granted you permission to pay you a visit. Show this token to the security personnel at the gate for entry access:\n\n
    {url}
    If you did not request this, please ignore this email for the next 5 hours and the request will be automatically declined.`,
    subject: "Visit Request from {visitor.firstName} {visitor.lastName}",
    from: "noreply@estate.com"
}

export const visitorRequestMailOptionSettings = {
    textTemplate: `Hello {user.firstName}, \n 
    {visitor.firstName} wants to pay you a visit. To accept, please click this link or paste it into your browser:\n\n
    {url}
    If you did not request this, please ignore this email for the next 5 hours and the request will be automatically declined.`,
    subject: "Visit Request from {visitor.firstName} {visitor.lastName}"
}

export const APP_NAME: string = "Estate API";

export const APP_DESCRIPTION: string = "Estate Access Control backend for managing and logging visits into an estate";

export const API_VERSION: string = "v1";

export const USE_API_VERSION_IN_URL: boolean = true;

export const AUTO_SEND_CONFIRM_EMAIL: boolean = true;




export enum UserRoles { //better use this for creating roles, so as to ensure that the names are always the same
    SecurityAdmin = 'security_admin',
    Resident = 'resident',
    Guest = 'guest',
    Visitor = 'visitor'
}


export const PROTOCOL: "https" | "http" = "http";


//For JWT
export const jwtConstants = {
    SECRET: process.env.SECRET_KEY,
    SECRET_KEY_EXPIRATION: parseInt(process.env.SECRET_KEY_EXPIRATION),//integer value is read as seconds. string value with no unit specified, is read as millisecs. See https://www.npmjs.com/package/jsonwebtoken for units
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    REFRESH_SECRET_KEY_EXPIRATION: process.env.REFRESH_SECRET_KEY_EXPIRATION

};
