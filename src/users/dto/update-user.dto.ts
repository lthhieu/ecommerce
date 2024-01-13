import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
    @IsNotEmpty()
    role: string;
    @IsNotEmpty()
    @IsBoolean()
    isBlocked: boolean;
}
export class ResetPasswordUserDto {
    @IsNotEmpty()
    password: string;
}