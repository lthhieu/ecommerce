import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { ResponseMessage } from 'src/configs/custom.decorator';
import { USER_LOGINED } from 'src/configs/response.constants';

@Controller('auth')
export class AuthController {
    @UseGuards(LocalAuthGuard)
    @ResponseMessage(USER_LOGINED)
    @Post('login')
    async login(@Request() req) {
        return req.user;
    }
}
