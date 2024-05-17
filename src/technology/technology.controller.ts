import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TechnologysService } from './technology.service';
import { CreateTechnologyDto } from '../auth/config/dtos';
import { Roles } from '../auth/config/decorators/roles.decorator';
import { AuthGuard, RoleGuard, UserRoleEnum } from '../auth/config';
import { Technology } from '../database/entities';
import {
  DeletedDto,
  TechnologyDtoDocs,
  TechnologyExtendsDtoDocs,
} from 'src/docs';

@ApiBearerAuth()
@ApiTags('Technology')
@Controller('technology')
@UseGuards(AuthGuard)
export class TechnologyController {
  constructor(private technologyService: TechnologysService) {}
  @ApiBody({
    type: TechnologyDtoDocs,
  })
  @ApiResponse({
    type: TechnologyExtendsDtoDocs,
    status: 201,
    isArray: true,
  })
  @UseGuards(RoleGuard)
  @Roles(UserRoleEnum.admin)
  @HttpCode(HttpStatus.ACCEPTED)
  @Post()
  async create(@Body() payload: CreateTechnologyDto) {
    return await this.technologyService.create(payload);
  }

  @ApiResponse({
    type: TechnologyExtendsDtoDocs,
    status: 201,
    isArray: true,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Get()
  async findAll() {
    return await this.technologyService.findAll();
  }

  @ApiResponse({
    type: TechnologyExtendsDtoDocs,
    status: 201,
    isArray: true,
  })
  @ApiResponse({
    type: CreateTechnologyDto,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Get(':id')
  async getByTechnologyId(@Param('id', ParseIntPipe) id: number) {
    return await this.technologyService.getTechnologyById(id);
  }

  @ApiBody({
    type: TechnologyDtoDocs,
  })
  @ApiResponse({
    type: TechnologyExtendsDtoDocs,
    status: 201,
    isArray: true,
  })
  @UseGuards(RoleGuard)
  @Roles(UserRoleEnum.admin)
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVacancyDto: Partial<Technology>,
  ) {
    return this.technologyService.updateTechnologyById(+id, updateVacancyDto);
  }

  @ApiResponse({
    type: DeletedDto,
    description: 'Technology deleted with success.',
    isArray: true,
  })
  @UseGuards(RoleGuard)
  @Roles(UserRoleEnum.admin)
  @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.technologyService.delete(id);
  }
}