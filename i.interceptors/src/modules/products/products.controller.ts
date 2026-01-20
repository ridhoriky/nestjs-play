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
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { RolesGuard } from 'src/shared/Guards/roles-guard';
import { Roles } from 'src/shared/Decorators/roles.decorator';
import { SimpleAuthGuard } from 'src/shared/Guards/simple-auth.guard';
import { LoggingInterceptor } from 'src/shared/Interceptors/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('products')
// @UseGuards(SimpleAuthGuard) // implementasi yang salah
// @UseGuards(RolesGuard) // rolesguard akan mengoverride simpleauthguard
@UseGuards(SimpleAuthGuard, RolesGuard) //implement rolesguard in a controller
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

  @Get(':id')
  @UsePipes(ParseIntPipe)
  // using express request and response object
  // @Param("id") can directly retrive the 'id' paramater
  async getProduct(@Res() res, @Param('id') id) {
    try {
      const product = await this.productService.getProductByid(id);
      res.status(HttpStatus.OK).json(product);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @Roles('admin') // hanya admin yang dapat menambahkan products
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
