import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // PERBAIKAN 1: Buka origin agar bisa diakses domain produksi (Netlify) maupun lokal
  app.enableCors({
    origin: true, // Mengizinkan semua domain, atau Anda bisa pakai array: ['http://localhost:3000', 'https://netlify.app']
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

  const port = process.env.PORT || 5000;
  
  // PERBAIKAN 2: Tambahkan '0.0.0.0' agar server Render bisa mendengarkan interface jaringan publik
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Backend SIMRS berjalan di: http://localhost:${port}/api/v1`);
  console.log(`📄 Dokumentasi Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
