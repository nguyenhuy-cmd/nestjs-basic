import { Type } from "class-transformer";
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, MinLength, ValidateNested } from "class-validator";
import mongoose from "mongoose";

// Data Transfer Object là nơi biến đổi dữ liệu nhận vào
// class = Object

// NestJS không hỗ trợ Object trong @Body, chỉ hỗ trợ class nên phải định nghĩa class Company
export class Company{
    @IsNotEmpty({message: 'Company ID không được để trống'})
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: 'Company Name không được để trống'})
    name: string;
    

}

export class CreateUserDto {
    @IsString({message: 'Name không hợp lệ'})
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;
    
    @IsEmail({}, {message: 'Email không hợp lệ'})
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;

    @IsString({message: 'Password không hợp lệ'})
    @MinLength(6,{message: 'Password phải có ít nhất 6 ký tự'})
    @IsNotEmpty({message: 'Password không được để trống'})
    password: string;

    @IsNumber({},{message: 'Age không hợp lệ'})
    @IsNotEmpty({message: 'Age không được để trống'})
    age: number;

    @IsString({message: 'Gender không hợp lệ'})
    @IsNotEmpty({message: 'Gender không được để trống'})
    gender: string;
    
    @IsString({message: 'Address không hợp lệ'})
    @IsNotEmpty({message: 'Address không được để trống'})
    address: string;

    @IsNotEmpty({message: 'Role không được để trống'})
    @IsMongoId({message: 'Role ID không hợp lệ'})
    role: mongoose.Schema.Types.ObjectId;
    
    // để validate nestjs
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company!: Company;
}

export class RegisterUserDto {
    @IsString({message: 'Name không hợp lệ'})
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;
    
    @IsEmail({}, {message: 'Email không hợp lệ'})
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;

    @IsString({message: 'Password không hợp lệ'})
    @MinLength(6,{message: 'Password phải có ít nhất 6 ký tự'})
    @IsNotEmpty({message: 'Password không được để trống'})
    password: string;

    @IsNumber({},{message: 'Age không hợp lệ'})
    @IsNotEmpty({message: 'Age không được để trống'})
    @Type(() => Number)// tự động ép kiểu dữ liệu (ví dụ: string -> number)
    age: number;

    @IsString({message: 'Gender không hợp lệ'})
    @IsNotEmpty({message: 'Gender không được để trống'})
    gender: string;
    
    @IsString({message: 'Address không hợp lệ'})
    @IsNotEmpty({message: 'Address không được để trống'})
    address: string;
    
}
 