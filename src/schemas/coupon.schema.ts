import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  _id: string;

  @Prop({ required: true })
  couponCode: string;

  @Prop({ required: true })
  point: number;

  @Prop({ required: true, default: false })
  received: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
