import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async getMyChallans(studentId: string) {
    return this.prisma.feeChallan.findMany({
      where: { studentId },
      orderBy: { issueDate: 'desc' },
    });
  }

  async getChallanById(challanNumber: string) {
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
    return challan;
  }
}
