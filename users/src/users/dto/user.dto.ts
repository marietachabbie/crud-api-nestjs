import {
  registerDecorator,
  ValidationOptions,
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

const IsNumeric = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNumeric',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /^\d+$/.test(value);
        },
      },
    });
  };
};

export class UserGetByIdDto {
  @IsNumeric({ message: 'User ID must be numeric string' })
  id: string;
}

export class UserGetByEmailDto {
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}

export class UserCreateDto {
  @IsEmail({}, { message: 'Email address is required and must be valid' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;

  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  first_name: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  last_name?: string;
}

export class UserUpdateDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  first_name?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  last_name?: string;
}

export class UserDeleteDto {
  @IsNumeric({ message: 'User ID is required and must be numeric string' })
  id: string;
}
