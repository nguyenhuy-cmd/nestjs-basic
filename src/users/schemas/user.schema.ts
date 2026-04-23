import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';


export type UserDocument = HydratedDocument<User>;

@Schema()
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
}

export const UserSchema = SchemaFactory.createForClass(User);
