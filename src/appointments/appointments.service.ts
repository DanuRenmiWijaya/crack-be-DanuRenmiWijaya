import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto, patientId: string) {
  console.log('Menerima request booking untuk Patient ID:', patientId);

  try {
    const lastAppointment = await this.prisma.appointment.count({
      where: {
        department: dto.department,
        visitDate: new Date(dto.visitDate),
      },
    });

    return await this.prisma.appointment.create({
      data: {
        department: dto.department,
        visitDate: new Date(dto.visitDate),
        patientId: patientId.trim(),
        queueNumber: lastAppointment + 1,
        status: 'PENDING',
      },
    });
  } catch (error:any) {
    console.error('❌ ERROR SAAT SIMPAN BOOKING:', error.message);
    throw new InternalServerErrorException('Gagal memproses pendaftaran. Pastikan data pasien valid.');
  }
}

  async findByPatient(patientId: string) {
    return this.prisma.appointment.findMany({
      where: { patientId },
      orderBy: { visitDate: 'desc' },
    });
  }

  async findAll() {
  return this.prisma.appointment.findMany({
    include: { patient: true }, 
    orderBy: { queueNumber: 'asc' },
  });
  }

  async updateStatus(id: string, status: string) {
  return this.prisma.appointment.update({
    where: { id },
    data: { status },
  });
}

async getTrackingStatus(patientId: string) {
  const currentBooking = await this.prisma.appointment.findFirst({
    where: { 
      patientId,
      status: { in: ['PENDING', 'CALLING'] },
    },
    orderBy: { visitDate: 'desc' }
  });

 if (!currentBooking || currentBooking.queueNumber === null) return null;

const waitingList = await this.prisma.appointment.count({
  where: {
    department: currentBooking.department,
    visitDate: currentBooking.visitDate,
    status: 'PENDING',
    queueNumber: { lt: currentBooking.queueNumber } 
  }
});

  return {
    ...currentBooking,
    peopleAhead: waitingList,
    estimatedWait: waitingList * 10, 
  };
  }

async update(id: string, dto: any, patientId: string) {
  const appointment = await this.prisma.appointment.findFirst({
    where: { id, patientId }
  });

  if (!appointment) throw new UnauthorizedException('Data tidak ditemukan');

  return this.prisma.appointment.update({
    where: { id },
    data: {
      department: dto.department, 
      visitDate: dto.visitDate ? new Date(dto.visitDate) : undefined,
    },
  });
}


async cancel(id: string, patientId: string) {
  const appointment = await this.prisma.appointment.findFirst({
    where: { id, patientId }
  });

  if (!appointment) throw new UnauthorizedException('Akses ditolak');

  return this.prisma.appointment.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });
}
}
