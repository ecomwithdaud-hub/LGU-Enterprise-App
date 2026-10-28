import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { TimetablesModule } from './modules/timetables/timetables.module';
import { NoticesModule } from './modules/notices/notices.module';
import { TransportModule } from './modules/transport/transport.module';
import { LibraryModule } from './modules/library/library.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { CafeteriaModule } from './modules/cafeteria/cafeteria.module';
import { StudentsModule } from './modules/students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    DepartmentsModule,
    TimetablesModule,
    NoticesModule,
    TransportModule,
    LibraryModule,
    AccountsModule,
    CafeteriaModule,
  ],
})
export class AppModule {}
