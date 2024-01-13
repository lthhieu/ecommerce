import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CheckPolicies, Public } from 'src/configs/custom.decorator';
import { Action } from 'src/configs/define.interface';
import { ProductSubject } from 'src/configs/define.class';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @CheckPolicies({ action: Action.Create, subject: ProductSubject })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies({ action: Action.Update, subject: ProductSubject })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @CheckPolicies({ action: Action.Delete, subject: ProductSubject })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
