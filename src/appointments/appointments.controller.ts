import { Controller, Post, Body, Get, UseGuards, Req, Patch, Param, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt')) 
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto, @Req() req: any) {
    // req.user.sub berisi ID pasien dari token login
    return this.appointmentsService.create(dto, req.user.sub);
  }

  @Get('my-appointments')
  getMyAppointments(@Req() req: any) {
    return this.appointmentsService.findByPatient(req.user.sub);
  }

  @Get('track')
  trackMyStatus(@Req() req: any) {
  return this.appointmentsService.getTrackingStatus(req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Ubah jadwal kunjungan oleh pasien' })
  update(
  @Param('id') id: string, 
  @Body() dto: CreateAppointmentDto, 
  @Req() req: any
  ) {
  return this.appointmentsService.update(id, dto, req.user.sub);
  }


  @Delete(':id/cancel')
  cancel(@Param('id') id: string, @Req() req: any) {
  return this.appointmentsService.cancel(id, req.user.sub);
  }
}
