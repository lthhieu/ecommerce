import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/configs/define.interface';
import { UsersService } from 'src/users/users.service';
import { INVALID_ID } from 'src/configs/response.constants';
import { CouponsService } from 'src/coupons/coupons.service';
import dayjs from 'dayjs'

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>,
    private usersService: UsersService,
    private couponsService: CouponsService) { }

  async create(createOrderDto: CreateOrderDto, user: IUser) {
    const { coupon } = createOrderDto
    if (!mongoose.Types.ObjectId.isValid(coupon) && coupon) {
      throw new BadRequestException(INVALID_ID)
    }
    let discount = 0
    if (!coupon) discount = 0
    else {
      const couponInfo = await this.couponsService.findOne(coupon)
      if (dayjs().isAfter(couponInfo.expire)) {
        throw new BadRequestException('Coupon Is Expired. Please try another or delete coupon')
      }
      discount = couponInfo.discount
    }
    const { cart, ...userInfo } = (await this.usersService.findOne(user._id))

    const totalPrice = Math.round(cart.reduce((sum, item) => sum + +item.product.price * +item.quantity, 0) * (100 - discount) / 100);

    const products = cart.map(item => ({
      //@ts-ignore
      product: item.product._id,
      quantity: item.quantity,
      color: item.color
    }))

    let createNewOrder = await this.orderModel.create({
      coupon, orderBy: user._id, totalPrice, products
    })
    return {
      _id: createNewOrder._id
    }
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
