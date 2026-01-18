import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users = [
    {
      _id: 1,
      _name: 'Ridho',
      _age: 17,
    },
    {
      _id: 2,
      _name: 'Reno',
      _age: 28,
    },
  ];

  async getAllUsers() {
    return Promise.resolve(this.users);
  }

  async getUsersById(id: number) {
    const user = this.users.find((user) => user._id === id);
    if (!user) {
      throw new HttpException('User not found ', HttpStatus.NOT_FOUND);
    }

    return Promise.resolve(user);
  }

  async addUser(user: CreateUserDto): Promise<object[]> {
    this.users.push(user);
    return Promise.resolve(this.users);
  }
}
