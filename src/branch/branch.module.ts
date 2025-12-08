import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { CloudinaryModule } from 'nestjs-cloudinary';

@Module({
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
