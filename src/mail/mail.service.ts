import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { NOT_FOUND_EMAIL, RESET_PASSWORD_TOKEN_EXPIRE } from 'src/configs/response.constants';
import { UsersService } from 'src/users/users.service';
import crypto from 'crypto'
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService,
        private usersService: UsersService,
        private configService: ConfigService) { }
    async sendEmailResetPassword(email: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) throw new BadRequestException(NOT_FOUND_EMAIL)
        const receiver = user.firstName + " " + user.lastName
        //tạo chuỗi ngẫu nhiên gửi mail
        const token = crypto.randomBytes(16).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
        const passwordResetExpire = Date.now() + ms(this.configService.get<string>('EMAIL_EXPIRE'))
        await this.usersService.updatePasswordToken(passwordResetToken, passwordResetExpire.toString(), user._id.toString())
        const link = `${this.configService.get<string>('FRONTEND_URI')}/reset-password?token=${token}`;
        await this.mailerService.sendMail({
            to: email, // list of receivers
            from: 'Xuân và Hiếu Shop Notification noreply@nestjs.com', // sender address
            subject: 'Reset Your Password', // Subject line
            template: 'forgot-password',
            context: {
                receiver,
                email,
                link,
                emailSupport: this.configService.get<string>('EMAIL_AUTH_USER')
            }
        });
        return { token }
    }
    async resetPassword(token: string, newPassword: string) {
        //check token is valid
        const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
        const checkToken = await this.usersService.checkResetPasswordToken(passwordResetToken)
        if (!checkToken) throw new BadRequestException(RESET_PASSWORD_TOKEN_EXPIRE)
        await this.usersService.resetPassword(newPassword, checkToken._id.toString())
        return "ok"
    }
}
