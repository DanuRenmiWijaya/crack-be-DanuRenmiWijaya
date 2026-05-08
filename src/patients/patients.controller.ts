import { Controller, Post, Body, Get, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientsService } from './patients.service'; // 1. Import Service-nya
import { Response } from 'express';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@UseGuards(AuthGuard('jwt'))
export class PatientsController {
  // 2. Inject Service-nya ke dalam constructor
  constructor(private readonly patientsService: PatientsService) {}
  
  @Post()
  @ApiOperation({ summary: 'Daftarkan pasien baru' })
  @ApiResponse({ status: 201, description: 'Pasien berhasil didaftarkan.' })
  @ApiResponse({ status: 400, description: 'Validasi gagal.' })
  create(@Body() createPatientDto: CreatePatientDto) {
    // 3. PANGGIL Service untuk simpan ke Database (INI YANG TADI HILANG)
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua data pasien' })
  findAll() {
    // 4. PANGGIL Service untuk ambil data asli dari DB
    return this.patientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail satu pasien berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Get('stats/today')
  @ApiOperation({ summary: 'Ambil statistik harian' })
  getStats() {
  return this.patientsService.getTodayStats();
  }

  @Get('export/excel')
  @ApiOperation({ summary: 'Export data pasien ke Excel' })
  async exportExcel(@Res() res: Response) {
  return this.patientsService.exportToExcel(res);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: Partial<CreatePatientDto>) {
    return this.patientsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }

}
