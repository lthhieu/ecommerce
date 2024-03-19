import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import mongoose, { Model } from 'mongoose';
import { FOUND_CATEGORY_TITLE, INVALID_ID, NOT_CATEGORY_BY_ID } from 'src/configs/response.constants';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }
  async findOneByTitle(title: string) {
    return await this.categoryModel.findOne({ title })
  }

  async findOneBySlug(slug: string) {
    return await this.categoryModel.findOne({ slug })
  }
  async create(createCategoryDto: CreateCategoryDto) {
    //check title exist
    let check = await this.findOneByTitle(createCategoryDto.title)
    if (check) {
      throw new BadRequestException(FOUND_CATEGORY_TITLE)
    }
    //create
    let createNewCategory = await this.categoryModel.create({
      ...createCategoryDto, slug: slugify(createCategoryDto.title, {
        lower: true,
        locale: 'vi'
      })
    })
    return {
      _id: createNewCategory._id
    }
  }

  async findAll() {
    return await this.categoryModel.find()
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const category = await this.categoryModel.findOne({ _id: id })
    if (!category) {
      throw new BadRequestException(NOT_CATEGORY_BY_ID)
    }
    return category
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const { title } = updateCategoryDto
    const category = await this.findOneByTitle(title)
    //check unique title
    if (category && JSON.stringify(category._id) !== JSON.stringify(id)) {
      throw new BadRequestException(FOUND_CATEGORY_TITLE)
    }
    return await this.categoryModel.updateOne({ _id: id }, {
      ...updateCategoryDto, slug: slugify(updateCategoryDto.title, {
        lower: true,
        locale: 'vi'
      })
    })
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    return await this.categoryModel.deleteOne({ _id: id })
  }
}
