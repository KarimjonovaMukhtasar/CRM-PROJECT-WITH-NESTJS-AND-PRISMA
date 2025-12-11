import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', { storage: multer.memoryStorage(),  fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            return cb(new BadRequestException('Only image files are allowed!'), false);
          }
          cb(null, true);}}))
  create(@UploadedFile() photo: Express.Multer.File, @Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto, photo);
  }

  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
   @UseInterceptors(FileInterceptor('photo'))
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto, photo: Express.Multer.File) {
    return this.staffService.update(id, updateStaffDto, photo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
