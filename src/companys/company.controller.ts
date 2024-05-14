import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CompanyService } from './company.service';
import { AuthGuard, RoleGuard, UserRoleEnum } from 'src/auth/Config';
import { Roles } from 'src/auth/Config/decorators/roles.decorator';
import { CreateCompanyDto } from '../auth/Config';
import { UpdateCompanyDto } from '../auth/Config';

@ApiTags('Company')
@UseGuards()
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoleEnum.admin)
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/create')
  async create(@Body() payload: CreateCompanyDto) {
    return await this.companyService.create(payload);
  }

  // @UseGuards(AuthGuard, RoleGuard)
  // @Roles(UserRoleEnum.admin)
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCompanyDto,
  ) {
    return await this.companyService.update(id, payload);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get()
  async findAll(@Query('name') name?: string) {
    return await this.companyService.findAll(name);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.companyService.idPicker(id);
  }
}