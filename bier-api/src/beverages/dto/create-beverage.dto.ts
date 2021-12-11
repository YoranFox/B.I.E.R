import { Exclude, Expose } from "class-transformer";
import { IsBase64 } from "class-validator";
import { Creator } from "src/creator/entities/creator.entity";

@Exclude()
export class CreateBeverageDto {
    @Expose()
    name: string;

    @Expose()
    description?: string;

    @Expose()
    @IsBase64()
    pictureBase64String?: string;

    @Expose()
    creator?: Creator;
}
