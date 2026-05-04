import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateJobDto {
    @IsString({ message: 'Mô tả không hợp lệ' })
    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    description: string;
}
