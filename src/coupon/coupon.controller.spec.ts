import { Test, TestingModule } from '@nestjs/testing';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../schemas/users.schema';
import { UsersCoupon, UsersCouponSchema } from '../schemas/users-coupon.schema';
import { Coupon, CouponSchema } from '../schemas/coupon.schema';
import databaseConfig from '../config/database';
import { Model } from 'mongoose';

describe('CouponController', () => {
  let couponController: CouponController;
  let service: CouponService;
  let couponModel: Model<Coupon>;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(databaseConfig.uri),
        MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
        MongooseModule.forFeature([
          { name: Coupon.name, schema: CouponSchema },
        ]),
        MongooseModule.forFeature([
          { name: UsersCoupon.name, schema: UsersCouponSchema },
        ]),
      ],
      controllers: [CouponController],
      providers: [
        CouponService,
        {
          provide: getModelToken(Coupon.name),
          useValue: Model,
        },
      ],
    }).compile();

    couponController = app.get<CouponController>(CouponController);
    service = app.get<CouponService>(CouponService);
    couponModel = app.get<Model<Coupon>>(getModelToken(Coupon.name));
  });

  describe('root', () => {
    it('should create a new item', async () => {
      const createdItem = {
        _id: 'someId',
        couponCode: 'YYYY',
        point: 100,
        received: false,
      };
      jest.spyOn(service, 'createCoupon').mockResolvedValue(createdItem);
      const result = await couponController.create('YYYY', 100);
      expect(result.couponCode).toBe('YYYY');
    });

    it('should return text `The Coupons created!`', async () => {
      const createdItem = [
        {
          couponCode: 'YYYY1',
          point: 100,
          received: false,
        },
        {
          couponCode: 'YYYY2',
          point: 100,
          received: false,
        },
      ];
      jest.spyOn(service, 'insertManyCoupon').mockResolvedValue(createdItem);
      const result = await couponController.handleCron();
      expect(result).toBe('The Coupons created!');
    });
  });
});
