import { Exclude, Expose } from "class-transformer";

@Exclude()
export class LoginResponseDto {
    @Expose()
    sessionId: string;
    @Expose()
    jwt: String;

}