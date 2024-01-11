import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordUserDto, UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User as UserDecorator } from 'src/configs/custom.decorator';
import { RESET_PASSWORD, USER_CREATED } from 'src/configs/response.constants';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, IUser } from 'src/configs/define.interface';
import { User } from "src/users/schemas/user.schema";
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory) { }

  @Public()
  @Post()
  @ResponseMessage(USER_CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@UserDecorator() user: IUser) {
    const ability = this.caslAbilityFactory.createForUser(user);
    if (ability.can(Action.Read, User)) {
      return this.usersService.findAll();
    }
    throw new ForbiddenException('Cannot access to endpoint!')
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Public()
  @Patch('reset-password')
  @ResponseMessage(RESET_PASSWORD)
  async resetPassword(@Query('token') token: string, @Body() resetPasswordUserDto: ResetPasswordUserDto) {
    return this.usersService.resetPassword(token, resetPasswordUserDto.password);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

}
