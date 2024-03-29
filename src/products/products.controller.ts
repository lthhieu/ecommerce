import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateProductImageDto, UpdateProductRatingDto } from './dto/update-product.dto';
import { CheckPolicies, Public, ResponseMessage, User } from 'src/configs/custom.decorator';
import { Action, IUser } from 'src/configs/define.interface';
import { ProductSubject } from 'src/configs/define.class';
import { PRODUCT_CREATED, PRODUCT_DELETED, PRODUCT_FETCH_ALL, PRODUCT_FETCH_BY_ID, PRODUCT_UPDATED, PRODUCT_UPDATE_IMAGES, PRODUCT_UPDATE_RATING } from 'src/configs/response.constants';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @ResponseMessage(PRODUCT_CREATED)
  @Post()
  @CheckPolicies({ action: Action.Create, subject: ProductSubject })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ResponseMessage(PRODUCT_FETCH_ALL)
  @Get()
  @Public()
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() qs: string) {
    return this.productsService.findAll(+current, +pageSize, qs);
  }

  @ResponseMessage(PRODUCT_FETCH_BY_ID)
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ResponseMessage(PRODUCT_UPDATE_IMAGES)
  @Patch('images/:id')
  @CheckPolicies({ action: Action.Update, subject: ProductSubject })
  updateImages(@Param('id') id: string, @Body() updateProductImageDto: UpdateProductImageDto) {
    return this.productsService.updateImages(id, updateProductImageDto);
  }

  @ResponseMessage(PRODUCT_UPDATE_RATING)
  @Patch('rating/:id')
  @CheckPolicies({ action: Action.Rating, subject: ProductSubject })
  updateRating(@Param('id') id: string, @User() user: IUser, @Body() updateProductRatingDto: UpdateProductRatingDto) {
    return this.productsService.upsertRatings(id, user, updateProductRatingDto);
  }

  @ResponseMessage(PRODUCT_UPDATED)
  @Patch(':id')
  @CheckPolicies({ action: Action.Update, subject: ProductSubject })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @ResponseMessage(PRODUCT_DELETED)
  @Delete(':id')
  @CheckPolicies({ action: Action.Delete, subject: ProductSubject })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
