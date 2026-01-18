import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Observable, of } from 'rxjs';

@Injectable()
export class ProductsService {
  private products = [
    {
      _id: 1,
      _name: 'Coca Cola',
      _qty: 10,
    },
    {
      _id: 2,
      _name: 'Fanta',
      _qty: 4,
    },
    {
      _id: 3,
      _name: 'Sprite',
      _qty: 6,
    },
    {
      _id: 4,
      _name: 'Nutriboost',
      _qty: 18,
    },
  ];

  getAllProducts(): Promise<object> {
    return Promise.resolve(this.products);
  }

  getProductByid(id: number): Promise<object> {
    const product = this.products.find((item) => item._id === id);
    if (!product) {
      // NestJS provides APIs for HTTP exceptions, it's recommended to use them.
      throw new NotFoundException('Product not found');
    }
    return Promise.resolve(product);
  }

  addProduct(product: CreateProductDto): Observable<object[]> {
    this.products.push(product);
    return of(this.products);
  }
}
