import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CafeteriaService {
  constructor(private prisma: PrismaService) {}

  async getMenu() {
    return this.prisma.cafeteriaItem.findMany({
      where: { isAvailable: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async getMyOrders(userId: string) {
    return this.prisma.cafeteriaOrder.findMany({
      where: { userId },
      include: {
        items: {
          include: { item: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
