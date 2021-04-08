    /*async resetPassword(token: string, newPassword: string, reply: Reply): Promise<any> {
        try {
            const user = await this.findByResetPasswordToken(token);
            if (user) {
                if (user.resetPasswordExpiration.valueOf() > Date.now()) {
                    //token has not expired, proceed!
                    if (newPassword) {
                        //proceed with saving
                        //hash the password in dto
                        await bcrypt.hash(newPassword, 10).then((hash: string) => {
                            user.passwordHash = hash;
                        })
                        user.resetPasswordToken = null;//clear
                        //save
                        await this.userRepository.save(user);
                        //consider sending mail here to the user to say that password has recently been reset

                        reply.view('users/reset-password.html',
                            {
                                title: 'SGVI-1 Mini CMS - Reset Password',
                                sendForm: false,
                                notificationVisibility: "",
                                notificationClass: "is-success",
                                notificationMessage: "New password successfully saved"
                            })

                    } else {//no newPassword yet. In principle, user should be sent back to form for entering new password.
                        const globalPrefixUrl = USE_API_VERSION_IN_URL ? `/${API_VERSION}` : '';
                        const returnUrl = `${globalPrefixUrl}/users/reset-password/${token}`;
                        //await reply.send(, {sendForm: true, token: token});//send form with token for submit url
                        reply.view('users/reset-password.html',
                            {
                                title: 'SGVI-1 Mini CMS - Reset Password',
                                sendForm: true,
                                returnUrl: returnUrl,
                                notificationVisibility: "is-hidden"
                            })
                    }
                } else {//expired token
                    reply.view('users/reset-password.html',
                        {
                            title: 'SGVI-1 Mini CMS - Reset Password',
                            sendForm: false,
                            notificationVisibility: "",
                            notificationClass: "is-danger",
                            notificationMessage: "Invalid token: expired"
                        });
                }
            } else {//user with the sent token not found
                reply.view('users/reset-password.html',
                    {
                        title: 'SGVI-1 Mini CMS - Reset Password',
                        sendForm: false,
                        notificationVisibility: "",
                        notificationClass: "is-danger",
                        notificationMessage: "Invalid token: not found"
                    });
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `Problem with password reset request: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
     /**
     * Called to reset password from email sent with token
     * @param token 
     * @param newPassword 
     * @param reply 
     */
    /* Had problem with combining reply.view and return. Using only reply.view for now. See below
    async resetPassword(token: string, newPassword: string, reply: Reply): Promise<any> {
        try {
            const user = await this.findByResetPasswordToken(token);
            if (user) {
                if (user.resetPasswordExpiration.valueOf() > Date.now()) {
                    //token has not expired, proceed!
                    if (newPassword) {
                        //proceed with saving
                        //hash the password in dto
                        await bcrypt.hash(newPassword, 10).then((hash: string) => {
                            user.passwordHash = hash;
                        })
                        user.resetPasswordToken = null;//clear
                        //save
                        await this.userRepository.save(user);
                        //consider sending mail here to the user to say that password has recently been reset
                        
                        return {
                            notificationClass: "is-success",
                            notificationMessage: "New password successfully saved"
                        };//only send this when form has already been sent
                    } else {//no newPassword yet. In principle, user should be sent back to form for entering new password.
                        const globalPrefixUrl = USE_API_VERSION_IN_URL ? `/${API_VERSION}` : '';
                        const returnUrl = `${globalPrefixUrl}/users/reset-password/${token}`;
                        //await reply.send(, {sendForm: true, token: token});//send form with token for submit url
                        reply.view('users/reset-password.html', { title: 'SGVI-1 Mini CMS - Reset Password', sendForm: true, returnUrl: returnUrl })
                    }
                } else {//expired token
                    reply.view('users/reset-password.html', { title: 'SGVI-1 Mini CMS - Reset Password', success: false, error: { message: 'Invalid token', detail: "The token sent has expired" } });
                }
            } else {//user with the sent token not found
                reply.view('users/reset-password.html', { title: 'SGVI-1 Mini CMS - Reset Password', success: false, error: { message: "Invalid token", detail: "No valid token was sent" } });
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `Problem with password reset request: ${error.message}`,
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
*/