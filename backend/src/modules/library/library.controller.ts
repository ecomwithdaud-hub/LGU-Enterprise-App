import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Central Library')
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('books')
  @ApiOperation({ summary: 'Search and browse library catalog' })
  @ApiQuery({ name: 'q', required: false, description: 'Search by title, author, or ISBN' })
  async searchBooks(@Query('q') query?: string) {
    return this.libraryService.searchBooks(query);
  }

  @Get('my-borrows')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List books currently or previously borrowed by authenticated user' })
  async getMyBorrowedBooks(@CurrentUser() user: any) {
    return this.libraryService.getMyBorrowedBooks(user.id);
  }
}
