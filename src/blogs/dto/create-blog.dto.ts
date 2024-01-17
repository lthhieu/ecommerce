import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateBlogDto {
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string
    @IsNotEmpty()
    @IsMongoId()
    category: mongoose.Schema.Types.ObjectId
}
