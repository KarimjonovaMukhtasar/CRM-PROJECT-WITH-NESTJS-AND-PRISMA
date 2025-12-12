import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateStudentGroupDto } from "./dto/create-student-group.dto";
import { UpdateStudentGroupDto } from "./dto/update-student-group.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class StudentGroupService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createStudentGroupDto: CreateStudentGroupDto) {
    try {
      const checkGroup = await this.prisma.group.findUnique({
        where: { id: createStudentGroupDto.groupId }
      });
      if (!checkGroup) {
        throw new NotFoundException(
          `NOT FOUND SUCH A GROUP ID IN THE DATABASE!`
        );
      }
      const checkBranch = await this.prisma.branch.findUnique({
        where: { id: createStudentGroupDto.branchId }
      });
      if (!checkBranch) {
        throw new NotFoundException(
          `NOT FOUND SUCH A BRANCH ID IN THE DATABASE!`
        );
      }
       const checkStudent = await this.prisma.student.findUnique({
        where: { id: createStudentGroupDto.studentId }
      });
      if (!checkStudent) {
        throw new NotFoundException(
          `NOT FOUND SUCH A STUDENT ID IN THE DATABASE!`
        );
      }
      const checkDuplicate = await this.prisma.studentGroup.findUnique({where: {studentId_groupId:  {studentId: createStudentGroupDto.studentId, groupId: createStudentGroupDto.groupId}}})
      if(checkDuplicate){
        throw new ConflictException(`THIS STUDENT HAS ALREADY JOINED TO THIS GROUP!`)
      }
      const newStudentGroup = await this.prisma.studentGroup.create({data: {...createStudentGroupDto}})
      return {
        success: true,
        message: `SUCCESSFULLY ADDED A NEW STUDENT TO THE GROUP!`,
        data: newStudentGroup
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const studentGroups = await this.prisma.studentGroup.findMany()
      return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED ALL STUDENT GROUPS!`,
        data: studentGroups
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const checkId = await this.prisma.studentGroup.findUnique({where: {id}})
      if(!checkId){
        throw new NotFoundException(`This student group id cannot be found`)
      }
      return {
        success: true,
        message: `SUCCESSFULLY RETRIEVED ONE STUDENT GROUP FROM THE DATABASE!`,
        data: checkId
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateStudentGroupDto: UpdateStudentGroupDto) {
    try {
       const checkId = await this.prisma.studentGroup.findUnique({where: {id}})
      if(!checkId){
        throw new NotFoundException(`This student group id cannot be found`)
      }
      const groupId = updateStudentGroupDto.groupId
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
      const checkBranch = updateStudentGroupDto.branchId
      if(checkBranch){
        const checkBranchId = await this.prisma.group.findUnique({
        where: { id: updateStudentGroupDto.branchId }
      });
      if (!checkBranchId) {
        throw new NotFoundException(
          `NOT FOUND SUCH A BRANCH ID IN THE DATABASE!`
        );
      }
      }
      const studentId = updateStudentGroupDto.studentId
      if(studentId){
        const checkStudentId = await this.prisma.student.findUnique({
        where: { id: studentId }
      });
      if (!checkStudentId) {
        throw new NotFoundException(
          `NOT FOUND SUCH A STUDENT ID IN THE DATABASE!`
        );
      }
      }
      if(groupId && studentId){
        const checkDuplicate = await this.prisma.studentGroup.findUnique({where: {studentId_groupId:  {studentId, groupId}}})
      if(checkDuplicate){
        throw new ConflictException(`THIS STUDENT HAS ALREADY JOINED TO THIS GROUP!`)
      }
      }
      const updatedStudentGroup = await this.prisma.studentGroup.update({where: {id} , data: {...updateStudentGroupDto}})
      return {
        success: true,
        message: `SUCCESSFULLY UPDATED A NEW STUDENT GROUP!`,
        data: updatedStudentGroup
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const checkId = await this.prisma.studentGroup.findUnique({where: {id}})
      if(!checkId){
        throw new NotFoundException(`This student group id cannot be found`)
      }
      await this.prisma.studentGroup.delete({where: {id}})
      return {
        success: true,
        message: `SUCCESSFULLY DELETED THE STUDENT GROUP!`
      };
    } catch (error) {
      throw error;
    }
  }
}
