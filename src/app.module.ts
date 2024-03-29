import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './configs/mongoose.config';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CaslModule } from './casl/casl.module';
import { CategoriesModule } from './categories/categories.module';
import { BlogCategoriesModule } from './blog-categories/blog-categories.module';
import { BlogsModule } from './blogs/blogs.module';
import { BrandsModule } from './brands/brands.module';
import { CouponsModule } from './coupons/coupons.module';
import { OrdersModule } from './orders/orders.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { DatabasesModule } from './databases/databases.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  MongooseModule.forRootAsync({
    useClass: MongooseConfigService,
  }),
    UsersModule,
    ProductsModule,
    AuthModule,
    MailModule,
    CaslModule,
    CategoriesModule,
    BlogCategoriesModule,
    BlogsModule,
    BrandsModule,
    CouponsModule,
    OrdersModule,
    CloudinaryModule,
    DatabasesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
