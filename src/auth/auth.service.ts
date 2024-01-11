import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { IUser } from 'src/configs/define.interface';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import ms from 'ms';
import { NOT_FOUND_REFRESH_TOKEN, TOKEN_EXPIRED } from 'src/configs/response.constants';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(username);
        if (user && this.usersService.comparePassword(pass, user.password)) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, email, role } = user
        const payload = { _id, email, role, sub: 'token login', iss: 'from server' };
        const generateRefreshToken = this.createRefreshToken(user)
        //save refresh token in db
        const updateRefreshToken = await this.usersService.updateRefreshToken(generateRefreshToken, _id)
        //save refresh token in cookies
        response.cookie('refresh_token', generateRefreshToken, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('REFRESH_TOKEN_EXPIRE')) * 1000
        })
        const { refreshToken, password, role: roleUser, ...result } = updateRefreshToken.toObject();
        return {
            access_token: this.jwtService.sign(payload),
            user: result
        };
    }

    createRefreshToken = (user: IUser) => {
        const { _id, email, role } = user
        const payload = { _id, email, role, sub: 'token login', iss: 'from server' };
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE')
        })
    }

    refreshAccessToken = async (request: Request) => {
        const refreshToken = request.cookies['refresh_token']
        if (!refreshToken) {
            throw new BadRequestException(NOT_FOUND_REFRESH_TOKEN);
        }
        try {
            const result = this.jwtService.verify(refreshToken, { secret: this.configService.get<string>('SECRET') })
            const { _id, email, role } = result
            const payload = { _id, email, role, sub: 'token refresh', iss: 'from server' };
            const profile = await this.usersService.findOneByEmail(email)
            const { password, refreshToken: refreshTokenUser, role: roleUser, ...user } = profile.toObject()
            return {
                access_token: this.jwtService.sign(payload),
                user
            };
        } catch (e) {
            throw new BadRequestException(TOKEN_EXPIRED)
        }
    }

    logout = async (user: IUser, response: Response) => {
        const { _id } = user
        //refreshToken = null
        await this.usersService.updateRefreshToken(null, _id)
        //delete cookies
        response.clearCookie('refresh_token', { httpOnly: true, secure: true })
        return "ok"
    }
}