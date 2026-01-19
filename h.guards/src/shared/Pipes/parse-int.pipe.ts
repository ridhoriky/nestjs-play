import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const numberValue = parseInt(value, 10);
    if (isNaN(numberValue)) {
      throw new BadRequestException('Invalid nput, must be an integer');
    }
    return numberValue;
  }
}
