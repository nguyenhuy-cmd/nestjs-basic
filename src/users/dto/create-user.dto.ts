import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

// Data Transfer Object là nơi biến đổi dữ liệu nhận vào
// class = Object
export class CreateUserDto {
    @IsEmail({}, {message: 'Email không hợp lệ'})
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;

    @IsString({message: 'Password không hợp lệ'})
    @MinLength(6,{message: 'Password phải có ít nhất 6 ký tự'})
    password: string;

    @IsString({message: 'Name không hợp lệ'})
    name: string;

    @IsString({message: 'Address không hợp lệ'})
    address: string;
    
}
