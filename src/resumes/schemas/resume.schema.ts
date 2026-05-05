import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Job } from 'src/jobs/schemas/job.schema';
import { Company } from 'src/companies/schemas/company.schema';
import { User } from 'src/users/schemas/user.schema';



export type ResumeDocument = HydratedDocument<Resume>;

@Schema({timestamps:true})//timestamps:true => tự động tạo createdAt và updatedAt
export class Resume {
@Prop()
email: string

@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
userId: mongoose.Schema.Types.ObjectId


@Prop()
url: string

@Prop()
status: string // PENDING-REVIEWING-APPROVED-REJECTED

//@Prop()
//companyId: mongoose.Schema.Types.ObjectId
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })// ref: Company.name : gúp ta có thể nhìn thấy không chỉ id mà còn tên công ty 
companyId: mongoose.Schema.Types.ObjectId

@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Job.name })// ref: Job.name : để tham chiếu đến Job schema
jobId: mongoose.Schema.Types.ObjectId

@Prop({type: mongoose.Schema.Types.Array })
history: {
    status:string;
    updatedAt:Date;
    updateBy:{
        _id:mongoose.Schema.Types.ObjectId,
        email:string
    }
}[]

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

export const ResumeSchema = SchemaFactory.createForClass(Resume);
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';// dùng để xóa mềm (soft delete) 
ResumeSchema.plugin(softDeletePlugin);// gắn plugin vào schema để sử dụng tính năng xóa mềm 
