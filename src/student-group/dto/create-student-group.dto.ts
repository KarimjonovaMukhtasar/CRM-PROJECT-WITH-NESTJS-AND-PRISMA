import { Status } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator"



export class CreateStudentGroupDto {

   @IsUUID()
   @IsNotEmpty()
   studentId: string

   @IsUUID()
   @IsNotEmpty()
   branchId: string


   @IsUUID()
   @IsNotEmpty()
   groupId: string

   @IsOptional()
   @IsEnum(Status)
   status: Status
}
