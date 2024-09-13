import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserUpdateDto } from './dto/user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /api/users
  @Get()
  async getUsers() {
    // Call the service to get all users
    return this.usersService.getUsers();
  }

  // POST /api/users
  @Post()
  async createUser(@Body() userDto: any) {
    // Call the service to create a user
    return this.usersService.createUser(userDto);
  }

  // GET /api/userss/{userId}
  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    // Call the service to get user details by ID
    return this.usersService.getUserById(userId);
  }

  // POST /api/users/{userId}
  @Post(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() data: UserUpdateDto,
  ) {
    await this.usersService.updateUser(userId, data);
    return { message: `Successfully updated user with ID: ${userId}` };
  }

  // DELETE /api/users/{userId}
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    // Call the service to delete the user by ID
    const deletedCount = await this.usersService.deleteUser(userId);
    const message =
      deletedCount === 0
        ? `No user found with id ${userId}`
        : `Successfully deleted user by ID: ${userId}`;
    return { message };
  }
}
