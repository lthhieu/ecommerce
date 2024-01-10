import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/configs/custom.decorator';
import { MAIL_RESET_PASSWORD, RESET_PASSWORD } from 'src/configs/response.constants';
import { ResetPasswordUserDto } from '../users/dto/update-user.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }
  @Get('forgot-password')
  @Public()
  @ResponseMessage(MAIL_RESET_PASSWORD)
  async sendEmailResetPassword(@Query('email') email: string) {
    return this.mailService.sendEmailResetPassword(email);
  }

  @Patch('reset-password')
  @Public()
  @ResponseMessage(RESET_PASSWORD)
  async resetPassword(@Query('token') token: string, @Body() resetPasswordUserDto: ResetPasswordUserDto) {
    return this.mailService.resetPassword(token, resetPasswordUserDto.password);
  }

}
