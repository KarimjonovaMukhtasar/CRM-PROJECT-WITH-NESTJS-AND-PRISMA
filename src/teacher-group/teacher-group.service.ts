import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTeacherGroupDto } from "./dto/create-teacher-group.dto";
import { UpdateTeacherGroupDto } from "./dto/update-teacher-group.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TeacherGroupService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTeacherGroupDto: CreateTeacherGroupDto) {
    try {
      const checkGroup = await this.prisma.group.findUnique({
        where: { id: createTeacherGroupDto.groupId }
      });
      if (!checkGroup) {
        throw new NotFoundException(
          `NOT FOUND SUCH A GROUP ID IN THE DATABASE!`
        );
      }
      const checkBranch = await this.prisma.branch.findUnique({
        where: { id: createTeacherGroupDto.branchId }
      });
      if (!checkBranch) {
        throw new NotFoundException(
          `NOT FOUND SUCH A BRANCH ID IN THE DATABASE!`
        );
      }
       const checkTeacher= await this.prisma.teacher.findUnique({
        where: { id: createTeacherGroupDto.teacherId }
      });
      if (!checkTeacher) {
        throw new NotFoundException(
          `NOT FOUND SUCH A TEACHER ID IN THE DATABASE!`
        );
      }
      const checkDuplicate = await this.prisma.teacherGroup.findUnique({where: {teacherId_groupId:  {teacherId: createTeacherGroupDto.teacherId, groupId: createTeacherGroupDto.groupId}}})
      if(checkDuplicate){
        throw new ConflictException(`THIS TEACHER HAS ALREADY BEEN ASSIGNED TO THIS GROUP!`)
      }
      const newTeacherGroup = await this.prisma.teacherGroup.create({data: {...createTeacherGroupDto}})
      return {
        success: true,
        message: `SUCCESSFULLY ASSIGNED A NEW TEACHER TO THE GROUP!`,
        data: newTeacherGroup
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const teacherGroups = await this.prisma.teacherGroup.findMany()
      return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED ALL TEACHER GROUPS!`,
        data: teacherGroups
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const checkId = await this.prisma.teacherGroup.findUnique({where: {id}})
      if(!checkId){
        throw new NotFoundException(`This teacherGroup id cannot be found`)
      }
      return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED ONE  TEACHERGROUP FROM THE DATABASE!`,
        data: checkId
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateTeacherGroupDto: UpdateTeacherGroupDto) {
    try {
       const checkId = await this.prisma.teacherGroup.findUnique({where: {id}})
      if(!checkId){
        throw new NotFoundException(`This teacher group id cannot be found`)
      }
      const groupId = updateTeacherGroupDto.groupId
      if(groupId){
        const checkGroupId = await this.prisma.group.findUnique({
        where: { id: groupId }
      });
      if (!checkGroupId) {
        throw new NotFoundException(
          `NOT FOUND SUCH A GROUP ID IN THE DATABASE!`
        );
      }
      }
      const checkBranch = updateTeacherGroupDto.branchId
      if(checkBranch){
        const checkBranchId = await this.prisma.group.findUnique({
        where: { id: updateTeacherGroupDto.branchId }
      });
      if (!checkBranchId) {
        throw new NotFoundException(
          `NOT FOUND SUCH A BRANCH ID IN THE DATABASE!`
        );
      }
      }
      const teacherId = updateTeacherGroupDto.teacherId
      if(teacherId){
        const checkTeacherId = await this.prisma.teacher.findUnique({
        where: { id: teacherId }
      });
      if (!checkTeacherId) {
        throw new NotFoundException(
          `NOT FOUND SUCH A TEACHER ID IN THE DATABASE!`
        );
      }
      }
      if(groupId && teacherId){
        const checkDuplicate = await this.prisma.teacherGroup.findUnique({where: {teacherId_groupId:  {teacherId, groupId}}})
      if(checkDuplicate){
        throw new ConflictException(`THIS TEACHER HAS ALREADY BEEN ASSIGNED TO THIS GROUP!`)
      }
      }
      const updatedTeacherGroup = await this.prisma.teacherGroup.update({where: {id} , data: {...updateTeacherGroupDto}})
      return {
        success: true,
        message: `SUCCESSFULLY UPDATED A NEW TEACHER GROUP!`,
        data: updatedTeacherGroup
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const checkId = await this.prisma.teacherGroup.findUnique({where: {id}})
      if(!checkId){
        throw new NotFoundException(`This  teacherGroup id cannot be found`)
      }
      await this.prisma.teacherGroup.delete({where: {id}})
      return {
        success: true,
        message: `SUCCESSFULLY DELETED THE TEACHERGROUP!`
      };
    } catch (error) {
      throw error;
    }
  }
}

