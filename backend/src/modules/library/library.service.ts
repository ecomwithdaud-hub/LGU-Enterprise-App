import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  async searchBooks(query?: string) {
    const where: any = {};
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { author: { contains: query, mode: 'insensitive' } },
        { isbn: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ];
    }
    return this.prisma.libraryBook.findMany({
      where,
      orderBy: { title: 'asc' },
    });
  }

  async getMyBorrowedBooks(userId: string) {
    return this.prisma.borrowRecord.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { issueDate: 'desc' },
    });
  }
}
