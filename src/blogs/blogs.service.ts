import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schemas/blog.schema';
import mongoose, { Model } from 'mongoose';
import slugify from 'slugify';
import { FOUND_SLUG, INVALID_ID, NOT_BLOG_BY_ID } from 'src/configs/response.constants';
import { BlogCategoriesService } from 'src/blog-categories/blog-categories.service';
import aqp from 'api-query-params';
import { IsEmpty } from 'class-validator';
import { IUser } from 'src/configs/define.interface';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>,
    private readonly blogCategoriesService: BlogCategoriesService) { }

  async findOneBySlug(slug: string) {
    return await this.blogModel.findOne({ slug })
  }

  async create(createBlogDto: CreateBlogDto) {
    const slug = slugify(createBlogDto.title, {
      lower: true,
      locale: 'vi'
    })
    //check slug exist
    let check = await this.findOneBySlug(slug)
    if (check) {
      throw new BadRequestException(FOUND_SLUG)
    }
    //check blog category existed
    await this.blogCategoriesService.findOne(createBlogDto.category.toString())
    //create
    let createNewBlog = await this.blogModel.create({
      ...createBlogDto, slug
    })
    return {
      _id: createNewBlog._id
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

    const totalItems = (await this.blogModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / limit)

    if (IsEmpty(sort as any)) {
      sort = '-updatedAt'
    }

    let products = await this.blogModel.find(filter)
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
    const blog = await this.blogModel.findOne({ _id: id })
    if (!blog) {
      throw new BadRequestException(NOT_BLOG_BY_ID)
    }
    return blog
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const slug = slugify(updateBlogDto.title, {
      lower: true,
      locale: 'vi'
    })
    const blog = await this.findOneBySlug(slug)
    //check unique slug
    if (blog && JSON.stringify(blog._id) !== JSON.stringify(id)) {
      throw new BadRequestException(FOUND_SLUG)
    }
    //check blog category existed
    await this.blogCategoriesService.findOne(updateBlogDto.category.toString())
    return await this.blogModel.updateOne({ _id: id }, {
      ...updateBlogDto, slug
    })
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    return await this.blogModel.deleteOne({ _id: id })
  }

  likeOrDislike = async (id: string, user: IUser) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    //check like
    const isLike = await this.blogModel.findOne({
      _id: id,
      likes: { $in: [user._id] }
    })
    if (!isLike) {
      //like
      await this.blogModel.updateOne({ _id: id }, {
        $push: { likes: user._id }
      })
      //remove id in dislike
      await this.blogModel.updateOne({ _id: id }, {
        $pull: { dislikes: { $in: [user._id] } }
      })
    } else {
      //dislike
      await this.blogModel.updateOne({ _id: id }, {
        $push: { dislikes: user._id }
      })
      //remove id in like
      await this.blogModel.updateOne({ _id: id }, {
        $pull: { likes: { $in: [user._id] } }
      })
    }
    return "ok"
  }
}
