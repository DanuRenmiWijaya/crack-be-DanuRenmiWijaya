import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, doctorId: string) {
    return this.prisma.medicalRecord.create({
      data: {
        ...dto,
        doctorId,
      },
    });
  }

  async findByPatient(patientId: string) {
    return this.prisma.medicalRecord.findMany({
      where: { patientId },
      include: { doctor: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
