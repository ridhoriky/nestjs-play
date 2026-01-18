# Provider & Service

## Provider

provider adalah konsep fundamental dalam nestjs, fungsi nya sebagai bangunan block functional aplikasi. Provider bertanggung jawab untuk membungkus berbagai bagian code , menangani dependency, dan mempromosikan pengguna kembali

### Tujuan Provider

1. Dependency Injection: Provider dapat diinjeksikan ke class lain, seperti controller, service maupun provider lain. ini bertujuan untuk membangun app yang modular dan terorganisir
2. Encapsulation Logic: Kita dapat mengenkapsulasi logic atau fungsi spesific dalam provider. Contohnya kita dapat membuat userService untuk menangani operasi create, update maupun delete user
3. Singleton Instance: Secara default, provider diperlakukan sebagai singleton di NestJS. Ini berarti hanya ada satu instans dari setiap provider dalam siklus hidup aplikasi, sehingga memastikan penggunaan sumber daya yang efisien.

```bash
nest generate service users
```

dengan mengunakan cli diatas otomatis akan tergenerate file src/users/users.service.ts dan otomatis ter registrasi juga di file app.module.ts

```js
import { Module } from "@nestjs/common";
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";

@Module({
  imports: [],
  controllers: [UsersController], //  import controller user
  providers: [UsersService], // import service user
})
export class AppModule {}
```

---

### Cara Penggunaan Service sebagai Provider

a. Create class dengan anotasi @Injectable()

```js
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository {
  //implement userRepository
}
```

b. Patikan sudah teregistrasi sebagai provider di file \*\*.module.ts

```js
import { Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UsersService } from "./users.service";

@Module({
  providers: [UserRepository, UsersService],
})
export class UsersModule {}
```

c. Cara penggunaan

```js
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {
    // implement service using userRepository
  }
}
```

Provider adalah konsep inti di NestJS, memungkinkan modularitas, pengorganisasian kode, dan manajemen dependensi yang efisien. Provider sangat penting untuk menciptakan aplikasi yang mudah dipelihara dan diskalakan
