# Module

Module adalah konsep fundamental di nest js, module digunakan untuk mengatur dan mennyusun app menjadi bagian -bagian yang mudah dikelola dan digunakan kembali. Module membantu membuat clean code dan membuat code maintanable.

Module di deklarasikan dengan anotasi @Module({})

## Cara membuat module

```bash
nest generate modulue users
```

hasil dari generate

```js
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

dengan melakukan generate maka otomatis module akan terdaftar di app.module.ts

```js
import { Module } from "@nestjs/common";
import { UsersController } from "./modules/users/users.controller";
import { UsersService } from "./modules/users/users.service";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [UsersModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
```

## Cara untuk menggunakan suatu module di module yang lain

export module terlebih dahulu

```js
import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // pastikan sudah ter export
})
export class ProductsModule {}
```

import di module yang akan menggunakannya

```js
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [ProductsModule], // pastikan sudah terimport
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

cara penggunaan

```js
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ProductsService } from '../products/products.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private productService: ProductsService, // apply import product service
  ) {}

  //another code

  @Get('testProducts')
  // to testing that this controller can acces productService afterimport at constructor
  async getAllProducts(@Res() res, @Req() req) {
    try {
      const produtcs = this.productService.getAllProducts();
      res.status(HttpStatus.OK).json(produtcs);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
```

Syarat wajib agar provider dapat digunakan di module lain

1. Provider terdaftar di providers (module)
2. Provider di export di module asal
3. Modulenya di import di module tujuan

Jadi jika provider tidak di export dia tetap tidak bisa digunakan di module tujuan walaupun sudah mengimport module nya

nb: Controller tidak bisa di export maupun di inject

yang boleh dipakai lintas module hanya provider (Service, Repository, Guard/Interceptor/ Pipe)
