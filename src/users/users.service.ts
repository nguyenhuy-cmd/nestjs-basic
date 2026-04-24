import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose/dist/src/soft-delete-model';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  hashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt)
    return hash;
  }// hàm băm mật khẩu
  async create(createUserDto: CreateUserDto) {
    
    
    const hashPassword = this.hashPassword(createUserDto.password)// băm mật khẩu
    const user = await this.userModel.create({
      email:createUserDto.email,
      password: hashPassword,
      name:createUserDto.name
    })
    return user;

  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      return "Không tìm thấy user";
    }
    return this.userModel.findOne({_id: id});
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({email: username});
  }

  isValidPassword(password: string, hash: string){
    return compareSync(password, hash); //   
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "Không tìm thấy user để update";
    }
    return await this.userModel.updateOne({ _id: id }, updateUserDto);
  }

  remove(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      return "Không tìm thấy user";
    }
    return this.userModel.softDelete({_id: id});
  }
}
