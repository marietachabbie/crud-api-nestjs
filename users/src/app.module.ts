import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware';

@Module({
  imports: [UsersModule],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
