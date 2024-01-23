import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CheckPolicies, ResponseMessage, User } from 'src/configs/custom.decorator';
import { Action, IUser } from 'src/configs/define.interface';
import { ORDER_CREATED, ORDER_FETCH_ALL, ORDER_FETCH_BY_ID, ORDER_UPDATED } from 'src/configs/response.constants';
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

  @Get()
  @CheckPolicies({ action: Action.ReadAll, subject: OrderSubject })
  @ResponseMessage(ORDER_FETCH_ALL)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ResponseMessage(ORDER_FETCH_BY_ID)
  async findOne(@Param('id') id: string, @User() user: IUser) {
    const ability = this.caslAbilityFactory.createForUser(user)
    const orderInfo = await this.ordersService.returnID(id)
    try {
      const orderToRead = new OrderSubject()
      orderToRead.orderBy = orderInfo.orderBy.toString()
      ForbiddenError.from(ability).throwUnlessCan(Action.Read, orderToRead)
      return this.ordersService.findOne(id);
    } catch (e) {
      if (e instanceof ForbiddenError) {
        throw new ForbiddenException(e.message)
      }
    }
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
