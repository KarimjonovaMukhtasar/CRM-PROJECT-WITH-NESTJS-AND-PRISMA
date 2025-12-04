import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BranchModule } from './branch/branch.module';
import { RoomModule } from './room/room.module';
import { CourseModule } from './course/course.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [PrismaModule, BranchModule, RoomModule, CourseModule, GroupModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
