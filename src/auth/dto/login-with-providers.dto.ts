import { IsNotEmpty } from "class-validator";

export class LoginWithProviders {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    avatar: string;
}
