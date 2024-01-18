import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './schemas/coupon.schema';
import mongoose, { Model } from 'mongoose';
import { FOUND_COUPON_TITLE, INVALID_ID, NOT_COUPON_BY_ID } from 'src/configs/response.constants';
import ms from 'ms';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) { }

  async findOneByName(name: string) {
    return await this.couponModel.findOne({ name })
  }
  async create(createCouponDto: CreateCouponDto) {
    //check title exist
    let check = await this.findOneByName(createCouponDto.name)
    if (check) {
      throw new BadRequestException(FOUND_COUPON_TITLE)
    }
    //create
    let createNewCoupon = await this.couponModel.create({
      ...createCouponDto, expire: Date.now() + +createCouponDto.expire * ms('1d')
    })
    return {
      _id: createNewCoupon._id
    }
  }

  async findAll() {
    return await this.couponModel.find()
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const coupon = await this.couponModel.findOne({ _id: id })
    if (!coupon) {
      throw new BadRequestException(NOT_COUPON_BY_ID)
    }
    return coupon
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const { name } = updateCouponDto
    const coupon = await this.findOneByName(name)
    //check unique title
    if (coupon && JSON.stringify(coupon._id) !== JSON.stringify(id)) {
      throw new BadRequestException(FOUND_COUPON_TITLE)
    }
    if (updateCouponDto?.expire) updateCouponDto.expire = Date.now() + +updateCouponDto.expire * ms('1d')
    return await this.couponModel.updateOne({ _id: id }, {
      ...updateCouponDto
    })
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    return await this.couponModel.deleteOne({ _id: id })
  }
}
