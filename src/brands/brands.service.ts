import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './schemas/brand.schema';
import mongoose, { Model } from 'mongoose';
import { FOUND_BRAND_TITLE, INVALID_ID, NOT_BRAND_BY_ID } from 'src/configs/response.constants';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) { }

  async findOneByTitle(title: string) {
    return await this.brandModel.findOne({ title })
  }
  async create(createBrandDto: CreateBrandDto) {
    //check title exist
    let check = await this.findOneByTitle(createBrandDto.title)
    if (check) {
      throw new BadRequestException(FOUND_BRAND_TITLE)
    }
    //create
    let createNewBrand = await this.brandModel.create({
      ...createBrandDto
    })
    return {
      _id: createNewBrand._id
    }
  }

  async findAll() {
    return await this.brandModel.find()
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const brand = await this.brandModel.findOne({ _id: id })
    if (!brand) {
      throw new BadRequestException(NOT_BRAND_BY_ID)
    }
    return brand
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const { title } = updateBrandDto
    const brand = await this.findOneByTitle(title)
    //check unique title
    if (brand && JSON.stringify(brand._id) !== JSON.stringify(id)) {
      throw new BadRequestException(FOUND_BRAND_TITLE)
    }
    return await this.brandModel.updateOne({ _id: id }, {
      ...updateBrandDto
    })
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    return await this.brandModel.deleteOne({ _id: id })
  }
}
