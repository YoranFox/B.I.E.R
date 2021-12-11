import { Exclude, Expose } from "class-transformer";
import { Code } from "src/codes/entities/code.entity";
import { Creator } from "src/creator/entities/creator.entity";

@Exclude()
export class CreateSessionDto {
    @Expose()
    code?: Code;

    @Expose()
    creator?: Creator;

    @Expose()
    ipClient: string;
}
