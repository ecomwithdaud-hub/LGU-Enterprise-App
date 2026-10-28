import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RoleType } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { role?: RoleType; search?: string; limit?: number; offset?: number }) {
    const { role, search, limit = 50, offset = 0 } = query || {};

    const where: any = {};
    if (role) {
      where.role = { type: role };
    }
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { studentProfile: { rollNumber: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        take: limit,
        skip: offset,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          isActive: true,
          role: true,
          department: true,
          studentProfile: {
            include: {
              program: true,
              section: true,
            },
          },
          facultyProfile: true,
          staffProfile: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      limit,
      offset,
      data: users,
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        cnic: true,
        isActive: true,
        role: true,
        department: true,
        studentProfile: {
          include: {
            program: true,
            section: true,
          },
        },
        facultyProfile: true,
        staffProfile: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }
}
