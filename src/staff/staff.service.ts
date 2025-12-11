import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'nestjs-cloudinary';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService,
         private readonly cloudinaryService: CloudinaryService
  ){}
  async create(createStaffDto: CreateStaffDto, photo: Express.Multer.File) {
    try {
      const checkDuplicate = await this.prisma.staff.findUnique({where: {email_branchId: {email: createStaffDto.email, branchId: createStaffDto.branchId}}})
      if(checkDuplicate){
        throw new ConflictException(`THIS STAFF ALREADY EXISTS IN THE DATABASE!`)
      }
      const checkBranch = await this.prisma.branch.findUnique({where: {id: createStaffDto.branchId}})
      if(!checkBranch){
        throw new NotFoundException(`THIS BRANCH ID DOESN'T EXIST IN THE DATABASE`)
      }
      const checkPhone = await this.prisma.staff.findUnique({where: {phone: createStaffDto.phone}})
      if(checkPhone){
        throw new ConflictException(`THIS PHONE NUMBER HAS ALREADY BEEN SAVED TO THE DATABASE!`)
      }
      let imageUrl = null;
      if (photo) {
        const uploaded = await this.cloudinaryService.uploadFile(photo);
        imageUrl = uploaded.url;
      }
      const newStaff = await this.prisma.staff.create({data: {...createStaffDto, photo: imageUrl}})
      return {
        success: true,
        message: `SUCCESSFULLY CREATED A NEW STAFF MEMBER`,
        data: newStaff
      }

    } catch (error) {
         throw error;
    }
  }

  async findAll() {
    try {
      const allStaff = await this.prisma.staff.findMany()
    return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED ALL STAFF`,
        data: allStaff
    };
    } catch (error) {
      throw error;
    }
    
  }

  async findOne(id: string) {
   try {
      const staff = await this.prisma.staff.findUnique({where: {id}})
      if(!staff){
        throw new NotFoundException(`THIS STAFF CANNOT BE FOUND ON THIS ID!`)
      }
    return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED ALL STAFF`,
        data: staff
    };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateStaffDto: UpdateStaffDto, photo: Express.Multer.File) {
    try {
      const checkId = await this.prisma.staff.findUnique({where: {id}})
      if(!checkId){
        throw new NotFoundException(`NOT FOUND SUCH A STAFF ID!`)
      }
      const email = updateStaffDto.email
      const branchId = updateStaffDto.branchId
      if(email  && branchId){
         const checkDuplicate = await this.prisma.staff.findUnique({where: {email_branchId: {email, branchId}}})
         if(checkDuplicate){
        throw new ConflictException(`THIS STAFF ALREADY EXISTS IN THE DATABASE!`)
      }
      }
      if(email){
        const checkEmail = await this.prisma.staff.findUnique({where: {email}})
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
      const phone = updateStaffDto.phone
      if(phone){
        const checkPhone = await this.prisma.staff.findUnique({where: {phone}})
        if(checkPhone){
          throw new ConflictException(`THIS PHONE NUMBER HAS ALREADY BEEN SAVED TO THE DATABASE!`)
        }
      }
       if(photo){
        const {url} = await this.cloudinaryService.uploadFile(photo)
            updateStaffDto.photo = url
     }
      const staff = await this.prisma.staff.update({where: {id}, data: {...updateStaffDto}})
      return {
        success: true,
        message: `SUCCESSFULLY CREATED A NEW STAFF MEMBER`,
        data: staff
      }

    } catch (error) {
         throw error;
    }
  }

 async  remove(id: string) {
    try {
       const checkId = await this.prisma.staff.findUnique({where: {id}})
      if(!checkId){
        throw new NotFoundException(`NOT FOUND SUCH A STAFF ID!`)
      }
      await this.prisma.staff.delete({where: {id}})
      return {
        success: true,
        message: `SUCCESSFULLY DELETED THE STAFF!`
      }
    } catch (error) {
            throw error;
    }
  }
}
