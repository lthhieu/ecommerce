import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BlogCategory } from './schemas/blog-category.schema';
import mongoose, { Model } from 'mongoose';
import slugify from 'slugify';
import { FOUND_BLOG_CATEGORY_TITLE, INVALID_ID, NOT_BLOG_CATEGORY_BY_ID } from 'src/configs/response.constants';
import { IsMongoId } from 'class-validator';

@Injectable()
export class BlogCategoriesService {
  constructor(@InjectModel(BlogCategory.name) private blogCategoryModel: Model<BlogCategory>) { }

  async findOneByTitle(title: string) {
    return await this.blogCategoryModel.findOne({ title })
  }
  async create(createBlogCategoryDto: CreateBlogCategoryDto) {
    //check title exist
    let check = await this.findOneByTitle(createBlogCategoryDto.title)
    if (check) {
      throw new BadRequestException(FOUND_BLOG_CATEGORY_TITLE)
    }
    //create
    let createNewBlogCategory = await this.blogCategoryModel.create({
      ...createBlogCategoryDto, slug: slugify(createBlogCategoryDto.title, {
        lower: true,
        locale: 'vi'
      })
    })
    return {
      _id: createNewBlogCategory._id
    }
  }

  async findAll() {
    return await this.blogCategoryModel.find()
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const blogCategory = await this.blogCategoryModel.findOne({ _id: id })
    if (!blogCategory) {
      throw new BadRequestException(NOT_BLOG_CATEGORY_BY_ID)
    }
    return blogCategory
  }

  async update(id: string, updateBlogCategoryDto: UpdateBlogCategoryDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const { title } = updateBlogCategoryDto
    const blogCategory = await this.findOneByTitle(title)
    //check unique title
    if (blogCategory && JSON.stringify(blogCategory._id) !== JSON.stringify(id)) {
      throw new BadRequestException(FOUND_BLOG_CATEGORY_TITLE)
    }
    return await this.blogCategoryModel.updateOne({ _id: id }, {
      ...updateBlogCategoryDto, slug: slugify(updateBlogCategoryDto.title, {
        lower: true,
        locale: 'vi'
      })
    })
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    return await this.blogCategoryModel.deleteOne({ _id: id })
  }
}
