import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CheckPolicies, ResponseMessage, User } from 'src/configs/custom.decorator';
import { Action, IUser } from 'src/configs/define.interface';
import { ORDER_CREATED, ORDER_FETCH_ALL, ORDER_UPDATED } from 'src/configs/response.constants';
import { OrderSubject } from 'src/configs/define.class';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService,
    private caslAbilityFactory: CaslAbilityFactory) { }

  @Post()
  @ResponseMessage(ORDER_CREATED)
  @CheckPolicies({ action: Action.Create, subject: OrderSubject })
  create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get('by-admin')
  @CheckPolicies({ action: Action.ReadAll, subject: OrderSubject })
  @ResponseMessage(ORDER_FETCH_ALL)
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() qs: string) {
    return this.ordersService.findAll(+current, +pageSize, qs);
  }

  @Get()
  @CheckPolicies({ action: Action.Read, subject: OrderSubject })
  @ResponseMessage(ORDER_FETCH_ALL)
  findAllByUser(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() qs: string, @User() user: IUser) {
    return this.ordersService.findAllByUser(+current, +pageSize, qs, user);
  }

  @Patch(':id')
  @CheckPolicies({ action: Action.Update, subject: OrderSubject })
  @ResponseMessage(ORDER_UPDATED)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
