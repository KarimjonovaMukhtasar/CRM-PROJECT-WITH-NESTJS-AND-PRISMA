import { Status } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator"



export class CreateTeacherGroupDto {

   @IsUUID()
   @IsNotEmpty()
   teacherId: string

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
