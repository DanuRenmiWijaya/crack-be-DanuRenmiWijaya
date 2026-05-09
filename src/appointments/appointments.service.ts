import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto, patientId: string) {
    // Mencari nomor antrean terakhir di hari dan poli yang sama
    const lastAppointment = await this.prisma.appointment.count({
      where: {
        department: dto.department,
        visitDate: new Date(dto.visitDate),
      },
    });

    return this.prisma.appointment.create({
      data: {
        department: dto.department,
        visitDate: new Date(dto.visitDate),
        patientId: patientId,
        queueNumber: lastAppointment + 1, // Antrean otomatis bertambah
        status: 'PENDING',
      },
    });
  }

  async findByPatient(patientId: string) {
    return this.prisma.appointment.findMany({
      where: { patientId },
      orderBy: { visitDate: 'desc' },
    });
  }

  async findAll() {
  return this.prisma.appointment.findMany({
    include: { patient: true }, // Sertakan data pasien
    orderBy: { queueNumber: 'asc' },
  });
  }

  async updateStatus(id: string, status: string) {
  return this.prisma.appointment.update({
    where: { id },
    data: { status },
  });
}
}
