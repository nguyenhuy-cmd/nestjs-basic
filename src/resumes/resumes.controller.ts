import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage('Tạo sơ yếu lý lịch mới')
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Post('by-user')
  @ResponseMessage('lay tat ca so yeu li lich')
  getResumesByUser(@User() user: IUser){
    return this.resumesService.findByUsers(user);
  }

  @Get()
  @ResponseMessage('lay tat ca so yeu li lich')
  findAll(
    @Query("current") current: string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.resumesService.findAll(+current, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('lấy sơ yếu lý lịch')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('update sơ yếu lý lịch')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto, @User() user: IUser) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @Delete(':id')
  @ResponseMessage('delete sơ yếu lý lịch')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id,user);
  }
}
