import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';


export type JobDocument = HydratedDocument<Job>;

@Schema({timestamps:true})//timestamps:true => tự động tạo createdAt và updatedAt
export class Job {
  @Prop()
  name: string;

  @Prop()
  skills: string[];
  
  @Prop({
type:Object
  })
  company: {
    _id: mongoose.Schema.Types.ObjectId,
    name: string
  }

  @Prop()
  location: string;

  @Prop()
  salary: string;

  @Prop()
  quantity: number;

  @Prop()
  level: string;

  @Prop()
  description: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  isActive: boolean;

    @Prop()
    createdAt: Date;
  
    @Prop()
    updatedAt: Date;
  
    @Prop()
    deletedAt: boolean;
  
    @Prop({type: Object})
    deletedBy: {
       _id : mongoose.Schema.Types.ObjectId,
      email : string,
      logo : string,
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

export const JobSchema = SchemaFactory.createForClass(Job);
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';// dùng để xóa mềm (soft delete) 
JobSchema.plugin(softDeletePlugin);// gắn plugin vào schema để sử dụng tính năng xóa mềm 
