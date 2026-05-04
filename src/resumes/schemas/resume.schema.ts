import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId} from 'mongoose';


export type JobDocument = HydratedDocument<Resume>;

@Schema({timestamps:true})//timestamps:true => tự động tạo createdAt và updatedAt
export class Resume {
    @Prop()
email: string
@Prop()
userId: ObjectId
@Prop()
url: string
@Prop()
status: string // PENDING-REVIEWING-APPROVED-REJECTED
@Prop()
companyId: mongoose.Schema.Types.ObjectId
@Prop()
jobId: mongoose.Schema.Types.ObjectId
@Prop({type: mongoose.Schema.Types.Array })
history: {
    status:string;
    updateAt:Date;
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
@Prop()
createdBy: { _id: mongoose.Schema.Types.ObjectId, email: string }
@Prop()
updatedBy: { _id: mongoose.Schema.Types.ObjectId, email: string }
@Prop()
deletedBy: { _id: mongoose.Schema.Types.ObjectId, email: string }
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';// dùng để xóa mềm (soft delete) 
ResumeSchema.plugin(softDeletePlugin);// gắn plugin vào schema để sử dụng tính năng xóa mềm 
