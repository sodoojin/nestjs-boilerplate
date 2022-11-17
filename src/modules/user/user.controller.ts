import { Controller, Post, Redirect } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Redirect('/')
  async store(dto: CreateUserDto) {
    await this.userService.create(dto);
  }
}
