import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';


class updateBy {
    @IsNotEmpty({ message: 'Không tìm thấy userId để update' })
    _id: Types.ObjectId;

    @IsNotEmpty({ message: 'Không tìm thấy email để update' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;    
}

class History {
    @IsNotEmpty({ message: 'Không tìm thấy trạng thái để update' })
    status: string;

    @IsNotEmpty({ message: 'Không tìm thấy thời gian để update' })
    updatedAt: Date;       

    @ValidateNested()
    @Type(() => updateBy)
    @IsNotEmpty({ message: 'Không tìm thấy người update' })
    updateBy: updateBy;  
}
export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    @IsNotEmpty({ message: 'Không tìm thấy history để update' })
    @IsArray({message: 'History phải là một mảng'})
    @ValidateNested()
    @Type(() => History)
    history: History[];
}