import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Permission } from '../../permissions/schemas/permission.schema';




export type RoleDocument = HydratedDocument<Role>;

@Schema({timestamps:true})//timestamps:true => tự động tạo createdAt và updatedAt
export class Role {
 @Prop()
 name: string;
 
 @Prop()
 description: string;
 
 @Prop()
 isActive: boolean;
 
 @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
 permissions: Permission[];

 @Prop()
     createdAt: Date;
   
     @Prop()
     updatedAt: Date;
   
     @Prop()
     deletedAt: boolean;
   
     @Prop()
     isDeleted: boolean;
     
              
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

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.plugin(softDeletePlugin);// gắn plugin vào schema để sử dụng tính năng xóa mềm 

