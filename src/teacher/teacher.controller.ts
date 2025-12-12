import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', { storage: multer.memoryStorage(),  fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
              return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);}}))
  create(@UploadedFile() photo: Express.Multer.File, @Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto, photo);
  }

  @Get()
  findAll() {
    return this.teacherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto, photo: Express.Multer.File) {
    return this.teacherService.update(id, updateTeacherDto, photo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.remove(id);
  }
}
