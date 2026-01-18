# Exception Filter (NestJS)

## Definisi

**Exception Filter** adalah mekanisme di NestJS untuk **menangkap dan menangani error (exception)** yang terjadi selama proses request–response.

Exception Filter memungkinkan kita:

- Mengontrol **format response error**
- Menyamakan **struktur error API**
- Menangani error secara **global, per-controller, atau per-route**

📌 Exception Filter bekerja **SETELAH middleware & guard**, dan **SEBELUM response dikirim ke client**.

---

## Kapan Menggunakan Exception Filter?

Exception Filter cocok digunakan untuk:

- Menyamakan format error response (standardized error)
- Menangani error custom (BusinessException)
- Logging error terpusat
- Mapping error internal → HTTP response yang aman
- Menangani error dari database / external service

❌ **Bukan untuk validasi request** (gunakan `ValidationPipe`)  
❌ **Bukan untuk auth logic** (gunakan `Guard`)

---

## Default Behavior NestJS

Secara default, NestJS akan:

- Menangkap `HttpException`
- Mengembalikan response JSON standar

Contoh:

```ts
throw new BadRequestException("Invalid data");
```

response users

```js
{
  "statusCode": 400,
  "message": "Invalid data",
  "error": "Bad Request"
}
```

Namun format ini sering tidak konsisten untuk real-world API → di sinilah Exception Filter dibutuhkan.

## Cara membuat exception filter

```bash
nest generate filter http-exception
```

## Basic exception filter

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message:
        typeof errorResponse === "string"
          ? errorResponse
          : (errorResponse as any).message,
    });
  }
}
```

## Cara penggunaan exception filter

- Global (Recommended)

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./shared/http-exception/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter()); // berlaku untuk semua api
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

- Contoller Level

```ts
@UseFilters(HttpExceptionFilter) // berlaku untuk satu controller
@Controller("users")
export class UsersController {}
```

- Route Level

```ts
  @Get()
  @UseFilters(HttpExceptionFilter) // berlaku untuk satu method
  findAll() {}
```

## RIngkasan

- Exception Filter = error handler terpusat
- Bisa global / controller / route
- Membuat API error konsisten & aman
- Sangat penting untuk production-ready API
