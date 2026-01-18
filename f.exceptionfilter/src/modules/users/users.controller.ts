import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Next,
  Param,
  Post,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ProductsService } from '../products/products.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomForbiddenException } from 'src/shared/exceptionFilters/forbidden.exception';
import { HttpExceptionFilter } from 'src/shared/exceptionFilters/http-exception.filter';

@Controller('users')
@UseFilters(HttpExceptionFilter) // use dependency injection (Dont create new instance)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private productService: ProductsService,
  ) {}
  @Get()
  async getAllUsers(@Req() req, @Res() res) {
    try {
      const users = await this.usersService.getAllUsers();

      res.status(HttpStatus.OK).json(users);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  // using express request and response object
  // @Param("id") can directly retrive the 'id' paramater
  async getUser(@Res() res, @Param(':id') id) {
    try {
      const user = this.usersService.getUsersById(id);
      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async postUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    try {
      const users = this.usersService.addUser(createUserDto);
      res.status(HttpStatus.CREATED).json(users);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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

  @Get('getException')
  async getException(@Req() req, @Res() res, @Next() next) {
    throw new CustomForbiddenException();
  }
}
