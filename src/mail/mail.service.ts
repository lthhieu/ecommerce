import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }
    async sendEmailResetPassword() {
        await this.mailerService.sendMail({
            to: 'vtinhoc91@gmail.com', // list of receivers
            from: 'noreply@nestjs.com', // sender address
            subject: 'Testing Nest MailerModule ✔', // Subject line
            template: 'forgot-password',
            context: {
                receiver: "Khách hàng 1",
                email: 'hieuvaxuan@gmail.com'
            }
        });
    }
}
