import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from 'src/configs/custom.decorator';
import { USER_LOGGEDIN, USER_LOGGEDIN_PROVIDERS, USER_LOGGEDOUT, USER_PROFILE, USER_REFRESH_TOKEN } from 'src/configs/response.constants';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { IUser } from 'src/configs/define.interface';
import { UsersService } from 'src/users/users.service';
import { LoginWithProviders } from './dto/login-with-providers.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private usersService: UsersService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage(USER_LOGGEDIN)
    @Post('login')
    async login(@Request() req, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @ResponseMessage(USER_LOGGEDIN_PROVIDERS)
    @Post('providers')
    async loginWithProviders(@Body() loginWithProviders: LoginWithProviders, @Res({ passthrough: true }) response: Response) {
        return this.authService.loginWithProviders(loginWithProviders, response);
    }

    @ResponseMessage(USER_PROFILE)
    @Get('profile')
    async getProfile(@User() user: IUser) {
        const { email } = user
        const profile = await this.usersService.findOneByEmail(email, 'SYSTEM')
        const { password, refreshToken, role, ...result } = profile.toObject()
        return result;
    }

    @Public()
    @ResponseMessage(USER_REFRESH_TOKEN)
    @Post('refresh-access-token')
    async refresh(@Request() req) {
        return this.authService.refreshAccessToken(req);
    }

    @ResponseMessage(USER_LOGGEDOUT)
    @Post('logout')
    async logout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
        return this.authService.logout(user, response);
    }
}
