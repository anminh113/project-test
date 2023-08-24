import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import config from '../config/config';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Cron(CronExpression.EVERY_DAY_AT_6PM)
  handleCron() {
    this.couponService.insertManyCoupon(
      config.numberCouponCreate,
      config.pointCouponCreate,
    );
    return 'The Coupons created!';
  }

  @Post()
  async create(
    @Body('couponCode') couponCode: string,
    @Body('point') point: number,
  ) {
    const createCoupon = await this.couponService.createCoupon(
      couponCode,
      point,
    );
    if (createCoupon === undefined) {
      throw new BadRequestException();
    }
    return {
      couponCode: createCoupon.couponCode,
      point: createCoupon.point,
      received: createCoupon.received,
    };
  }
}
