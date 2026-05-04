import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string

    @IsNotEmpty({message: 'userId không được để trống'})
    userId: string

    @IsNotEmpty({message: 'url không được để trống'})
    url: string

    @IsNotEmpty({message: 'jobId không được để trống'})
    status: string

    @IsNotEmpty({message: 'companyId không được để trống'})
    companyId: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({message: 'jobId không được để trống'})
    jobId: mongoose.Schema.Types.ObjectId
}

export class CreateUserCvDto {
    @IsNotEmpty({message: 'Không tìm thấy cv để up'})
    url: string

    @IsNotEmpty({message: 'Không tìm thấy job id để up'})
    @IsMongoId({message: 'jobId không hợp lệ'})
    jobId: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({message: 'Không tìm thấy company id để up'})
    @IsMongoId({message: 'companyId không hợp lệ'})
    companyId: mongoose.Schema.Types.ObjectId
}