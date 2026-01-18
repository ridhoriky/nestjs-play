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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  async getAllProducts(@Res() res, @Req() req) {
    try {
      const products = this.productService.getAllProducts();

      res.status(HttpStatus.OK).json(products);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  // using express request and response object
  // @Param("id") can directly retrive the 'id' paramater
  async getProduct(@Res() res, @Param(':id') id) {
    try {
      const product = this.productService.getProductByid(id);
      res.status(HttpStatus.OK).json(product);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async postProduct(@Res() res, @Body() createProductDto: CreateProductDto) {
    try {
      const products = this.productService.addProduct(createProductDto);
      res.status(HttpStatus.CREATED).json(products);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
