import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import {
  UserUpdateDto,
  UserGetByIdDto,
  UserCreateDto,
  UserDeleteDto,
} from './dto/user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /api/users
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
    // Call the service to get all users
    return this.usersService.getUsers();
  }

  // GET /api/userss/{userId}
  @Get(':id')
  async getUser(@Param() params: UserGetByIdDto) {
    const { id } = params;
    // Call the service to get user details by ID
    const user = await this.usersService.getUserById(id);
    if (!user) {
      return { message: `No user found with ID: ${id}` };
    }

    return user;
  }

  // POST /api/users
  @Post()
  async createUser(@Body() userDto: UserCreateDto) {
    // Call the service to create a user
    return this.usersService.createUser(userDto);
  }

  // POST /api/users/{userId}
  @Post(':id')
  async updateUser(@Param('id') id: string, @Body() data: UserUpdateDto) {
    await this.usersService.updateUser(id, data);
    return { message: `Successfully updated user with ID: ${id}` };
  }

  // DELETE /api/users/{userId}
  @Delete(':id')
  async deleteUser(@Param() params: UserDeleteDto) {
    const { id } = params;
    // Call the service to delete the user by ID
    const deletedCount = await this.usersService.deleteUser(id);
    const message =
      deletedCount === 0
        ? `No user found with ID: ${id}`
        : `Successfully deleted user by ID: ${id}`;
    return { message };
  }
}
