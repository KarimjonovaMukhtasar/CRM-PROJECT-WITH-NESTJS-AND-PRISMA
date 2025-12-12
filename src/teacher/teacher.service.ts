import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'nestjs-cloudinary';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService,
         private readonly cloudinaryService: CloudinaryService
  ){}
  async create(createTeacherDto: CreateTeacherDto, photo: Express.Multer.File) {
    try {
      const checkDuplicate = await this.prisma.teacher.findUnique({where: {email_branchId: {email: createTeacherDto.email, branchId: createTeacherDto.branchId}}})
      if(checkDuplicate){
        throw new ConflictException(`THIS TEACHER ALREADY EXISTS IN THE DATABASE!`)
      }
      const checkBranch = await this.prisma.branch.findUnique({where: {id: createTeacherDto.branchId}})
      if(!checkBranch){
        throw new NotFoundException(`THIS BRANCH ID DOESN'T EXIST IN THE DATABASE`)
      }
      const checkPhone = await this.prisma.teacher.findUnique({where: {phone: createTeacherDto.phone}})
      if(checkPhone){
        throw new ConflictException(`THIS PHONE NUMBER HAS ALREADY BEEN SAVED TO THE DATABASE!`)
      }
      let imageUrl = null;
      if (photo) {
        const uploaded = await this.cloudinaryService.uploadFile(photo);
        imageUrl = uploaded.url;
      }
      const newTeacher = await this.prisma.teacher.create({data: {...createTeacherDto, photo: imageUrl}})
      return {
        success: true,
        message: `SUCCESSFULLY CREATED A NEW TEACHER`,
        data: newTeacher
      }

    } catch (error) {
         throw error;
    }
  }

  async findAll() {
    try {
      const allTeachers = await this.prisma.teacher.findMany()
    return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED ALL TEACHERS`,
        data: allTeachers
    };
    } catch (error) {
      throw error;
    }
    
  }

  async findOne(id: string) {
   try {
      const teacher = await this.prisma.teacher.findUnique({where: {id}})
      if(!teacher){
        throw new NotFoundException(`THIS TEACHER CANNOT BE FOUND ON THIS ID!`)
      }
    return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED ALL TEACHERS`,
        data: teacher
    };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto, photo: Express.Multer.File) {
    try {
      const checkId = await this.prisma.teacher.findUnique({where: {id}})
      if(!checkId){
        throw new NotFoundException(`NOT FOUND SUCH A TEACHER ID!`)
      }
      const email = updateTeacherDto.email
      const branchId = updateTeacherDto.branchId
      if(email  && branchId){
         const checkDuplicate = await this.prisma.teacher.findUnique({where: {email_branchId: {email, branchId}}})
         if(checkDuplicate){
        throw new ConflictException(`THIS TEACHER ALREADY EXISTS IN THE DATABASE!`)
      }
      }
      if(email){
        const checkEmail = await this.prisma.teacher.findUnique({where: {email}})
        if(checkEmail){
          throw new ConflictException(`THIS EMAIL HAS ALREADY BEEN SAVED TO THE DATABASE`)
        }
      }
       if(branchId){
        const checkBranch = await this.prisma.branch.findUnique({where: {id: branchId}})
        if(checkBranch){
          throw new NotFoundException(`THIS BRANCH ID  CANNOT BE FOUND FROM THE DATABASE`)
        }
      }
      const phone = updateTeacherDto.phone
      if(phone){
        const checkPhone = await this.prisma.teacher.findUnique({where: {phone}})
        if(checkPhone){
          throw new ConflictException(`THIS PHONE NUMBER HAS ALREADY BEEN SAVED TO THE DATABASE!`)
        }
      }
       if(photo){
        const {url} = await this.cloudinaryService.uploadFile(photo)
            updateTeacherDto.photo = url
     }
      const teacher = await this.prisma.teacher.update({where: {id}, data: {...updateTeacherDto}})
      return {
        success: true,
        message: `SUCCESSFULLY CREATED A NEW TEACHER MEMBER`,
        data: teacher
      }

    } catch (error) {
         throw error;
    }
  }

 async remove(id: string) {
    try {
       const checkId = await this.prisma.teacher.findUnique({where: {id}})
      if(!checkId){
        throw new NotFoundException(`NOT FOUND SUCH A TEACHER ID!`)
      }
      await this.prisma.teacher.delete({where: {id}})
      return {
        success: true,
        message: `SUCCESSFULLY DELETED THE TEACHER!`
      }
    } catch (error) {
            throw error;
    }
  }
}

