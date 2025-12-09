import { IsOptional } from "class-validator"

export class CreateStudentDto {
  id: string
  fullName: string

  @IsOptional()
  photo: string
  email: string     
  phone :     string     
  password : string
  branchId: string
}
