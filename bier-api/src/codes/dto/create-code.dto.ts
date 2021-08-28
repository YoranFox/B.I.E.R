import { Exclude, Expose } from "class-transformer";
import { UserRole } from "src/enums/roles.enum";

@Exclude()
export class CreateCodeDto {
    @Expose()
    code: string;

    @Expose()
    role: UserRole;

    @Expose()
    endDate: Date;

    @Expose()
    description?: string;
}
