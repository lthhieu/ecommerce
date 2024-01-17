import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogCategoriesModule } from 'src/blog-categories/blog-categories.module';

@Module({
  imports: [BlogCategoriesModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule { }
