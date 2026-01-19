# Guards di NestJS

## Pendahuluan

**Guard** di NestJS adalah mekanisme yang digunakan untuk **menentukan apakah sebuah request diizinkan untuk melanjutkan ke handler (controller)** atau tidak.

Guard berfokus pada **otorisasi dan autentikasi**, berbeda dengan Pipe yang berfokus pada **validasi dan transformasi data**.

> Singkatnya:  
> **Guard menjawab pertanyaan: “Boleh masuk atau tidak?”**

---

## Posisi Guard dalam Request Lifecycle

```txt
Request
 ↓
Middleware
 ↓
Guard        ← DI SINI
 ↓
Pipe
 ↓
Controller
 ↓
Service
 ↓
Exception Filter
 ↓
Response
```

## Tujuan Penggunaan Guard

1. Autentikasi

   Memastikan user sudah login dan menggunakan token yang valid
   contoh: JWT Authentication atau API key validation

2. Authorization

   Memastikan user memiliki hak akses yang sesuai
   Contoh: Role-based access control (ADMIN/USER) atau Permission based access

3. Proteksi endpoint

   Mencegah akses ke route tertentu tanpa syarat yang dipenuhi

## Cara Kerja Guard

Guard mengimplementasikan interface **CanActive**

```ts
export interface CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
```

jika true maka request lanjut, jika false maka request **ditolak (403 Forbidden)**

## Contoh Guard Sederhana

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class SimpleAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return !!request.headers.authorization;
  }
}
```

## implementasi Guard

1. Di Method

   ```ts
   @UseGuards(SimpleAuthGuard)
   @Get('profile')
   getProfile() {}
   ```

2. Di Controller

   ```ts
   @UseGuards(SimpleAuthGuard)
   @Controller("users")
   export class UsersController {}
   ```

3. Global Guard

   ```ts
   providers: [
     {
       provide: APP_GUARD,
       useClass: SimpleAuthGuard,
     },
   ];
   ```

## Mengakses Request di Guard

```ts
const request = context.switchToHttp().getRequest();

const user = request.user;
```

Guard bisa membaca:

- Headers

- Params

- Body

- User hasil authentication

## Guards – Role-Based Authorization (Roles Guard)

Roles Guard digunakan untuk **authorization berbasis role**, yaitu membatasi akses endpoint berdasarkan peran (role) user, seperti `admin`, `user`, atau `editor`.

Roles Guard **tidak melakukan autentikasi** (login), melainkan hanya memastikan **apakah user yang sudah login memiliki hak akses yang sesuai**.

---

## Konsep Dasar

Dalam NestJS, Role-Based Authorization dibangun menggunakan **3 komponen utama**:

1. **Roles Decorator** → deklarasi role yang dibutuhkan
2. **Auth Guard** → mengisi `request.user`
3. **Roles Guard** → melakukan pengecekan role

---

## Alur Eksekusi (High Level)

```text
Request Masuk
   ↓
Auth Guard (JWT / Custom Auth)
   → set request.user
   ↓
Roles Guard
   → baca metadata roles
   → bandingkan dengan request.user.role
   ↓
Controller
```

Roles Decorator

Roles Decorator digunakan untuk mendeklarasikan role apa saja yang diperbolehkan mengakses suatu endpoint.

Decorator ini tidak melakukan validasi, hanya menyimpan metadata.

Implementasi Roles Decorator
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) =>
SetMetadata('roles', roles);

Contoh Penggunaan

```ts
@Roles('admin')
@Get('admin')
getAdminData() {}
```

> Artinya:  
> Endpoint ini hanya boleh diakses oleh user dengan role admin

Roles Guard

Roles Guard bertugas untuk:

- Membaca metadata roles dari decorator

- Mengambil data user dari request.user

- Membandingkan role user dengan role yang dibutuhkan

Implementasi Roles Guard

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Ambil roles dari metadata
    const roles = this.reflector.get<string[]>("roles", context.getHandler());

    // Jika endpoint tidak punya decorator @Roles
    if (!roles) return true;

    // Ambil user dari request (di-set oleh Auth Guard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Cek apakah role user sesuai
    const hasRoles = () =>
      !!user.roles.find(
        (role: string) => !!roles.find((item) => item === role)
      );

    return user && user.roles && hasRoles();
  }
}
```

Auth Guard (Wajib Ada)

Roles Guard bergantung pada request.user.
Artinya, Auth Guard harus dijalankan terlebih dahulu.

Contoh Auth Guard sederhana:

```ts
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Contoh user hasil autentikasi
    request.user = {
      id: 1,
      role: ["admin"],
    };

    return true;
  }
}
```

Penggunaan Roles di controller

```ts
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { RolesGuard } from "src/shared/Guards/roles-guard";
import { Roles } from "src/shared/Decorators/roles.decorator";
import { SimpleAuthGuard } from "src/shared/Guards/simple-auth.guard";

@Controller("products")
// @UseGuards(SimpleAuthGuard) // implementasi yang salah
// @UseGuards(RolesGuard) // rolesguard akan mengoverride simpleauthguard
@UseGuards(SimpleAuthGuard, RolesGuard) //implement yang benar & urutan harus sesuai
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  // @Roles('general') //implement role apa yang boleh akses method ini
  async getAllProducts(@Res() res, @Req() req) {
    try {
      const products = await this.productService.getAllProducts();

      res.status(HttpStatus.OK).json(products);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @Roles("admin") // hanya admin yang dapat menambahkan products
  async postProduct(@Res() res, @Body() createProductDto: CreateProductDto) {
    try {
      console.log(createProductDto);
      const products = this.productService.addProduct(createProductDto);
      res.status(HttpStatus.CREATED).json(products);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
```
