
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';


// Link .env file to read sensitive info from
require('dotenv').config();

//user management
export const PASSWORD_RESET_EXPIRATION = 86400000 * 2 //24 hours * 2 in milliseconds
export const VISIT_OTP_EXPIRATION = 900000 * 2 // 3 hours * 2 in milliseconds = 6 hours








/**
 * Settings for Gmail as SMTP server
 * Enable less secure apps so your email address can send out emails from the app: https://support.google.com/accounts/answer/6010255
 */
const nodemailerOptionsGmail = { 
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.PASSWORD
    }
}

export const smtpTransportGmail: Mail = nodemailer.createTransport(nodemailerOptionsGmail);





export const grantVisitMailOptionSettings = {
    textTemplate: `Hello {visitorFirstName} {visitorLastName}, \n 
    {userFirstName} has granted you permission to pay you a visit. Show this ID and OTP to the security personnel at the gate for entry access:\n\n
    {otp}
    If you did not request this, please ignore this email.`,
    html: `<h2>Hello {visitorFirstName} {visitorLastName},</h2> <br/>
   <p> {userFirstName} has granted you permission to pay you a visit. Show this ID and OTP to the security personnel at the gate for entry access:</p> <br>
    <h2><b>{otp}</b></h2>
    <button> Test </button>
    <br>
    If you did not request this, please ignore this email... `,
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






// Not in use
export enum UserRoles { 
    SecurityAdmin = 'security_admin',
    Resident = 'resident',
    Guest = 'guest',
    Visitor = 'visitor'
}







