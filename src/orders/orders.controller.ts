import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CheckPolicies, ResponseMessage, User } from 'src/configs/custom.decorator';
import { Action, IUser } from 'src/configs/define.interface';
import { ORDER_CREATED, ORDER_UPDATED } from 'src/configs/response.constants';
import { OrderSubject } from 'src/configs/define.class';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ResponseMessage(ORDER_CREATED)
  @CheckPolicies({ action: Action.Create, subject: OrderSubject })
  create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies({ action: Action.Update, subject: OrderSubject })
  @ResponseMessage(ORDER_UPDATED)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
