import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, ForbiddenException, Res, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordUserDto, UpdateCartDto, UpdateUserDto } from './dto/update-user.dto';
import { CheckPolicies, Public, ResponseMessage, User } from 'src/configs/custom.decorator';
import { CONFIRM_EMAIL, RESET_PASSWORD, USER_CREATED, USER_DELETED, USER_FETCH_ALL, USER_FETCH_BY_ID, USER_UPDATED, USER_UPDATED_CART } from 'src/configs/response.constants';
import { Action, IUser } from 'src/configs/define.interface';
import { UserSubject } from 'src/configs/define.class';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';
import { Request, Response } from 'express';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory) { }

  @Public()
  @Post()
  @ResponseMessage(CONFIRM_EMAIL)
  create(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    return this.usersService.create(createUserDto, response);
  }

  @Public()
  @Post('/confirm-email')
  @ResponseMessage(USER_CREATED)
  confirmCreate(@Req() request: Request, @Query('token') token: string, @Res({ passthrough: true }) response: Response) {
    return this.usersService.confirmCreate(request, token, response);
  }

  @Get()
  @ResponseMessage(USER_FETCH_ALL)
  @CheckPolicies({ action: Action.ReadAll, subject: UserSubject })
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() qs: string) {
    return this.usersService.findAll(+current, +pageSize, qs);
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

  @Patch('cart/:id')
  @ResponseMessage(USER_UPDATED_CART)
  updateCart(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto, @User() user: IUser) {
    const ability = this.caslAbilityFactory.createForUser(user)
    try {
      const userToUpd = new UserSubject()
      userToUpd._id = id
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, userToUpd)
      return this.usersService.updateCart(id, updateCartDto);
    } catch (e) {
      if (e instanceof ForbiddenError) {
        throw new ForbiddenException(e.message)
      }
    }
  }

  @Patch(':id')
  @ResponseMessage(USER_UPDATED)
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
  @ResponseMessage(USER_DELETED)
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
