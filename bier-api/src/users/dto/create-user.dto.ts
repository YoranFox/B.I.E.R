import { Exclude, Expose } from "class-transformer";
import { IsBase64, IsString } from "class-validator";

@Exclude()
export class CreateUserDto {

    @Expose()
    @IsString()
    name: string;

    @Expose()
    @IsBase64()
    pictureBase64String?: string;
}
