import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCqrsCommand } from '../create-cqrs.command';
import { CqrsService } from '../../cqrs.service';
import { UserService } from '../../../user/user.service';

@CommandHandler(CreateCqrsCommand)
export class CreateCqrsHandler implements ICommandHandler<CreateCqrsCommand> {
  constructor(
    private cqrsService: CqrsService,
    private userService: UserService,
  ) {}

  async execute(command: CreateCqrsCommand): Promise<any> {
    const result = await this.cqrsService.create();

    await this.userService.create(command);

    return result;
  }
}
