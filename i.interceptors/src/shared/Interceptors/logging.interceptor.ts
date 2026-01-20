import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // =============================
    // 1️⃣ ALL CODE IN HERE RUNNING BEFORE CONTROLLER
    console.log('Before controller');

    const now = Date.now();
    const request = context.switchToHttp().getRequest();

    console.log(`[Request] ${request.method} ${request.url}`);

    // =============================

    return next.handle().pipe(
      // =============================
      // 2️⃣ ALL CODE IN HERE RUNNING AFTER CONTROLLER
      tap(() => {
        console.log('After controller');
        console.log(`[Request] ${Date.now() - now}ms`);
      }),

      // =============================
    );
  }
}
