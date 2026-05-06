import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Membuang properti yang tidak ada di DTO
      forbidNonWhitelisted: true, // Error jika mengirim properti yang tidak terdaftar
      transform: true,            // Auto transform tipe data (misal: string ke number)
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('SIMRS / EMR API')
    .setDescription('Dokumentasi API untuk Sistem Informasi Manajemen Rumah Sakit')
    .setVersion('1.0')
    .addBearerAuth() // Tambahkan support JWT di Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Akses di: http://localhost:5000/api/docs

  // Jalankan di port 5000 (agar tidak bentrok dengan Next.js port 3000)
  const port = process.env.PORT || 5000;
  await app.listen(port);
  
  console.log(`🚀 Backend SIMRS berjalan di: http://localhost:${port}/api/v1`);
  console.log(`📄 Dokumentasi Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
