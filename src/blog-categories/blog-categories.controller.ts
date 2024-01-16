import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogCategoriesService } from './blog-categories.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { CheckPolicies, Public, ResponseMessage } from 'src/configs/custom.decorator';
import { BlogCategorySubject } from 'src/configs/define.class';
import { Action } from 'src/configs/define.interface';
import { BLOG_CATEGORY_CREATED, BLOG_CATEGORY_DELETED, BLOG_CATEGORY_FETCH_ALL, BLOG_CATEGORY_FETCH_BY_ID, BLOG_CATEGORY_UPDATED } from 'src/configs/response.constants';

@Controller('blog-categories')
export class BlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) { }

  @Post()
  @ResponseMessage(BLOG_CATEGORY_CREATED)
  @CheckPolicies({ action: Action.Create, subject: BlogCategorySubject })
  create(@Body() createBlogCategoryDto: CreateBlogCategoryDto) {
    return this.blogCategoriesService.create(createBlogCategoryDto);
  }

  @Get()
  @ResponseMessage(BLOG_CATEGORY_FETCH_ALL)
  @Public()
  findAll() {
    return this.blogCategoriesService.findAll();
  }

  @Get(':id')
  @ResponseMessage(BLOG_CATEGORY_FETCH_BY_ID)
  @Public()
  findOne(@Param('id') id: string) {
    return this.blogCategoriesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage(BLOG_CATEGORY_UPDATED)
  @CheckPolicies({ action: Action.Update, subject: BlogCategorySubject })
  update(@Param('id') id: string, @Body() updateBlogCategoryDto: UpdateBlogCategoryDto) {
    return this.blogCategoriesService.update(id, updateBlogCategoryDto);
  }

  @Delete(':id')
  @ResponseMessage(BLOG_CATEGORY_DELETED)
  @CheckPolicies({ action: Action.Delete, subject: BlogCategorySubject })
  remove(@Param('id') id: string) {
    return this.blogCategoriesService.remove(id);
  }
}
