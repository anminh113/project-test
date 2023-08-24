import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../schemas/users.schema';
import { UsersCoupon, UsersCouponSchema } from '../schemas/users-coupon.schema';
import { Coupon, CouponSchema } from '../schemas/coupon.schema';
import databaseConfig from '../config/database';
import { Model } from 'mongoose';
import { CouponService } from '../coupon/coupon.service';

describe('CouponController', () => {
  let usersController: UsersController;
  let usersModel: Model<Users>;
  let usersCouponModel: Model<UsersCoupon>;
  let usersService: UsersService;
  let couponService: CouponService;
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
      controllers: [UsersController],
      providers: [
        UsersService,
        CouponService,
        {
          provide: getModelToken(Users.name),
          useValue: Model,
        },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersModel = app.get<Model<Users>>(getModelToken(Users.name));
    usersCouponModel = app.get<Model<UsersCoupon>>(
      getModelToken(UsersCoupon.name),
    );
    usersService = app.get<UsersService>(UsersService);
    couponService = app.get<CouponService>(CouponService);
  });

  describe('root', () => {
    it('should return user created ', async () => {
      const createdItem = {
        _id: 'someId',
        username: 'userTest',
        point: 100,
      };
      jest.spyOn(usersService, 'createUser').mockResolvedValue(createdItem);
      const result = await usersController.create('userTest', 100);
      expect(result.username).toBe('userTest');
    });
    it('should return findAll user', async () => {
      const arrayItem: Users[] = [
        {
          _id: 'someID1',
          username: 'userTest1',
          point: 100,
        },
        {
          _id: 'someID2',
          username: 'userTest2',
          point: 200,
        },
      ];
      jest.spyOn(usersService, 'findAllUser').mockResolvedValue(arrayItem);
      const result = await usersController.findAll();
      expect(result.length).toBeGreaterThan(1);
    });
    it('should return findAllCouponCurrentDay', async () => {
      const arrayItem: Coupon[] = [
        {
          _id: 'someID1',
          couponCode: 'couponCode1',
          point: 100,
          received: false,
        },
        {
          _id: 'someID2',
          couponCode: 'couponCode2',
          point: 200,
          received: false,
        },
      ];
      jest
        .spyOn(usersService, 'findAllCouponCurrentDay')
        .mockResolvedValue(arrayItem);
      const result = await usersController.findAllCouponCurrentDay();
      expect(result.length).toBeGreaterThan(1);
    });
    it('should return clamCoupon', async () => {
      const findOneUserItem: Users = {
        _id: 'someUserID1',
        username: 'username1',
        point: 100,
      };
      const findOneCouponItem: Coupon = {
        _id: 'someCouponID1',
        couponCode: 'couponCode1',
        point: 100,
        received: false,
      };
      const findOneUserCouponItem: UsersCoupon[] = [
        {
          _id: 'someCouponID1',
          idUser: 'someUserID1',
          idCoupon: 'someCouponID1',
        },
      ];
      const updateUserClamCoupon = {
        username: 'username1',
        point: 200,
      };
      jest
        .spyOn(usersService, 'findOneUser')
        .mockResolvedValue(findOneUserItem);
      jest
        .spyOn(couponService, 'findOneCoupon')
        .mockResolvedValue(findOneCouponItem);
      jest
        .spyOn(usersService, 'currentUserCoupon')
        .mockResolvedValue(findOneUserCouponItem);
      jest
        .spyOn(usersService, 'updateUserClamCoupon')
        .mockResolvedValue(updateUserClamCoupon);

      const result = await usersController.clamCoupon(
        'username1',
        'couponCode1',
      );
      expect(result).toBe(updateUserClamCoupon);
    });
  });
});
