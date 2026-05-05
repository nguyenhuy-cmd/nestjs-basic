import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';


export type PermissionDocument = HydratedDocument<Permission>;

@Schema({timestamps:true})//timestamps:true => tự động tạo createdAt và updatedAt
export class Permission {
  @Prop()
  name: string;

  @Prop()
  apiPath: string;

  @Prop()
  method: string;

  @Prop()
  module: string;// thuộc modules nào? 
  
  @Prop()
  createdAt: Date
  @Prop()
  updatedAt: Date
  @Prop()
  deletedAt: Date
  @Prop()
  isDeleted: boolean
  @Prop({ type: Object })
  createdBy: { _id: mongoose.Schema.Types.ObjectId, email: string }
  @Prop({ type: Object })
  updatedBy: { _id: mongoose.Schema.Types.ObjectId, email: string }
  @Prop({ type: Object })
  deletedBy: { _id: mongoose.Schema.Types.ObjectId, email: string }
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';// dùng để xóa mềm (soft delete) 
PermissionSchema.plugin(softDeletePlugin);// gắn plugin vào schema để sử dụng tính năng xóa mềm 
