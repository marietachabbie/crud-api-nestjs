import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { Counter, CounterDocument } from './counter.schema';
import { UserUpdateDto, UserCreateDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
  ) {}

  // Method to create a new user with an auto-incrementing ID
  async createUser(userDto: UserCreateDto): Promise<User> {
    try {
      // Generate the next user ID
      const userId = await this.getNextSequenceValue('userId');

      // Create a new user object
      const createdUser = new this.userModel({
        id: userId,
        ...userDto,
      });

      // Save the user to the database
      await createdUser.save();
      return createdUser;
    } catch (error) {
      console.error('Error inserting user data:', error.message);
      throw error;
    }
  }

  // Method to get all users
  async getUsers(): Promise<User[]> {
    try {
      return await this.userModel.find();
    } catch (error) {
      console.error('Error fetching all users:', error.message);
      throw error;
    }
  }

  // Method to get user details by ID
  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ id });
      return user;
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      throw error;
    }
  }

  // Method to update user by ID
  async updateUser(id: string, updateUserDto: UserUpdateDto) {
    try {
      const user = await this.userModel.updateOne({ id }, updateUserDto);
      if (user.matchedCount === 0) {
        throw new Error(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      console.error('Error updating user data:', error.message);
      throw error;
    }
  }

  // Method to delete user by ID
  async deleteUser(userId: string): Promise<number> {
    try {
      // Remove the entry from the database
      const res = await this.userModel.deleteOne({ id: userId });
      return res.deletedCount;
    } catch (error) {
      console.error('Error deleting user data:', error.message);
      throw error;
    }
  }

  // Helper method to get the next auto-incrementing value
  async getNextSequenceValue(sequenceName: string): Promise<number> {
    try {
      const counter = await this.counterModel.findOneAndUpdate(
        { id: sequenceName },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true },
      );

      return counter.sequenceValue;
    } catch (error) {
      console.error('Error generating the next ID:', error.message);
      throw error;
    }
  }
}
