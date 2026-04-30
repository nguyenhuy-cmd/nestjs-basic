import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';


export type UserDocument = HydratedDocument<User>;

@Schema({timestamps:true})//timestamps:true => tự động tạo createdAt và updatedAt
export class User {
  @Prop({require: true})// bắt buộc phải điền
  email: string;

  @Prop({require: true})// bắt buộc phải điền
  password: string;

  @Prop()
  name: string;

  @Prop({type: Object})
  company:{
    _id: mongoose.Schema.Types.ObjectId,
    name: string
  };

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop()
  role: string;

  @Prop()
  refreshToken: string;


  @Prop()
    createdAt: Date;
  
    @Prop()
    updatedAt: Date;
  
    @Prop()
    deletedAt: boolean;
  
    @Prop({type: Object})
    deletedBy: {
       _id : mongoose.Schema.Types.ObjectId,
      email : string
    }; 
  
    @Prop({type: Object})
    createdBy: {
      _id : mongoose.Schema.Types.ObjectId,
      email : string
    };
  
    @Prop({type: Object})
    updatedBy: {
      _id : mongoose.Schema.Types.ObjectId,
      email : string
    };
}

export const UserSchema = SchemaFactory.createForClass(User);
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';// dùng để xóa mềm (soft delete) 
UserSchema.plugin(softDeletePlugin);// gắn plugin vào schema để sử dụng tính năng xóa mềm 
