import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';


export type UserDocument = HydratedDocument<User>;

@Schema({timestamps:true})//timestamps:true => tự động tạo createdAt và updatedAt
export class User {
  @Prop({require: true})// bắt buộc phải điền
  email: string;

  @Prop({require: true})// bắt buộc phải điền
  password: string;

  @Prop()
  name: string;

  @Prop()
  phone: number;

  @Prop()
  age: number;

  @Prop()
  address: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: boolean;

  @Prop()
  deletedBy: boolean; 
}

export const UserSchema = SchemaFactory.createForClass(User);
