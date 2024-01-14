import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordUserDto, UpdateUserDto } from './dto/update-user.dto';
import { CheckPolicies, Public, ResponseMessage, User } from 'src/configs/custom.decorator';
import { RESET_PASSWORD, USER_CREATED, USER_FETCH_ALL, USER_FETCH_BY_ID } from 'src/configs/response.constants';
import { Action, IUser } from 'src/configs/define.interface';
import { UserSubject } from 'src/configs/define.class';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';
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
  @ResponseMessage(USER_FETCH_ALL)
  @CheckPolicies({ action: Action.Read, subject: UserSubject })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ResponseMessage(USER_FETCH_BY_ID)
  findOne(@Param('id') id: string, @User() user: IUser) {
    const ability = this.caslAbilityFactory.createForUser(user)
    try {
      const userToRead = new UserSubject()
      userToRead._id = id
      ForbiddenError.from(ability).throwUnlessCan(Action.Read, userToRead)
      return this.usersService.findOne(id);
    } catch (e) {
      if (e instanceof ForbiddenError) {
        throw new ForbiddenException(e.message)
      }
    }
  }

  @Public()
  @Patch('reset-password')
  @ResponseMessage(RESET_PASSWORD)
  async resetPassword(@Query('token') token: string, @Body() resetPasswordUserDto: ResetPasswordUserDto) {
    return this.usersService.resetPassword(token, resetPasswordUserDto.password);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    const ability = this.caslAbilityFactory.createForUser(user)
    try {
      const userToUpd = new UserSubject()
      userToUpd._id = id
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, userToUpd)
      return this.usersService.update(id, updateUserDto);
    } catch (e) {
      if (e instanceof ForbiddenError) {
        throw new ForbiddenException(e.message)
      }
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    const ability = this.caslAbilityFactory.createForUser(user)
    try {
      const userToDel = new UserSubject()
      userToDel._id = id
      ForbiddenError.from(ability).throwUnlessCan(Action.Delete, userToDel)
      return this.usersService.remove(id);
    } catch (e) {
      if (e instanceof ForbiddenError) {
        throw new ForbiddenException(e.message)
      }
    }
  }
}
