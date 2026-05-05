import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { IUser } from 'src/users/users.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>
  ) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const {name, apiPath, method, module}= createPermissionDto;
    const isExist = await this.permissionModel.findOne({apiPath, method})
    if(isExist){
      throw new BadRequestException(` Quyền đã tồn tại`)
    }
    const newPermission = await this.permissionModel.create({
      name, 
      apiPath,
      method,
      module,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newPermission?._id,
      createdAt: newPermission?.createdAt,
    };
  };

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current
    delete filter.pageSize
    
    const offset = (current - 1) * pageSize;
    const defaultLimit = +pageSize ? +pageSize :10; 

    const totalItems = (await this.permissionModel.find(filter)).length
    const totalPages = Math.ceil(totalItems/defaultLimit)
    
    const permissions = await this.permissionModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .populate(population)
    .select(projection as any)
    .exec();

    return {
      meta: {
        current: current,// trang hiện tại
        pageSize: pageSize,// số lượng phần tử trên 1 trang
        total: totalItems,// tổng số phần tử
        totalPages: totalPages// tổng số trang
      },
      result: permissions
    }
    
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(` Không tìm thấy quyền`)
    }
    return await this.permissionModel.findById(id);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
     if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new BadRequestException(` Không tìm thấy quyền`)
        }
        const {name, apiPath, method, module}= updatePermissionDto;
        const update = await this.permissionModel.updateOne(
          {_id: id},
          {
            name,
            apiPath,
            method,
            module,
            updatedBy: {
              _id: user._id,
              email: user.email
            }
          }
        )
        return update
  }

  async remove(id: string, user: IUser) {
   await this.permissionModel.softDelete({
    _id: id, 
    deletedBy: {
      _id: user._id,
      email: user.email
    }
   })
   return this.permissionModel.softDelete({_id: id})
  }
}
