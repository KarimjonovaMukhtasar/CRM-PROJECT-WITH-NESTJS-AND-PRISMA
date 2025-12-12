import { Status } from "@prisma/client";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class CreateTeacherDto {

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

  @IsUUID()
  @IsNotEmpty()
  branchId:    string

  @IsNotEmpty()
  @IsArray()
  profession: string[]

  @IsEnum(Status)
  status:      Status

}
