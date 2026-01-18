# Middleware (NestJS)

## Definisi

**Middleware** adalah fungsi yang dieksekusi **sebelum request mencapai controller** dan **sebelum response dikirim kembali ke client** selama runtime aplikasi.

Middleware bekerja di **level HTTP layer** (Express / Fastify) dan bersifat **cross-cutting concern** (berlaku lintas endpoint).

---

## Kegunaan Middleware

Middleware umumnya digunakan untuk:

- Logging request (method, URL, timestamp)
- Autentikasi sederhana (token check)
- Authorisasi ringan
- Menambahkan atau memodifikasi HTTP header
- Request tracing (request ID)
- Validasi request ringan

⚠️ **Catatan Penting**  
Middleware **bukan tempat business logic**.  
Business logic seharusnya berada di **Service**.

---

## Cara Membuat Middleware

Gunakan NestJS CLI:

```bash
nest generate middleware [name] [path]
```

Contoh:
buat middleware LoggerMiddleware

```js
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // Pastikan mengimplementasikan NestMiddleware
  use(req: Request, res: Response, next: NextFunction) {
    console.log("[Middleware] Request received");
    console.log(`[${req.method}] ${req.originalUrl}`);

    next(); // ⚠️ WAJIB dipanggil agar request dilanjutkan
  }
}
```

Middleware tidak menggunakan decorator seperti @Get() atau @Post()

---

## Daftarkan Middleware ke Module

Middleware tidak didaftarkan di providers.
Middleware didaftarkan melalui method configure() pada module.
Middleware dijalankan sesuai urutan pendaftaran di configure().

```js
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LoggerMiddleware } from "./logger.middleware";

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("/*"); // for all routes
    consumer.apply(SimpleMiddleware).forRoutes({
      //for spesific routes
      path: "users",
      method: RequestMethod.ALL,
    });
    consumer.apply(SimpleMiddleware).forRoutes({
      //for spesific routes and spesific method
      path: "products",
      method: RequestMethod.POST,
    });
  }
}
```

Middleware dapat diterapkan pada:

- Semua route ('\*')

- Path tertentu ('users')

- Path + HTTP Method tertentu (POST, GET, dll)

- Module tertentu (best practice untuk project besar)
