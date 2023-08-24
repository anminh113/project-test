import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CouponService } from '../coupon/coupon.service';
import config from '../config/config';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly couponService: CouponService,
  ) {}

  @Post()
  async create(
    @Body('username') username: string,
    @Body('point') point: number,
  ) {
    const createUser = await this.usersService.createUser(username, point);
    if (createUser === undefined) {
      throw new BadRequestException();
    }
    return {
      username: createUser.username,
      point: createUser.point,
    };
  }

  @Post('/clam-coupon')
  async clamCoupon(
    @Body('username') username: string,
    @Body('couponCode') couponCode: string,
  ) {
    const user = await this.usersService.findOneUser(username);
    const coupon = await this.couponService.findOneCoupon(couponCode);
    if (!user || !coupon) return undefined;
    const currentUserCoupon = await this.usersService.currentUserCoupon(
      user._id,
    );
    if (currentUserCoupon.length >= config.maxClamCouponInDay) return undefined;
    user.point = user.point + coupon.point;
    coupon.received = true;
    const saveData = await this.usersService.updateUserClamCoupon(user, coupon);
    // function send email
    if (saveData === undefined) {
      throw new BadRequestException();
    }
    return saveData;
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAllUser();
    if (users === undefined) {
      throw new BadRequestException();
    }
    return users;
  }

  @Get('/get-coupon-current-day')
  async findAllCouponCurrentDay() {
    const getCoupon = await this.usersService.findAllCouponCurrentDay();
    if (getCoupon === undefined) {
      throw new BadRequestException();
    }
    return getCoupon;
  }
}
