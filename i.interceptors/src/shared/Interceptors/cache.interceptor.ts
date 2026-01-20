import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, of } from 'rxjs';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = false;
    if (isCached) {
      return of([{ data: 'test cache ' }]).pipe(map((data) => ({ data })));
    }
    return next.handle();
  }
}
