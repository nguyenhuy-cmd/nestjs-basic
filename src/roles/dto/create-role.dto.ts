import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsNotEmpty({message: 'Description không được để trống'})
    description: string;

    @IsNotEmpty({message: 'isActive không được để trống'})
    @IsBoolean()
    isActive: boolean;

    @IsNotEmpty({message: 'permissions không được để trống'})
    @IsMongoId({each : true, message : 'permission phải là id hợp lệ'})
    @IsArray({message : 'permissions phải là mảng'})
    permissions: mongoose.Schema.Types.ObjectId[];
}
