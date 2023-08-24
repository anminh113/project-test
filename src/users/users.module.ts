import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../schemas/users.schema';
import { UsersCoupon, UsersCouponSchema } from '../schemas/users-coupon.schema';
import { Coupon, CouponSchema } from '../schemas/coupon.schema';
import { CouponService } from '../coupon/coupon.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
    MongooseModule.forFeature([
      { name: UsersCoupon.name, schema: UsersCouponSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, CouponService],
})
export class UsersModule {}
