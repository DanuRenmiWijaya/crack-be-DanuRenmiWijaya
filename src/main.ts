import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module'; 
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// 1. KUNCI SERVERLESS: Inisialisasi Express instansiasi di luar fungsi utama
const server = express();

async function bootstrap() {
  // 2. KUNCI SERVERLESS: Hubungkan NestJS agar menempel ke server Express Adapter
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            
      forbidNonWhitelisted: true, 
      transform: true,            
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('SIMRS / EMR API')
    .setDescription('Dokumentasi API untuk Sistem Informasi Manajemen Rumah Sakit')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); 

  // 3. KUNCI SERVERLESS: Ganti app.listen() dengan app.init() agar serverless tidak crash
  await app.init();
}

// Eksekusi inisialisasi awal aplikasi NestJS
bootstrap();

// 4. KUNCI MUTLAK: Ekspor variabel server express agar dibaca resmi sebagai handler oleh Vercel
export default server;
