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
import { CreateUserDto } from './dto/create.user-dto';

@Controller('users')
export class UsersController {
  @Get() // handle request GET
  async getAllUser(@Req() req: any, @Res() res: any) {
    //asyncronus function
    const user = [{ Name: 'John Doe', Age: 21 }];
    res.status(HttpStatus.OK).json(user);
  }

  @Post() // handle request POST
  create(@Body() createUserDto: CreateUserDto) {
    //handle type body from dto
    console.log(`Name ${createUserDto._name}, Age ${createUserDto._age}`);
  }

  @Get(':id') //handling dynamic parameters
  getById(@Param('id') id: string): string {
    return `This request handle get user with id ${id}`;
  }
}
