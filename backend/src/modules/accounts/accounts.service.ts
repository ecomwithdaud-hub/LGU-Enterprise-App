import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RoleType } from '../../common/enums/role.enum';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async getMyChallans(studentId: string) {
    return this.prisma.feeChallan.findMany({
      where: { studentId },
      orderBy: { issueDate: 'desc' },
    });
  }

  async getChallanById(challanNumber: string, requestingUser?: any) {
    const challan = await this.prisma.feeChallan.findUnique({
      where: { challanNumber },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            studentProfile: {
              include: {
                program: true,
                section: true,
              },
            },
          },
        },
      },
    });

    if (!challan) throw new NotFoundException(`Fee challan #${challanNumber} not found`);

    // Strict IDOR Protection:
    if (requestingUser && requestingUser.role?.type === RoleType.STUDENT) {
      if (challan.studentId !== requestingUser.id) {
        throw new ForbiddenException(
          'Access Denied (IDOR Protection): You cannot inspect or download another student’s fee challan.',
        );
      }
    }

    return challan;
  }
}
