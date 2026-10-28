import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DayOfWeek } from '@prisma/client';

@Injectable()
export class TimetablesService {
  constructor(private prisma: PrismaService) {}

  async getRoomTimetable(roomId: string, dayOfWeek?: DayOfWeek) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) throw new NotFoundException(`Room with ID ${roomId} not found`);

    const slots = await this.prisma.timetableSlot.findMany({
      where: {
        roomId,
        ...(dayOfWeek && { dayOfWeek }),
      },
      include: {
        course: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            facultyProfile: true,
          },
        },
        section: {
          include: {
            program: true,
            batch: true,
          },
        },
        room: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return {
      room,
      slots,
    };
  }

  async getTeacherTimetable(teacherId: string, dayOfWeek?: DayOfWeek) {
    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId },
      include: { facultyProfile: true },
    });
    if (!teacher) throw new NotFoundException(`Faculty member with ID ${teacherId} not found`);

    const slots = await this.prisma.timetableSlot.findMany({
      where: {
        teacherId,
        ...(dayOfWeek && { dayOfWeek }),
      },
      include: {
        course: true,
        section: {
          include: {
            program: true,
            batch: true,
          },
        },
        room: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return {
      teacher: {
        id: teacher.id,
        name: `${teacher.firstName} ${teacher.lastName}`,
        email: teacher.email,
        profile: teacher.facultyProfile,
      },
      slots,
    };
  }

  async getSectionTimetable(sectionId: string, dayOfWeek?: DayOfWeek) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        program: true,
        batch: true,
      },
    });
    if (!section) throw new NotFoundException(`Section with ID ${sectionId} not found`);

    const slots = await this.prisma.timetableSlot.findMany({
      where: {
        sectionId,
        ...(dayOfWeek && { dayOfWeek }),
      },
      include: {
        course: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            facultyProfile: true,
          },
        },
        room: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return {
      section,
      slots,
    };
  }

  async getMyTimetable(user: any, dayOfWeek?: DayOfWeek) {
    if (user.studentProfile?.sectionId) {
      return this.getSectionTimetable(user.studentProfile.sectionId, dayOfWeek);
    } else if (user.facultyProfile) {
      return this.getTeacherTimetable(user.id, dayOfWeek);
    }
    return {
      message: 'No associated student section or faculty timetable found for this user account.',
      slots: [],
    };
  }

  async listAllRooms() {
    return this.prisma.room.findMany({
      orderBy: [{ building: 'asc' }, { roomNumber: 'asc' }],
    });
  }

  async listAllSections() {
    return this.prisma.section.findMany({
      include: {
        program: true,
        batch: true,
      },
      orderBy: [{ name: 'asc' }],
    });
  }
}
