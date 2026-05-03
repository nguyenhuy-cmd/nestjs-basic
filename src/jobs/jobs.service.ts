import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import  mongoose, { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {

  constructor(
    @InjectModel(Job.name) 
    private readonly jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    const {
      name, skills, company, salary, quantity,
      level, description, startDate, endDate,
      isActive
    } = createJobDto
    
    const newJob = await this.jobModel.create({
      name, skills, company, salary, quantity,
level, description, startDate, endDate,
isActive,
createdBy: {
  _id: user._id,
  email: user.email
}
})

return {
  _id: newJob?._id,
  createdAt: newJob?.createdAt
}
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);

    // Dọn dẹp filter để không bị lẫn tham số phân trang vào query database
    delete filter.current;
    delete filter.pageSize;

    let current = +currentPage || 1;
    let defaultLimit = +limit || 10;
    let offset = (current - 1) * defaultLimit;

    // Sử dụng countDocuments để tối ưu hiệu năng (Database tự đếm)
    const totalItems = await this.jobModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: current,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems
      },
      result
    }
  }

  findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      return 'Không tìm thấy công việc'
    }
    return this.jobModel.findOne({ _id: id });
  }

async update(_id: string, updateJobDto: UpdateJobDto, user: IUser) {  
     const updated = await this.jobModel.updateOne({
      _id
    },
    {
      ...updateJobDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    }
  );
  return updated;
  }

  async remove(_id: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(_id)){
      return 'Không tìm thấy công việc'
    }
    await this.jobModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return this.jobModel.softDelete({ _id });
    
  }
}
