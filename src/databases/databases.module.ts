import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { Category, CategorySchema } from 'src/categories/schemas/category.schema';
import { Brand, BrandSchema } from 'src/brands/schemas/brand.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema },
    { name: Category.name, schema: CategorySchema },
    { name: Brand.name, schema: BrandSchema },
    { name: User.name, schema: UserSchema }])],
  controllers: [DatabasesController],
  providers: [DatabasesService],
})
export class DatabasesModule { }
