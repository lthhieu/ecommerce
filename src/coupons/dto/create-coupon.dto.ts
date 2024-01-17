import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsNumber()
    discount: number;
    @IsNotEmpty()
    @IsNumber()
    expire: number
}
