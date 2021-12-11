import { IsEmail } from "class-validator";

export class CreateCreatorDto {
    @IsEmail()
    email: string;
    password: string;
}
