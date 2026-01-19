import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomForbiddenException extends HttpException {
  constructor() {
    // call super contructor with custom message and HttpStatus code FORBIDDEN (403)
    super('Acces Forbidden', HttpStatus.FORBIDDEN);
  }
}
