import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand } from 'src/brands/schemas/brand.schema';
import { Category } from 'src/categories/schemas/category.schema';
import { Product } from 'src/products/schemas/product.schema';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_BRANDS, INIT_CATEGORIES, INIT_PRODUCTS, USER_ROLE } from './sample-data';

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name)
    constructor(@InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        @InjectModel(Brand.name) private brandModel: Model<Brand>,
        private readonly usersService: UsersService,
        private configService: ConfigService) { }
    async onModuleInit() {
        const isInit = this.configService.get<string>("SHOULD_INIT")
        if (Boolean(isInit)) {
            const countUser = await this.userModel.countDocuments({})
            const countProduct = await this.productModel.countDocuments({})
            const countCategory = await this.categoryModel.countDocuments({})
            const countBrand = await this.brandModel.countDocuments({})
            //create categories
            if (countCategory === 0) {
                await this.categoryModel.insertMany(INIT_CATEGORIES);
            }
            //create brands
            if (countBrand === 0) {
                await this.brandModel.insertMany(INIT_BRANDS);
            }
            //create products
            if (countProduct === 0) {
                await this.productModel.insertMany(INIT_PRODUCTS);
            }
            //create users
            if (countUser === 0) {
                await this.userModel.insertMany([
                    {
                        firstName: "I am",
                        lastName: "Admin",
                        email: "admin@gmail.com",
                        password: this.usersService.hashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        mobile: "0794374673",
                        role: ADMIN_ROLE
                    },
                    {
                        firstName: "I am",
                        lastName: "User",
                        email: "user@gmail.com",
                        password: this.usersService.hashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        mobile: "0794374672",
                        role: USER_ROLE
                    },
                    {
                        firstName: "Ly Tran Hoang",
                        lastName: "Hieu",
                        email: "lthhieu@gmail.com",
                        password: this.usersService.hashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        mobile: "0794374671",
                        role: USER_ROLE
                    },
                ])
            }
            if (countUser > 0 && countProduct > 0 && countBrand > 0 && countCategory > 0) {
                this.logger.log('>>> ALREADY INIT SAMPLE DATA...');
            }
        }
    }
}
