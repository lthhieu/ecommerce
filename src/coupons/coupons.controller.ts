import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CheckPolicies, Public, ResponseMessage } from 'src/configs/custom.decorator';
import { COUPON_CREATED, COUPON_DELETED, COUPON_FETCH_ALL, COUPON_FETCH_BY_ID, COUPON_UPDATED } from 'src/configs/response.constants';
import { Action } from 'src/configs/define.interface';
import { CouponSubject } from 'src/configs/define.class';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) { }

  @Post()
  @ResponseMessage(COUPON_CREATED)
  @CheckPolicies({ action: Action.Create, subject: CouponSubject })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @Get()
  @ResponseMessage(COUPON_FETCH_ALL)
  @Public()
  findAll() {
    return this.couponsService.findAll();
  }

  @Get(':id')
  @ResponseMessage(COUPON_FETCH_BY_ID)
  @Public()
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage(COUPON_UPDATED)
  @CheckPolicies({ action: Action.Update, subject: CouponSubject })
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponsService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @ResponseMessage(COUPON_DELETED)
  @CheckPolicies({ action: Action.Delete, subject: CouponSubject })
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
