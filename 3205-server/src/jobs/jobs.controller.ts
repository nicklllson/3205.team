import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import {
  TCancelJobResponse,
  TCreateJobResponse,
  TJobDetailDto,
  TJobSummaryDto,
} from './dto/create-job-response.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() dto: CreateJobDto): TCreateJobResponse {
    return this.jobsService.create(dto.urls);
  }

  @Get()
  findAll(): TJobSummaryDto[] {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): TJobDetailDto {
    return this.jobsService.findOne(id);
  }

  @Delete(':id')
  cancel(@Param('id') id: string): TCancelJobResponse {
    return this.jobsService.cancel(id);
  }
}
