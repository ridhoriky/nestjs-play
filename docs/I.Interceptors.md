# Interceptors

## Pendahuluan

Interceptor di NestJS digunakan untuk **menyisipkan logic sebelum dan/atau sesudah eksekusi handler (controller)**.

Interceptor sangat cocok untuk:

- Logging
- Transformasi response
- Performance monitoring
- Caching
- Side effects (audit log, metrics)
- Standarisasi response API

Interceptor mirip dengan **Axios response interceptor**, tetapi bekerja di level framework NestJS.

---

## Posisi Interceptor dalam Lifecycle Request

```text
Request
 → Middleware
 → Guard
 → Pipe
 → Controller
 → Service
 → Controller
 → Interceptor (after)
 → Exception Filter
 → Response
```

Interceptor dapat berjalan:

- Sebelum handler dieksekusi
- Setelah handler mengembalikan response (success)

---

## Konsep Dasar Interceptor

Interceptor harus mengimplementasikan interface `NestInterceptor`.

```ts
@Injectable()
export class ExampleInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle();
  }
}
```

---

## Apa itu `next.handle()`?

- Menjalankan handler (controller)
- Mengembalikan `Observable`
- Response belum dikirim ke client

Di sinilah kita bisa:

- `map()` → mengubah response
- `tap()` → side effect (logging, metrics)
- `catchError()` → handling error ringan

---

## Generate interceptors

```bash
nest generate interceptor LoggingInterceptor
```

## Contoh 1: Logging Interceptor

```ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();

    console.log(`[Request] ${request.method} ${request.url}`);

    return next.handle().pipe(
      tap(() => {
        console.log(`[Response] ${Date.now() - now}ms`);
      })
    );
  }
}
```

Digunakan untuk monitoring request & response time.

---

## Contoh 2: Transform Response (Standard API Response)

### Response sebelum

```json
{
  "id": 1,
  "name": "Product A"
}
```

### Response sesudah

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Product A"
  }
}
```

### Interceptor

```ts
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>) {
    return next.handle().pipe(
      map((data) => ({
        status: "success",
        data,
      }))
    );
  }
}
```

---

## Contoh 3: Performance / Timing Interceptor

```ts
@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log(`Execution time: ${Date.now() - start}ms`);
      })
    );
  }
}
```

---

## Cara Menggunakan Interceptor

### 1. Di Controller

```ts
@UseInterceptors(LoggingInterceptor)
@Controller("products")
export class ProductsController {}
```

### 2. Di Method

```ts
@UseInterceptors(TransformInterceptor)
@Get()
findAll() {}
```

### 3. Global Interceptor (Recommended)

```ts
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: TransformInterceptor,
  },
];
```

Berlaku untuk semua request.

---

## Perbandingan Konsep

### Interceptor vs Middleware

| Interceptor             | Middleware    |
| ----------------------- | ------------- |
| Punya ExecutionContext  | Tidak         |
| Bisa transform response | Tidak         |
| Framework-level         | Express-level |

### Interceptor vs Exception Filter

| Interceptor        | Exception Filter |
| ------------------ | ---------------- |
| Jalan saat sukses  | Jalan saat error |
| Transform response | Handle error     |

---

## Kesalahan Umum

❌ Authorization di Interceptor

❌ Validasi data di Interceptor

❌ Heavy logic / DB query

❌ Mengubah request body

---

## Best Practice

✔ Gunakan untuk cross-cutting concern

✔ Tetap stateless

✔ Fokus pada response & side effects

✔ Kombinasikan dengan Exception Filter

---

## Analogi dengan Axios

| Axios                          | NestJS           |
| ------------------------------ | ---------------- |
| Response interceptor (success) | Interceptor      |
| Response interceptor (error)   | Exception Filter |

---

## Ringkasan

- Interceptor adalah response interceptor versi NestJS
- Bisa berjalan sebelum & sesudah controller
- Menggunakan Observable (RxJS)
- Cocok untuk logging & transform response
- Jangan digunakan untuk auth & validasi

---

## Contoh Bagaimana interceptor running sebelum dan sesudah controller

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // =============================
    // 1️⃣ ALL CODE IN HERE RUNNING BEFORE CONTROLLER
    console.log("Before controller");

    const now = Date.now();
    const request = context.switchToHttp().getRequest();

    console.log(`[Request] ${request.method} ${request.url}`);

    // =============================

    return next.handle().pipe(
      // =============================
      // 2️⃣ ALL CODE IN HERE RUNNING AFTER CONTROLLER
      tap(() => {
        console.log("After controller");
        console.log(`[Request] ${Date.now() - now}ms`);
      })

      // =============================
    );
  }
}
```

> KEYS  
> next.handle() yang artinya 'Silahkan NestJs lanjut ke controller'

## Interceptor for cache

example intercetor for cache

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable, of } from "rxjs";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = false;
    if (isCached) {
      return of([{ data: "test cache " }]).pipe(map((data) => ({ data })));
    }
    return next.handle();
  }
}
```

```psql
Request
 ↓
Interceptor
   ├─ cache hit → langsung response
   └─ cache miss → controller → service → response
```

### Best Practice Cache di NestJS

Gunakan CacheModule bawaan dari nest js

```ts
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [CacheModule.register()],
})
export class AppModule {}
```

contoh implementasi real case

```ts
@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const key = req.originalUrl;

    const cached = await this.cache.get(key);
    if (cached) return of(cached);

    return next.handle().pipe(
      tap(async (res) => {
        await this.cache.set(key, res, 60);
      })
    );
  }
}
```
