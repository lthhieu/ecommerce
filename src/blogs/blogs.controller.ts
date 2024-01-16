import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CheckPolicies, Public, ResponseMessage, User } from 'src/configs/custom.decorator';
import { BLOG_CREATED, BLOG_DELETED, BLOG_FETCH_ALL, BLOG_FETCH_BY_ID, BLOG_UPDATED, BLOG_UPDATED_LIKE_OR_DISLIKE } from 'src/configs/response.constants';
import { Action } from 'src/configs/define.interface';
import { BlogSubject } from 'src/configs/define.class';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) { }

  @Post()
  @CheckPolicies({ action: Action.Create, subject: BlogSubject })
  @ResponseMessage(BLOG_CREATED)
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  @Public()
  @ResponseMessage(BLOG_FETCH_ALL)
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  @Public()
  @ResponseMessage(BLOG_FETCH_BY_ID)
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Patch('like-or-dislike/:id')
  @CheckPolicies({ action: Action.LikeOrDislike, subject: BlogSubject })
  @ResponseMessage(BLOG_UPDATED_LIKE_OR_DISLIKE)
  likeOrDislike(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Patch(':id')
  @CheckPolicies({ action: Action.Update, subject: BlogSubject })
  @ResponseMessage(BLOG_UPDATED)
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @CheckPolicies({ action: Action.Delete, subject: BlogSubject })
  @ResponseMessage(BLOG_DELETED)
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
