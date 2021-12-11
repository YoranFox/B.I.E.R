import { Exclude, Expose } from "class-transformer";
import { IsEmail} from "class-validator";

@Exclude()
export class LoginCreatorDto {
    @Expose()
    @IsEmail()
    email: string;
    @Expose()
    password: string;
}