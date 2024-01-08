import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/configs/define.interface';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';

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
        const refreshToken = this.createRefreshToken(user)
        //save refresh token in db
        await this.usersService.updateRefreshToken(refreshToken, _id)
        //save refresh token in cookies
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('REFRESH_TOKEN_EXPIRE'))
        })
        return {
            access_token: this.jwtService.sign(payload),
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
}