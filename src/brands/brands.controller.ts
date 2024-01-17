import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CheckPolicies, Public, ResponseMessage } from 'src/configs/custom.decorator';
import { Action } from 'src/configs/define.interface';
import { BrandSubject } from 'src/configs/define.class';
import { BRAND_CREATED, BRAND_DELETED, BRAND_FETCH_ALL, BRAND_FETCH_BY_ID, BRAND_UPDATED } from 'src/configs/response.constants';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @Post()
  @ResponseMessage(BRAND_CREATED)
  @CheckPolicies({ action: Action.Create, subject: BrandSubject })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @ResponseMessage(BRAND_FETCH_ALL)
  @Public()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @ResponseMessage(BRAND_FETCH_BY_ID)
  @Public()
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage(BRAND_UPDATED)
  @CheckPolicies({ action: Action.Update, subject: BrandSubject })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @ResponseMessage(BRAND_DELETED)
  @CheckPolicies({ action: Action.Delete, subject: BrandSubject })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
