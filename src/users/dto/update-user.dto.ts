import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
    @IsNotEmpty()
    noHome: string;
    @IsNotEmpty()
    street: string;
    @IsNotEmpty()
    ward: string;
    @IsNotEmpty()
    district: string;
    @IsNotEmpty()
    city: string
}

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
    @IsNotEmpty()
    role: string;
    @IsNotEmpty()
    @IsBoolean()
    isBlocked: boolean;
    @IsNotEmpty()
    @IsObject()
    @IsString({ each: true })
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto
}
export class ResetPasswordUserDto {
    @IsNotEmpty()
    password: string;
}