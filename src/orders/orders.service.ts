import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/configs/define.interface';
import { UsersService } from 'src/users/users.service';
import { COUPON_EXPIRED, INVALID_ID, NOT_ORDER_BY_ID } from 'src/configs/response.constants';
import { CouponsService } from 'src/coupons/coupons.service';
import dayjs from 'dayjs'
import aqp from 'api-query-params';

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
        throw new BadRequestException(COUPON_EXPIRED)
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

  async findAll(page: number, limit: number, qs: string) {
    let { filter, projection, population } = aqp(qs);
    let { sort }: { sort: any } = aqp(qs);

    delete filter.current
    delete filter.pageSize

    page = page ? page : 1
    limit = limit ? limit : 10
    let skip = (page - 1) * limit

    const totalItems = (await this.orderModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / limit)

    if (!sort) {
      sort = '-updatedAt'
    }

    let orders = await this.orderModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population)
      .exec();
    return {
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result: orders
    }
  }

  async findAllByUser(page: number, limit: number, qs: string, user: IUser) {
    let { filter, projection, population } = aqp(qs);
    let { sort }: { sort: any } = aqp(qs);

    delete filter.current
    delete filter.pageSize

    page = page ? page : 1
    limit = limit ? limit : 10
    let skip = (page - 1) * limit

    const totalItems = (await this.orderModel.find({ ...filter, orderBy: user._id })).length
    const totalPages = Math.ceil(totalItems / limit)

    if (!sort) {
      sort = '-updatedAt'
    }

    let orders = await this.orderModel.find({ ...filter, orderBy: user._id })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population)
      .exec();
    return {
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result: orders
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    return await this.orderModel.updateOne({ _id: id }, {
      status: updateOrderDto.status
    })
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
