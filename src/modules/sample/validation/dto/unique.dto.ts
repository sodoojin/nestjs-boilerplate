import { IsUnique } from '../../../../validators/is-unique';
import { User } from '../../user/entities/user.entity';

export class UniqueDto {
  @IsUnique(User, 'email')
  email: string;
}
