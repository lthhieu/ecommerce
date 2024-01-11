import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordUserDto, UpdateUserDto } from './dto/update-user.dto';
import { CheckPolicies, Public, ResponseMessage, User as UserDecorator } from 'src/configs/custom.decorator';
import { RESET_PASSWORD, USER_CREATED } from 'src/configs/response.constants';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, IUser } from 'src/configs/define.interface';
import { User } from "src/users/schemas/user.schema";
import { ForbiddenError } from '@casl/ability';
import { PoliciesGuard } from 'src/configs/policies.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post()
  @ResponseMessage(USER_CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  findAll() {
    // const ability = this.caslAbilityFactory.createForUser(user);
    // if (!ability.can(Action.Read, User)) {
    //   throw new ForbiddenException('Cannot access to endpoint!')
    // }
    // try {
    //   ForbiddenError.from(ability).throwUnlessCan(Action.Read, User)
    //   return this.usersService.findAll();
    // } catch (e) {
    //   if (e instanceof ForbiddenError) {
    //     throw new ForbiddenException(e.message)
    //   }
    // }
    return this.usersService.findAll();
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
