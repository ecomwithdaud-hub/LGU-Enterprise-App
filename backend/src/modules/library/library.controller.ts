import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
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
import { LibraryService } from './library.service';
import { SearchBooksDto } from './dto/search-books.dto';
import { IssueBookDto } from './dto/issue-book.dto';
import { ReserveWorkstationDto } from './dto/reserve-workstation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleType } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Central Library & Digital Lab')
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  // --------------------------------------------------------------------------
  // PHYSICAL LIBRARY ENDPOINTS
  // --------------------------------------------------------------------------

  @Get('books')
  @ApiOperation({
    summary: 'Search and browse 15,000+ university library books catalog',
    description: 'Filter by title, author, ISBN, category, and shelf rack location with pagination support.',
  })
  @ApiResponse({ status: 200, description: 'Book search results returned' })
  async searchBooks(@Query() query: SearchBooksDto) {
    return this.libraryService.searchBooks(query);
  }

  @Get('my-borrows')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List books currently checked out by the authenticated user with overdue fines' })
  @ApiResponse({ status: 200, description: 'Active borrowings retrieved successfully' })
  async getMyBorrowedBooks(@CurrentUser() user: any) {
    return this.libraryService.getBorrowedBooks(user.id, user);
  }

  @Get('borrowed/:studentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get active and historical book borrowings for a student (IDOR Protected)',
    description: 'Students can strictly only inspect their own records; librarians and administrators can view any student.',
  })
  @ApiParam({ name: 'studentId', description: 'Student User UUID v4' })
  @ApiResponse({ status: 200, description: 'Student borrow records retrieved' })
  @ApiResponse({ status: 403, description: 'Forbidden (IDOR Protection Triggered)' })
  async getStudentBorrowedBooks(
    @Param('studentId') studentId: string,
    @CurrentUser() user: any,
  ) {
    return this.libraryService.getBorrowedBooks(studentId, user);
  }

  @Post('issue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.LIBRARY, RoleType.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '[Librarian / Admin Only] Issue book checkout via atomic database transaction',
    description: 'Verifies copy availability, decrements stock, and generates digital borrow record.',
  })
  @ApiResponse({ status: 201, description: 'Book successfully checked out' })
  @ApiResponse({ status: 400, description: 'No available copies left' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires LIBRARY or SUPER_ADMIN role' })
  async issueBook(@Body() dto: IssueBookDto) {
    return this.libraryService.issueBook(dto);
  }

  @Post('return/:recordId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.LIBRARY, RoleType.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[Librarian / Admin Only] Process book return and overdue fine calculation',
    description: 'Marks record as RETURNED, increments available inventory, and calculates overdue fines.',
  })
  @ApiParam({ name: 'recordId', description: 'Borrow Record UUID v4' })
  @ApiResponse({ status: 200, description: 'Book returned successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires LIBRARY or SUPER_ADMIN role' })
  async returnBook(@Param('recordId') recordId: string) {
    return this.libraryService.returnBook(recordId);
  }

  // --------------------------------------------------------------------------
  // DIGITAL LIBRARY & WORKSTATIONS ENDPOINTS
  // --------------------------------------------------------------------------

  @Get('digital-workstations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get live real-time workstation & PC availability across digital library labs',
    description: 'Returns occupancy, hardware specs (Core i9, RTX GPU), and open time slots.',
  })
  @ApiResponse({ status: 200, description: 'Workstation status retrieved' })
  async getDigitalWorkstations() {
    return this.libraryService.getDigitalWorkstations();
  }

  @Post('workstation/reserve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Reserve a computer workstation slot in the digital library for research or coding',
    description: 'Validates slot availability and returns a digital workstation reservation pass.',
  })
  @ApiResponse({ status: 201, description: 'Workstation slot reserved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid reservation parameters' })
  async reserveWorkstation(
    @Body() dto: ReserveWorkstationDto,
    @CurrentUser() user: any,
  ) {
    return this.libraryService.reserveWorkstation(dto, user);
  }

  @Get('e-resources')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Direct gateways and links to international digital research archives and e-journals',
    description: 'Access HEC Digital Library, IEEE Xplore, ACM, SpringerLink, ScienceDirect, and LGU repository.',
  })
  @ApiResponse({ status: 200, description: 'E-Resources list retrieved' })
  async getEResources() {
    return this.libraryService.getEResources();
  }
}
