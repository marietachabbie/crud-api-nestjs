import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { email, id } = user;
      return { email, id };
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.getUserByEmail(loginDto.email);
      const { email, id } = user;
      const payload = { email: email, sub: id };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
}
