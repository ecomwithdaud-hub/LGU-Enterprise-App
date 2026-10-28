import {
  Controller,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { StudentParamDto } from './dto/student-param.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { IdorStudentGuard } from '../../common/guards/idor-student.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Student Academic Portal')
@Controller('students')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('dashboard/me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get dashboard payload for the currently authenticated student',
    description:
      'Aggregates academic summary, financial ledger dues, enrolled courses with real-time attendance %, and academic calendar for the current logged-in student.',
  })
  @ApiResponse({
    status: 200,
    description: 'Student dashboard payload returned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - User is not associated with an enrolled student profile',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or expired JWT token',
  })
  async getMyDashboard(@CurrentUser() user: any) {
    return this.studentsService.getStudentDashboard(user.id);
  }

  @Get('dashboard/:userId')
  @UseGuards(IdorStudentGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get aggregated student portal dashboard by user UUID',
    description:
      'Protected with strict IDOR verification: Students can only view their own record; administrators (SuperAdmin, VC, Registrar, HoD, Accounts) can inspect any student.',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'Student User UUID v4',
    example: 'c64a51eb-0cb3-4217-bf24-2c24ef84c71e',
  })
  @ApiResponse({
    status: 200,
    description: 'Student dashboard payload retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed: userId must be a valid UUID v4',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: IDOR Protection Triggered. Students cannot query another student’s dashboard.',
  })
  @ApiResponse({
    status: 404,
    description: 'Student record not found',
  })
  async getStudentDashboard(@Param() params: StudentParamDto) {
    return this.studentsService.getStudentDashboard(params.userId);
  }
}
