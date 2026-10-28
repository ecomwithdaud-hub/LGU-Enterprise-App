import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransportService {
  constructor(private prisma: PrismaService) {}

  async getRoutes() {
    return this.prisma.busRoute.findMany({
      include: { bus: true },
      orderBy: { routeCode: 'asc' },
    });
  }

  async getBuses() {
    return this.prisma.bus.findMany({
      orderBy: { busNumber: 'asc' },
    });
  }

  async getMySubscription(userId: string) {
    return this.prisma.busSubscription.findMany({
      where: { userId },
      include: { route: { include: { bus: true } } },
    });
  }
}
