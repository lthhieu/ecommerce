import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { NOT_FOUND_EMAIL } from 'src/configs/response.constants';
import { UsersService } from 'src/users/users.service';
import crypto from 'crypto'
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        private configService: ConfigService) { }
    async sendEmailResetPassword(email: string) {
        const user = await this.usersService.findOneByEmail(email, 'SYSTEM');
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

    async sendEmailConfirmEmail(createUserDto: CreateUserDto, token: string) {
        const link = `${this.configService.get<string>('FRONTEND_URI')}/confirm-email?token=${token}`;
        await this.mailerService.sendMail({
            to: createUserDto.email, // list of receivers
            from: 'Xuân và Hiếu Shop Notification noreply@nestjs.com', // sender address
            subject: 'Confirm Email', // Subject line
            template: 'confirm-email',
            context: {
                receiver: `${createUserDto.firstName} ${createUserDto.lastName}`,
                email: createUserDto.email,
                link,
                emailSupport: this.configService.get<string>('EMAIL_AUTH_USER')
            }
        });
        return { token }
    }
}
