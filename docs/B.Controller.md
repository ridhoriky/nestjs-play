# Controller

create controller

```bash
nest generate controller users
```

dengan menggunakan comment diatas controller akan otomatis teregistrasi ke app.module

```js
import { Module } from "@nestjs/common";
import { UsersController } from "./users/users.controller";

@Module({
  imports: [],
  controllers: [UsersController], //  registrasi controller user
  providers: [],
})
export class AppModule {}
```

---

src/users/user.controller.ts

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
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user-dto";

@Controller("users")
export class UsersController {
  @Get() // handle request GET
  async getAllUser(@Req() req: any, @Res() res: any) {
    //asyncronus function
    const user = [{ Name: "John Doe", Age: 21 }];
    res.status(HttpStatus.OK).json(user);
  }

  @Post() // handle request POST
  create(@Body() createUserDto: CreateUserDto) {
    //handle type body from dto
    console.log(`Name ${createUserDto._name}, Age ${createUserDto._age}`);
  }

  @Get(":id") //handling dynamic parameters
  getById(@Param("id") id: string): string {
    return `This request handle get user with id ${id}`;
  }
}
```

Terdapata beberapa penamabahan code diatas untuk implementasi request

1. Get (getAllUser) -> penambahan asyncronus fucntion
2. Post (create) -> penambahan validati type body dengan mendeclare type nya di folder dto
3. Get (getById) -> menangkap parameter dari path menggunakan annotasi @Params

---

Beberapa anotasi yang digunakan

1. @Get = define method request Get
2. @Post = define method request Post
3. @Req = sama dengan req di expressjs
4. @Res = sama dengan res di expressjs
5. @Body = untuk mengambil req.body
6. @Param = untuk mengambil req.param
