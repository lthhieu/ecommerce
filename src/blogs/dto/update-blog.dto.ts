import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ImagesDto } from 'src/products/dto/update-product.dto';
import { Type } from 'class-transformer';

export class UpdateBlogDto extends PartialType(CreateBlogDto) { }

export class UpdateBlogImageDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ImagesDto)
    image: ImagesDto;
}
