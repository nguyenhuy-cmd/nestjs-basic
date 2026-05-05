import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: SoftDeleteModel<RoleDocument>  
  ) {}
  async create(createRoleDto: CreateRoleDto, user:IUser) {
    const {name, description, isActive, permissions} = createRoleDto
    const isExit= await this.roleModel.findOne({name})
    
    if(isExit){
      throw new BadRequestException("Quyền đã tồn tại")
    }

    const newRole = await this.roleModel.create({
      name,
      description,
      isActive,
      permissions,
      createdBy: {
        _id : user._id,
        email: user.email
      }
    })
    return {
      id: newRole?._id,
      createdAt: newRole?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const {filter, sort, population, projection} = aqp(qs)

    delete filter.current // xoá current trong filter
    delete filter.pageSize // xoá limit trong filter

    
    const offset = (currentPage - 1) * limit;
    const defaultLimit = +limit ? +limit :10;

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems/defaultLimit);

    const result = await this.roleModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .populate(population)
    .select(projection as any)
    .exec();
    return {
    meta: {
      current: currentPage,// trang hiện tại
      pageSize: limit,// số lượng phần tử trên 1 trang
      total: totalItems,// tổng số phần tử
      totalPages: totalPages// tổng số trang
      
    } ,
    result: result
  }
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(` Không tìm thấy quyền`)
    }
    return this.roleModel.findById(id).populate({ path: "permissions", select: { _id: 1, name: 1, apiPath:1, method: 1,module:1}});
  }

  async update(id: string, updateRoleDto: UpdateRoleDto,user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(` Không tìm thấy quyền`)
    }
    const {name, description, isActive, permissions} = updateRoleDto
    const updateRole= await this.roleModel.updateOne(
      {_id:id},{
      name,
      description,
      isActive,
      permissions,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return updateRole
  }

  async remove(id: string, user: IUser) {
    const foundRole = await this.roleModel.findById(id)
    if(foundRole.name === "ADMIN"){
      throw new BadRequestException(`ADMIN không thể xóa`)
    }
    await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.roleModel.softDelete({
      _id: id
    })
  }
}
