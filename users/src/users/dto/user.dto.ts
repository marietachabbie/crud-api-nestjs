import { IsEmail, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UsersGETDto {}

export class UserUpdateDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  first_name?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  last_name?: string;
}
