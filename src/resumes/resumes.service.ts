import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>
  ) { }
  async create(createResumeDto: CreateResumeDto, user: IUser) {
    const { url, companyId, jobId } = createResumeDto;
    const { email, _id } = user

    const newCV = await this.resumeModel.create({
      url, companyId, email, jobId,
      userId: _id,
      createdBy: {
        _id,
        email
      },
      history: [
        {
          status: "PENDING",
          updatedAt: new Date(),
          updateBy: {
            _id: user._id,
            email: user.email
          }
        }
      ]
    })
    return {
      _id: newCV?._id,
      createdAt: newCV?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs)
    delete filter.current
    delete filter.pageSize

    const offset = (currentPage - 1) * limit;
    const defaultLimit = +limit ? +limit :10; 

    const totalItems = await this.resumeModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems/defaultLimit);

    const resumes = await this.resumeModel.find(filter)
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
    result: resumes
  }
  }
  

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(` Không tìm thấy sơ yếu lý lịch`)
    }
    return this.resumeModel.findById(id)
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(` Không tìm thấy sơ yếu lý lịch`)
    }

    const { status } = updateResumeDto;

    const updated = await this.resumeModel.updateOne(
      { _id: id },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        $push: {// push nghĩa là toán tử mongo giúp ta đẩy thêm data vào data cũ 
          history: {
            status,
            updatedAt: new Date(),
            updateBy: {
              _id: user._id,
              email: user.email
            }
          }
        }
      }
    )
    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.resumeModel.updateOne(
      {_id : id},
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
      return this.resumeModel.softDelete({
        _id: id
      })
  }

  async findByUsers(user: IUser) {
    return await this.resumeModel.find({
      userId: user._id
    })
    .sort("-createdAt")
.populate([
  {
    path: "companyId",
    select: { name: 1 }
  },
  {
    path: "jobId",
    select: { name: 1 }
  }
])
  }
}
