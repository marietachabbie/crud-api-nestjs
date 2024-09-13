import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
  ],
})
export class AppModule {}
