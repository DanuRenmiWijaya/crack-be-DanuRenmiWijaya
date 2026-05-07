import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { MedicalRecordsService } from "./medical-records.service";

@ApiTags('Medical Records')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly mrService: MedicalRecordsService) {}

  @Post()
  create(@Body() dto: any, @Request() req: any) {
    // req.user.userId didapat dari payload JWT saat login
    return this.mrService.create(dto, req.user.userId);
  }

  @Get('patient/:id')
  getByPatient(@Param('id') patientId: string) {
    return this.mrService.findByPatient(patientId);
  }
}
