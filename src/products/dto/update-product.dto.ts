import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ArrayMinSize, IsArray, IsDate, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) { }
export class UpdateProductRatingDto {
    @IsNotEmpty()
    @IsNumber()
    star: Number;
    @IsNotEmpty()
    comment: string;
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    postedAt: Date
}
export class ImagesDto {
    @IsNotEmpty()
    @IsString()
    public_id: string;
    @IsNotEmpty()
    @IsString()
    secure_url: string
}
export class UpdateProductImageDto {
    @IsNotEmpty()
    @IsArray()
    @IsObject({ each: true })
    @ArrayMinSize(1)
    @ValidateNested()
    @Type(() => ImagesDto)
    images: ImagesDto;
}
