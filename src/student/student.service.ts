import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { MailerService } from 'src/common/mailer/mailer.service';

@Injectable()
export class StudentService {
  constructor(private mailerService: MailerService){}
  async create(createStudentDto: CreateStudentDto) {
      const code = Math.floor(Math.random() * 1000000)
      await this.mailerService.sendEmail(createStudentDto.email, "Bu tasdiqlash kodi", code)
    return {
      success: true,
      message: `TASDIQLASH KODI YUBORILDI`
    };
  }

  findAll() {
    return `This action returns all student`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
