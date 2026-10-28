import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { IdorStudentGuard } from '../../common/guards/idor-student.guard';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, IdorStudentGuard],
  exports: [StudentsService],
})
export class StudentsModule {}
