import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(username);
        if (user && this.usersService.comparePassword(pass, user.password)) {
            let rawObj = user.toObject()
            delete rawObj.password
            return rawObj;
        }
        return null;
    }
}