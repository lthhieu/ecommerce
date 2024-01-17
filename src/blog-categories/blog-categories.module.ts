import { Module } from '@nestjs/common';
import { BlogCategoriesService } from './blog-categories.service';
import { BlogCategoriesController } from './blog-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogCategory, BlogCategorySchema } from './schemas/blog-category.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: BlogCategory.name, schema: BlogCategorySchema }])],
  controllers: [BlogCategoriesController],
  providers: [BlogCategoriesService],
  exports: [BlogCategoriesService]
})
export class BlogCategoriesModule { }
