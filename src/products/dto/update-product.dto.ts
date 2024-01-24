import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ArrayMinSize, IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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
export class UpdateProductImageDto {
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    images: string[];
}
