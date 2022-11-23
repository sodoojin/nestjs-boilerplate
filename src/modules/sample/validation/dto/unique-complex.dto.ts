import { IsUnique } from '../../../../validators/is-unique';
import { User } from '../../user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';

export class UniqueComplexDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  firstName: string;

  @IsUnique(User, (data) => ({
    where: {
      firstName: data.firstName,
      email: data.email,
    },
    except: {
      id: data.id,
    },
  }))
  email: string;
}
