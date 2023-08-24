import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponModule } from './coupon/coupon.module';
import databaseConfig from './config/database';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(databaseConfig.uri),
    UsersModule,
    CouponModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
