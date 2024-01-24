import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateProductDto {
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    @IsString({ each: true })
    description: string[];
    @IsNotEmpty()
    @IsMongoId()
    brand: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty()
    @IsNumber()
    price: Number;
}