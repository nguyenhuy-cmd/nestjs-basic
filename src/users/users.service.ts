import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {
  constructor(@InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>) { }

  hashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt)
    return hash;
  }// hàm băm mật khẩu
  async create(createUserDto: CreateUserDto, user: IUser) {
    const hashPassword = this.hashPassword(createUserDto.password)// băm mật khẩu
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newUser;
  }

  async register(registerDto: RegisterUserDto) {
    const hashPassword = this.hashPassword(registerDto.password)// băm mật khẩu

    // Check email đã tồn tại chưa
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new BadRequestException(`Email ${registerDto.email} đã tồn tại`)
    }

    const user = await this.userModel.create({
      ...registerDto,
      password: hashPassword,
      role: "USER" // Gán mặc định role là USER khi khách hàng tự đăng ký
    })
    return user;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const {filter, sort, population} = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * (+limit);
    const defaultLimit = +limit ? +limit : 10;
    
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .select('-password')// bỏ qua password
    .populate(population)
    .exec();

    return {
      meta: {
        current: currentPage, // trang hiện tại
        pageSize: defaultLimit, // số lượng user trên mỗi trang
        pages: totalPages, // tổng số trang
        total: totalItems, // tổng các bản ghi
      },
      result// kết quả trả về
    }

    

    
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "Không tìm thấy user";
    }
    return this.userModel.findOne({_id: id}).select('-password');// select() để bỏ qua password
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({email: username});
  }

  isValidPassword(password: string, hash: string){
    return compareSync(password, hash); //   
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "Không tìm thấy user";
    }
    await this.userModel.softDelete(
      { _id: id },
    );
    return this.userModel.softDelete(
      { _id: id }, 
    )  ;
  } 
  
  async updateUserToken (refreshToken:string, _id:string){
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken
      });
  }

async findUserByToken (refreshToken:string){
    return await this.userModel.findOne(
      { refreshToken }
    );
  }
  
}
