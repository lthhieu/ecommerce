import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from 'src/configs/custom.decorator';
import { USER_LOGINED, USER_PROFILE } from 'src/configs/response.constants';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IUser } from 'src/configs/define.interface';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private usersService: UsersService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage(USER_LOGINED)
    @Post('login')
    async login(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(user, response);
    }

    @ResponseMessage(USER_PROFILE)
    @Get('profile')
    async getProfile(@User() user: IUser) {
        const { email } = user
        const profile = await this.usersService.findOneByEmail(email)
        const { password, refreshToken, role, ...result } = profile.toObject()
        return result;
    }
}
