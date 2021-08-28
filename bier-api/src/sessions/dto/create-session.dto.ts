import { Exclude, Expose } from "class-transformer";
import { Code } from "src/codes/entities/code.entity";

@Exclude()
export class CreateSessionDto {
    @Expose()
    code: Code;

    @Expose()
    ipClient: string;
}
