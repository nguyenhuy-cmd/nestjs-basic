import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public,ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) { // @Body() = req.body
  //   console.log('>>>>debug')
  //   return this.usersService.create(createUserDto );
    
  // }

  @ResponseMessage('Lấy danh sách tất cả các user')
  @Get()
  findAll(
    @Query("page") currentPage: string,
    @Query("limit") limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage("Lấy thông tin user thành công")
  async findOne(@Param('id') id: string) {// = const id = req.params.id
    const foundUser = await this.usersService.findOne(id);
    return foundUser;
  }

  @Delete(':id')
  @ResponseMessage("Xóa user thành công")
  remove(@Param('id') id: string, @User() user:IUser) {
    return this.usersService.remove(id, user);
  }

  @Post()
  @ResponseMessage("Tạo người dùng thành công")
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser){
    const newUser = await this.usersService.create(createUserDto,user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  @ResponseMessage("Bạn đã cập nhật user thành công")
  @Patch()
  async update(@Body() updateDto: UpdateUserDto, @User() user:IUser){
    const updatedUser = await this.usersService.update(updateDto, user);
    return updatedUser;
  }

}
