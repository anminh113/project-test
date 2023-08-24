import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  _id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  point: number;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
