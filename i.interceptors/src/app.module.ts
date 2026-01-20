import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { LoggerMiddleware } from './shared/Middlewares/logger.middleware';
import { SimpleMiddleware } from './shared/Middlewares/simple.middleware';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/ExceptionFilters/http-exception.filter';
import { TransformInterceptor } from './shared/Interceptors/transform.interceptor';

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    //use .apply() method to attch middleware to spesific routes and method
    consumer.apply(LoggerMiddleware, SimpleMiddleware).forRoutes(
      //Define the routes for which middleware should be applied
      { path: 'users', method: RequestMethod.ALL }, //apply for all method request users
      { path: 'products', method: RequestMethod.ALL }, //apply for all method request products
    );
  }
}
