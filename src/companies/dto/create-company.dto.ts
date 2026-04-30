import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

// Data Transfer Object là nơi biến đổi dữ liệu nhận vào
// class = Object
export class CreateCompanyDto {
    
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;


    @IsString({message: 'address không hợp lệ'})
    @IsNotEmpty({message: 'address không được để trống' })
    address: string;

    @IsString({message: 'description không hợp lệ'})
    @IsNotEmpty({message: 'description không được để trống'})
    description: string;

    
    
}
