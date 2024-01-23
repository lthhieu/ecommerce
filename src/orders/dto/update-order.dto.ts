import { IsEnum, IsNotEmpty } from "class-validator";
import { STATUS } from "src/configs/define.interface";

export class UpdateOrderDto {
    @IsNotEmpty()
    @IsEnum(STATUS)
    status: STATUS
}
