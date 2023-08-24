import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from '../schemas/users.schema';
import { Coupon } from '../schemas/coupon.schema';
import { UsersCoupon } from '../schemas/users-coupon.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @InjectModel(UsersCoupon.name) private usersCouponModel: Model<UsersCoupon>,
  ) {}

  private static currentDay = new Date().toISOString().slice(0, 10);

  async createUser(username: string, point: number): Promise<Users> {
    const createdUser = new this.usersModel({ username, point });
    return createdUser.save();
  }
  async findOneUser(username: string): Promise<Users> {
    const user = await this.usersModel.findOne({ username: username }).exec();
    return user;
  }
  async currentUserCoupon(idUser: string): Promise<UsersCoupon[]> {
    const currentUserCoupon = await this.usersCouponModel.find({
      idUser: idUser,
      createdAt: { $gte: UsersService.currentDay },
    });
    return currentUserCoupon;
  }
  async updateUserClamCoupon(
    userData: Users,
    couponData: Coupon,
  ): Promise<any> {
    const user = new this.usersModel(userData);
    const coupon = new this.couponModel(couponData);
    const createdUserCoupon = new this.usersCouponModel({
      idUser: user._id,
      idCoupon: coupon._id,
    });
    await user.save();
    await coupon.save();
    await createdUserCoupon.save();
    return {
      username: user.username,
      point: user.point,
    };
  }

  async findAllUser(): Promise<Users[]> {
    return this.usersModel.find().exec();
  }

  async findAllCouponCurrentDay(): Promise<Coupon[]> {
    return await this.couponModel.find({
      createdAt: { $gte: UsersService.currentDay },
      received: false,
    });
  }
}
