import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UsersCouponDocument = HydratedDocument<UsersCoupon>;

@Schema({ timestamps: true })
export class UsersCoupon {
  _id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  idUser: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  idCoupon: string;
}

export const UsersCouponSchema = SchemaFactory.createForClass(UsersCoupon);
