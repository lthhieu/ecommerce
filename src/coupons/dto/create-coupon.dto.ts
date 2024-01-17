import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsNumber()
    discount: number;
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    expire: Date
}
