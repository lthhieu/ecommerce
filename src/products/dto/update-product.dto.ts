import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
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
