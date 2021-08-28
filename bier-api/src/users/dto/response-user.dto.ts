import { Exclude, Expose, Type } from "class-transformer";
import { Session } from "src/sessions/entities/session.entity";

@Exclude()
export class UserProfileDto {
    @Expose()
    id: string;
    @Expose()
    name: string;
    @Expose()
    pictureBase64String?: string;
}

@Exclude()
export class UserLoginResponseDto {
    @Expose()
    id: string;
    @Expose()
    name: string;
    @Expose()
    pictureBase64String?: string;
    @Expose()
    isAdmin: boolean;
}

