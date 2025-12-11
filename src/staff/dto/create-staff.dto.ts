import { StaffRole, Status } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class CreateStaffDto {

  @IsString()
  @IsNotEmpty()
  fullName:    string

  @IsOptional()
  @IsString()
  photo:       string

  @IsEmail()
  @IsNotEmpty()
  email:       string     

  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone:       string

  @IsString()
  @IsNotEmpty()
  password:    string

  @IsEnum(StaffRole)
  @IsNotEmpty()
  role:        StaffRole

  @IsUUID()
  @IsNotEmpty()
  branchId:    string

  @IsEnum(Status)
  status:      Status
}
