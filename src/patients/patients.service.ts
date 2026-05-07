import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePatientDto) {
    // LOG 1: Cek apakah request masuk ke sini
    console.log('1. Mencoba mendaftarkan pasien dengan NIK:', dto.nik);

    try {
      const existing = await this.prisma.patient.findUnique({
        where: { nik: dto.nik }
      });

      if (existing) {
        console.log('2. NIK sudah ada, proses dibatalkan.');
        throw new ConflictException('Pasien dengan NIK ini sudah terdaftar');
      }

      console.log('3. NIK aman, mulai menyimpan ke database...');

      const newPatient = await this.prisma.patient.create({
        data: {
          nik: dto.nik,
          name: dto.name,
          gender: dto.gender,
          birthDate: new Date(dto.birthDate),
          address: dto.address,
        },
      });

      // LOG 2: Cek apakah berhasil simpan
      console.log('4. ✅ BERHASIL! Data tersimpan di DB:', newPatient);
      return newPatient;

    } catch (error) {
      // LOG 3: Tangkap error jika gagal
      console.error('❌ GAGAL SIMPAN KE DB:', error);
      throw new InternalServerErrorException('Gagal menyimpan data ke database');
    }
  }

  async findAll() {
    console.log('Memanggil semua data pasien...');
    return this.prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
  return this.prisma.patient.findUnique({ 
      where: { id } 
    });
  }

    async update(id: string, dto: Partial<CreatePatientDto>) {
    return this.prisma.patient.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.patient.delete({
      where: { id },
    });
  }

}
