import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import mongoose, { Model } from 'mongoose';
import slugify from 'slugify';
import { FOUND_SLUG, INVALID_ID, NOT_PRODUCT_BY_ID } from 'src/configs/response.constants';
import aqp from 'api-query-params';
import { IsEmpty } from 'class-validator';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

  async findOneBySlug(slug: string) {
    return await this.productModel.findOne({ slug })
  }

  async create(createProductDto: CreateProductDto) {
    const slug = slugify(createProductDto.title, {
      lower: true,
      locale: 'vi'
    })
    //check slug exist
    let check = await this.findOneBySlug(slug)
    if (check) {
      throw new BadRequestException(FOUND_SLUG)
    }
    //create
    let createNewProduct = await this.productModel.create({
      ...createProductDto, slug
    })
    return {
      _id: createNewProduct._id
    }
  }

  async findAll(page: number, limit: number, qs: string) {
    let { filter, projection, population } = aqp(qs);
    let { sort }: { sort: any } = aqp(qs);

    delete filter.current
    delete filter.pageSize

    page = page ? page : 1
    limit = limit ? limit : 10
    let skip = (page - 1) * limit

    const totalItems = (await this.productModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / limit)

    if (IsEmpty(sort as any)) {
      sort = '-updatedAt'
    }

    let products = await this.productModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population)
      .exec();

    return {
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result: products
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const product = await this.productModel.findOne({ _id: id })
    if (!product) {
      throw new BadRequestException(NOT_PRODUCT_BY_ID)
    }
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const slug = slugify(updateProductDto.title, {
      lower: true,
      locale: 'vi'
    })
    const product = await this.findOneBySlug(slug)
    //check unique slug
    if (product && JSON.stringify(product._id) !== JSON.stringify(id)) {
      throw new BadRequestException(FOUND_SLUG)
    }
    const productUpd = await this.productModel.findOneAndUpdate({ _id: id }, {
      ...updateProductDto, slug
    })
    if (!productUpd) {
      throw new BadRequestException(NOT_PRODUCT_BY_ID)
    }
    return { _id: productUpd._id }
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const productDel = await this.productModel.findOneAndDelete({ _id: id })
    if (!productDel) {
      throw new BadRequestException(NOT_PRODUCT_BY_ID)
    }
    return { _id: productDel._id }
  }
}
