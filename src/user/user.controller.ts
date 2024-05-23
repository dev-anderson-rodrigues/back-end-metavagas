import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './user.service';
import { UserRoleEnum, AuthGuard, RoleGuard } from '../auth/config';
import { Roles } from '../auth/config/decorators/roles.decorator';
import { CreateUserDoc, UserCreatedDoc } from '../docs';
import { User } from '../database/entities/index';
import { CurrentUser } from '../auth/config/decorators/current-user.decorator';
import { CurrentUserDto } from '../../src/auth/config';
import { DeletedDto } from '../docs';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiBody({
    type: CreateUserDoc,
  })
  @ApiResponse({
    type: UserCreatedDoc,
    status: 201,
    isArray: true,
    description: 'User successfully updated.',
  })
  @ApiResponse({
    status: 409,
    description: 'User not exists.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized.',
  })
  @UseGuards(RoleGuard)
  @Roles(UserRoleEnum.admin)
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update user data',
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    return this.userService.updateUserById(id, userData);
  }

  @ApiResponse({
    type: UserCreatedDoc,
    status: 201,
    description: 'Acessed successfully.',
    isArray: true,
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized.',
  })
  @UseGuards(RoleGuard)
  @Roles(UserRoleEnum.admin)
  @Get()
  @ApiOperation({
    summary: 'Find All Users',
  })
  async list() {
    return await this.userService.listUsers();
  }
  @ApiResponse({
    type: UserCreatedDoc,
    isArray: true,
    status: 201,
    description: 'Acessed successfully.',
  })
  @Get('profile')
  @ApiOperation({
    summary: 'Fetch profile data',
  })
  profile(@CurrentUser() user: CurrentUserDto) {
    console.log('user', user);
    return this.userService.profile(user.userId);
  }
  @ApiResponse({
    type: UserCreatedDoc,
    isArray: true,
    status: 201,
    description: 'Acessed successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 302,
    description: 'User not exists.',
  })
  @UseGuards(RoleGuard)
  @Roles(UserRoleEnum.admin)
  @HttpCode(HttpStatus.ACCEPTED)
  @Get(':id')
  @ApiOperation({
    summary: 'Search for a user by id',
  })
  async show(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }
  @ApiResponse({
    type: DeletedDto,
    description: 'User deleted with success.',
    isArray: true,
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 302,
    description: 'User not exists.',
  })
  @UseGuards(RoleGuard)
  @Roles(UserRoleEnum.admin)
  @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id);
  }
}
