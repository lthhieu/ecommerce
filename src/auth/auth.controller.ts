import { Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { ResponseMessage } from 'src/configs/custom.decorator';
import { USER_LOGINED } from 'src/configs/response.constants';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @UseGuards(LocalAuthGuard)
    @ResponseMessage(USER_LOGINED)
    @Post('login')
    async login(@Request() req, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }
}
