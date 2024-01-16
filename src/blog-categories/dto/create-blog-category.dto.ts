import { IsNotEmpty } from "class-validator";

export class CreateBlogCategoryDto {
    @IsNotEmpty()
    title: string
}
