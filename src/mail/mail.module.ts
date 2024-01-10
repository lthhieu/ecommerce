import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfigService } from 'src/configs/mail.config.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule,
    MailerModule.forRootAsync({
      useClass: MailConfigService,
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule { }
