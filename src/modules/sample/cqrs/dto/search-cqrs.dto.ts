import { IsEmail, IsNotEmpty } from 'class-validator';

export class SearchCqrsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
