import { Exclude, Expose } from 'class-transformer';
import { Creator } from 'src/creator/entities/creator.entity';
import { UserRole } from 'src/enums/roles.enum';

@Exclude()
export class CreateCodeDto {
  @Expose()
  code: string;

  @Expose()
  description?: string;

  @Expose()
  creator?: Creator;
}
