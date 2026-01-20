import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
// import * as jwt from 'jsonwebtoken';

@Injectable()
export class SimpleAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    context.switchToHttp().getRequest().user = { id: 1, roles: ['admin'] };

    // implementasi di real case
    // const authHeader = request.headers['authorization'];
    // if (!authHeader) {
    //   throw new UnauthorizedException('Authorization header missing');
    // }

    // const [type, token] = authHeader.split(' ');

    // if (type !== 'Bearer' || !token) {
    //   throw new UnauthorizedException('Invalid authorization format');
    // }

    // try {
    // const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // SET request.user (INI PENTING)
    // request.user = {
    //   id: payload.sub,
    //   email: payload.email,
    //   roles: payload.roles,
    // };

    //   return true;
    // } catch (error) {
    //   throw new UnauthorizedException('Invalid or expired token');
    // }

    return true;
  }
}
