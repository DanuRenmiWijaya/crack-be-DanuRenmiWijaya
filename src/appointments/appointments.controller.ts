import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

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
}
