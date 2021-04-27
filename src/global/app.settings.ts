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
export const VISIT_TOKEN_EXPIRATION = 900000 * 2 // 3 hours * 2 in milliseconds = 6 hours








/**
 * Settings for Gmail as SMTP server
 * Enable less secure apps so your email address can send out emails from the app: https://support.google.com/accounts/answer/6010255
 */
const nodemailerOptionsGmail = { 
    service: 'gmail',
    auth: {
        user: 'joseph.nwokotubo@pau.edu.ng',
        pass: 'coolpolice1'
    }
}

export const smtpTransportGmail: Mail = nodemailer.createTransport(nodemailerOptionsGmail);





export const grantVisitMailOptionSettings = {
    textTemplate: `Hello {visitorFirstName} {visitorLastName}, \n 
    {userFirstName} has granted you permission to pay you a visit. Show this ID and OTP to the security personnel at the gate for entry access:\n\n
    {url}
    If you did not request this, please ignore this email.`,
    html: `<html><head></head><body><p>Hello {visitorFirstName} {visitorLastName}, \n 
    {userFirstName} has granted you permission to pay you a visit. Show this ID and OTP to the security personnel at the gate for entry access:</p> <br>
    <h1 class='header'>{url}</h1>
    <button class='button is-warning'> Test </button>
    <br>
    If you did not request this, please ignore this email.. </body></html>`,
    subject: "Visit Request from {userFirstName} {userLastName}",
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





export enum UserRoles { 
    SecurityAdmin = 'security_admin',
    Resident = 'resident',
    Guest = 'guest',
    Visitor = 'visitor'
}







