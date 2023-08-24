import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon } from '../schemas/coupon.schema';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}

  async createCoupon(couponCode: string, point: number): Promise<Coupon> {
    const createdCoupon = new this.couponModel({ couponCode, point });
    return createdCoupon.save();
  }
  async findOneCoupon(couponCode: string): Promise<Coupon> {
    const coupon = await this.couponModel
      .findOne({ couponCode: couponCode, received: false })
      .exec();
    return coupon;
  }

  async insertManyCoupon(count: number, point: number): Promise<any> {
    const recordsToCreate = [];
    for (let i = 0; i < count; i++) {
      const record = {
        point: point,
        couponCode: (Math.random() + 1).toString(36).substring(7).toUpperCase(),
        received: false,
      };
      recordsToCreate.push(record);
    }
    const coupon = await this.couponModel.insertMany(recordsToCreate);
    return coupon;
  }

  async findAllCoupon(): Promise<Coupon[]> {
    return this.couponModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  update(id: number) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
