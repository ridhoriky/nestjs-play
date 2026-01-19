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
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
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
