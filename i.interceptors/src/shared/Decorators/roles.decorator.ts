import { SetMetadata } from '@nestjs/common';
//set  meatadata adalah fungsi bawaan dari nest js untuk menambahakan metadata ke class, method atau properti

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
