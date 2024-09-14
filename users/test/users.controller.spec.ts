import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';
import {
  UserGetByIdDto,
  UserCreateDto,
  UserDeleteDto,
  UserUpdateDto,
} from '../src/users/dto/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: UsersService;

  const mockUsersService = {
    getUsers: jest.fn().mockResolvedValue([{ id: 1, name: 'John Doe' }]),
    getUserById: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
    createUser: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
    updateUser: jest
      .fn()
      .mockResolvedValue({ message: 'Successfully updated user with ID: 1' }),
    deleteUser: jest
      .fn()
      .mockResolvedValue({ message: 'Successfully deleted user by ID: 1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('Returns all users', async () => {
      const result = await controller.getUsers();
      expect(result).toEqual([{ id: 1, name: 'John Doe' }]);
    });
  });

  describe('getUser', () => {
    it('Returns user by given valid ID', async () => {
      const userDto: UserGetByIdDto = { id: '1' };
      const result = await controller.getUser(userDto);
      expect(result).toEqual({ id: 1, name: 'John Doe' });
    });

    it('should return an error message if user is not found', async () => {
      jest.spyOn(service, 'getUserById').mockResolvedValue(null);
      const result = await controller.getUser({ id: '1' });
      expect(result).toEqual({ message: 'No user found with ID: 1' });
    });
  });

  describe('createUser', () => {
    it('Creates new user', async () => {
      const userDto: UserCreateDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@mail.com',
        password: 'password',
      };
      const result = await controller.createUser(userDto);
      expect(result).toEqual({ id: 1, name: 'John Doe' });
    });
  });

  describe('updateUser', () => {
    it('Updates user by given ID', async () => {
      const userDto: UserUpdateDto = { first_name: 'John Doe Updated' };
      const result = await controller.updateUser('1', userDto);
      expect(result).toEqual({
        message: 'Successfully updated user with ID: 1',
      });
    });
  });

  describe('deleteUser', () => {
    it('Deletes user by given ID', async () => {
      const userDto: UserDeleteDto = { id: '1' };
      const result = await controller.deleteUser(userDto);
      expect(result).toEqual({ message: 'Successfully deleted user by ID: 1' });
    });
  });
});

describe('DTO validation', () => {
  describe('UserGetByIdDto validation', () => {
    it('Allows valid numeric string as ID', async () => {
      const userGetDto = plainToInstance(UserGetByIdDto, { id: '123' });
      const errors = await validate(userGetDto);
      expect(errors.length).toBe(0);
    });

    it('Fails when non-numeric string is provided as ID', async () => {
      const userGetDto = plainToInstance(UserGetByIdDto, { id: 'abc' });
      const errors = await validate(userGetDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isNumeric).toEqual(
        'User ID must be numeric string',
      );
    });
  });

  describe('UserCreateDto validation', () => {
    it('Allows valid data', async () => {
      const userCreateDto = plainToInstance(UserCreateDto, {
        email: 'test@example.com',
        password: 'password',
        first_name: 'John',
        last_name: 'Doe',
      });
      const errors = await validate(userCreateDto);
      expect(errors.length).toBe(0);
    });

    it('Fails when email is invalid', async () => {
      const userCreateDto = plainToInstance(UserCreateDto, {
        email: 'invalid-email',
        password: 'password',
        first_name: 'John',
        last_name: 'Doe',
      });
      const errors = await validate(userCreateDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isEmail).toEqual(
        'Email address is required and must be valid',
      );
    });

    it('Fails when first name is empty', async () => {
      const userCreateDto = plainToInstance(UserCreateDto, {
        email: 'test@example.com',
        password: 'password',
        first_name: '',
        last_name: 'Doe',
      });
      const errors = await validate(userCreateDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isNotEmpty).toEqual(
        'First name cannot be empty',
      );
    });

    it('Allows last name to be optional', async () => {
      const userCreateDto = plainToInstance(UserCreateDto, {
        email: 'test@example.com',
        password: 'password',
        first_name: 'John',
      });
      const errors = await validate(userCreateDto);
      expect(errors.length).toBe(0);
    });

    it('Fails when last name is an empty string', async () => {
      const userCreateDto = plainToInstance(UserCreateDto, {
        email: 'test@example.com',
        password: 'password',
        first_name: 'John',
        last_name: '',
      });
      const errors = await validate(userCreateDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isNotEmpty).toEqual(
        'Last name cannot be empty',
      );
    });
  });

  describe('UserUpdateDto validation', () => {
    it('Allows valid data to pass validation', async () => {
      const dto = plainToInstance(UserUpdateDto, {
        first_name: 'John',
        email: 'john@example.com',
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('Fails when an invalid email is provided', async () => {
      const dto = plainToInstance(UserUpdateDto, { email: 'invalid-email' });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isEmail).toEqual('Invalid email address');
    });

    it('Fails when first_name is an empty string', async () => {
      const dto = plainToInstance(UserUpdateDto, { first_name: '' });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isNotEmpty).toEqual(
        'First name cannot be empty',
      );
    });

    it('Passes when optional fields are not provided', async () => {
      const dto = plainToInstance(UserUpdateDto, {});
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('Fails when last_name is not a string', async () => {
      const dto = plainToInstance(UserUpdateDto, { last_name: 123 });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isString).toEqual(
        'Last name must be a string',
      );
    });
  });

  describe('UserDeleteDto validation', () => {
    it('Passes validation with a valid numeric string ID', async () => {
      const dto = plainToInstance(UserDeleteDto, { id: '123' });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('Fails validation if ID is not numeric', async () => {
      const dto = plainToInstance(UserDeleteDto, { id: 'abc' });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isNumeric).toEqual(
        'User ID is required and must be numeric string',
      );
    });
  });
});
