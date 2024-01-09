import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/configs/custom.decorator';
import { MAIL_RESET_PASSWORD } from 'src/configs/response.constants';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }
  @Get()
  @Public()
  @ResponseMessage(MAIL_RESET_PASSWORD)
  async sendEmailResetPassword() {
    return this.mailService.sendEmailResetPassword();
  }

}
