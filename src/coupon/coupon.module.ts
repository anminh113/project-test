import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { Coupon, CouponSchema } from '../schemas/coupon.schema';
import { MongooseModule } from '@nestjs/mongoose';
import * as usersCouponSchema from '../schemas/users-coupon.schema';
import { Users, UsersSchema } from '../schemas/users.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
    MongooseModule.forFeature([
      {
        name: usersCouponSchema.UsersCoupon.name,
        schema: usersCouponSchema.UsersCouponSchema,
      },
    ]),
  ],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
