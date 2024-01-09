import { MailerOptions, MailerOptionsFactory } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from "path";
@Injectable()
export class MailConfigService implements MailerOptionsFactory {
    constructor(private configService: ConfigService) { }
    getRootPath = () => {
        return process.cwd();
    };

    createMailerOptions(): MailerOptions {
        const email_host = this.configService.get<string>('EMAIL_HOST');
        const email_auth_user = this.configService.get<string>('EMAIL_AUTH_USER');
        const email_auth_pass = this.configService.get<string>('EMAIL_AUTH_PASS');
        const email_preview = this.configService.get<string>('EMAIL_PREVIEW');
        return {
            transport: {
                host: email_host,
                port: 465,
                secure: true,
                auth: {
                    user: email_auth_user,
                    pass: email_auth_pass,
                },
            },
            template: {
                dir: join(this.getRootPath(), `dist/mail/templates`),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }
    }
}