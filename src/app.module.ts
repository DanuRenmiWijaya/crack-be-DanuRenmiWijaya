import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { PatientsController } from './patients/patients.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PatientsService } from './patients/patients.service';
import { AuthModule } from './auth/auth.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';

@Module({
  imports: [PatientsModule, PrismaModule, AuthModule, MedicalRecordsModule],
  controllers: [AppController,PatientsController],
  providers: [AppService, PatientsService],
})
export class AppModule {}
