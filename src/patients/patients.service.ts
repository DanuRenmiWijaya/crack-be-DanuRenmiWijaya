import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import * as ExcelJS from 'exceljs'; 
import { Response } from 'express'; 

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePatientDto) {
    console.log('1. Mencoba mendaftarkan pasien dengan NIK:', dto.nik);
    try {
      const existing = await this.prisma.patient.findUnique({
        where: { nik: dto.nik }
      });

      if (existing) {
        console.log('2. NIK sudah ada, proses dibatalkan.');
        throw new ConflictException('Pasien dengan NIK ini sudah terdaftar');
      }

      const newPatient = await this.prisma.patient.create({
        data: {
          nik: dto.nik,
          name: dto.name,
          gender: dto.gender,
          birthDate: new Date(dto.birthDate),
          address: dto.address,
        },
      });

      console.log('4. ✅ BERHASIL! Data tersimpan di DB:', newPatient);
      return newPatient;
    } catch (error) {
      console.error('❌ GAGAL SIMPAN KE DB:', error);
      throw new InternalServerErrorException('Gagal menyimpan data ke database');
    }
  }

  async findAll() {
    return this.prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.patient.findUnique({ 
      where: { id },
      include: { records: true } // Tambahkan ini agar detail pasien bawa rekam medis
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

  async getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newPatients = await this.prisma.patient.count({
      where: { createdAt: { gte: today } }
    });

    const totalVisits = await this.prisma.medicalRecord.count({
      where: { createdAt: { gte: today } }
    });

    return { newPatients, totalVisits };
  }

  // FUNGSI EXPORT EXCEL (BARU)
  async exportToExcel(res: Response) {
    const patients = await this.prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Pasien');

    worksheet.columns = [
      { header: 'NIK', key: 'nik', width: 20 },
      { header: 'Nama Lengkap', key: 'name', width: 30 },
      { header: 'Jenis Kelamin', key: 'gender', width: 15 },
      { header: 'Tanggal Lahir', key: 'birthDate', width: 20 },
      { header: 'Alamat', key: 'address', width: 40 },
      { header: 'Tanggal Daftar', key: 'createdAt', width: 20 },
    ];

    patients.forEach((p) => {
      worksheet.addRow({
        ...p,
        birthDate: p.birthDate.toLocaleDateString('id-ID'),
        createdAt: p.createdAt.toLocaleDateString('id-ID'),
      });
    });

    worksheet.getRow(1).font = { bold: true };
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Laporan_Pasien.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }
}
