import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, MinLength, ValidateNested } from "class-validator";
import mongoose from "mongoose";

// Data Transfer Object là nơi biến đổi dữ liệu nhận vào
// class = Object
class Company {
    @IsNotEmpty({message: 'Id công ty không được để trống'})
    _id: string;

    @IsString({message: 'Tên công ty không hợp lệ'})
    @IsNotEmpty({message: 'Tên công ty không được để trống'})
    name: string;

    @IsNotEmpty({message: ' Logo công ty không được để trống'})
    logo: string;
    
}
// NestJS không hỗ trợ Object trong @Body, chỉ hỗ trợ class nên phải định nghĩa class Company
export class CreateJobDto {
    @IsNotEmpty({message: 'Tên công việc không được để trống'})
    name: string;

    @IsArray({message: 'Kỹ năng có định dạng là array'})
    @IsNotEmpty({message: 'Kỹ năng không được để trống'})
    @IsString({each:true, message: 'Kỹ năng phải là string'})
    skills: string[];

    @IsNotEmpty({message: ' Công ty không được để trống'})
    @ValidateNested()
    @Type(() => Company)
    company: Company;
    
   
    @IsNotEmpty({message: 'Địa chỉ không được để trống'})
    location: string;

    @IsNumber({},{message: 'Lương không hợp lệ'})
    @IsNotEmpty({message: 'Lương không được để trống'})
    salary: number;

    @IsNumber({},{message: 'Số lượng không hợp lệ'})
    @IsNotEmpty({message: 'Số lượng không được để trống'})
    @Type(() => Number)
    quantity: number;

    
    @IsNotEmpty({message: 'Level không được để trống'})
    level: string;

    @IsString({message: 'Mô tả không hợp lệ'})
    @IsNotEmpty({message: 'Mô tả không được để trống'})
    description: string;

    
    @IsDate({message: 'Ngày bắt đầu không hợp lệ'})
    @IsNotEmpty({message: 'Ngày bắt đầu không được để trống'})
    @Transform(({value}) => new Date(value))
    startDate: Date;

    @IsDate({message: 'Ngày kết thúc không hợp lệ'})
    @IsNotEmpty({message: 'Ngày kết thúc không được để trống'})
    @Transform(({value}) => new Date(value))
    endDate: Date;

    @IsBoolean({message: 'Trạng thái không hợp lệ'})
    @IsNotEmpty({message: 'Trạng thái không được để trống'})
    @Type(() => Boolean)
    isActive: boolean;
}
