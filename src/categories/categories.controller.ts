import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CheckPolicies, Public, ResponseMessage } from 'src/configs/custom.decorator';
import { Action } from 'src/configs/define.interface';
import { CategorySubject } from 'src/configs/define.class';
import { CATEGORY_CREATED, CATEGORY_DELETED, CATEGORY_FETCH_ALL, CATEGORY_FETCH_BY_ID, CATEGORY_UPDATED } from 'src/configs/response.constants';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @ResponseMessage(CATEGORY_CREATED)
  @CheckPolicies({ action: Action.Create, subject: CategorySubject })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Public()
  @ResponseMessage(CATEGORY_FETCH_ALL)
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Public()
  @ResponseMessage(CATEGORY_FETCH_BY_ID)
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage(CATEGORY_UPDATED)
  @CheckPolicies({ action: Action.Update, subject: CategorySubject })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ResponseMessage(CATEGORY_DELETED)
  @CheckPolicies({ action: Action.Delete, subject: CategorySubject })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
