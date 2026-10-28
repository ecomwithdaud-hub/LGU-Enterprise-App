import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global API Prefix
  const globalPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // OpenAPI / Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Lahore Garrison University (LGU) Super App API')
    .setDescription(
      'Enterprise Backend Ecosystem powering the Mobile App and Admin Control Panel with Role-Based Access Control (RBAC).',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Session tokens & identity management')
    .addTag('Timetables & Scheduling', 'Room, teacher, and student section timetable matrices')
    .addTag('Departments & Faculties', 'Academic departments, degrees, courses and venues')
    .addTag('Users Management', 'Faculty, student profiles, and administrative staff')
    .addTag('Campus Notices & Circulars', 'Broadcast circulars and academic alerts')
    .addTag('Campus Transport & Bus Fleet', 'Bus routes, GPS stops and digital transport passes')
    .addTag('Central Library', 'Book catalog, ISBN search and digital loan records')
    .addTag('Accounts & Fee Challans', 'Semester dues, payment vouchers and breakdowns')
    .addTag('Campus Cafeteria & Canteen', 'Digital menu, order processing and pickup verification')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`🚀 LGU Super App Backend API running at: http://localhost:${port}/${globalPrefix}`);
  logger.log(`📚 Interactive Swagger API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
