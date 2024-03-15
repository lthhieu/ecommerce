import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/brands/schemas/brand.schema';
import { Category } from 'src/categories/schemas/category.schema';
import { User } from 'src/users/schemas/user.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
export class Ratings {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    postedBy: User;
    @Prop()
    star: number;
    @Prop()
    comment: string;
    @Prop()
    postedAt: Date
}
export const RatingsSchema = SchemaFactory.createForClass(Ratings);

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true, unique: true, lowercase: true })
    slug: string;

    @Prop({ required: true, type: mongoose.Schema.Types.Array })
    description: string[];

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Brand.name })
    brand: Brand;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Category.name })
    category: Category;

    @Prop({ default: 0 })
    quantity: number;

    @Prop({ default: 0 })
    sold: number;

    @Prop()
    thumb: string;

    @Prop({ type: mongoose.Schema.Types.Array })
    images: string[]

    @Prop({ type: mongoose.Schema.Types.Array })
    variants: {
        label: string,
        variants: string[]
    }[];

    @Prop({ type: {} })
    information: {
        warranty: string,
        delivery: string
    };

    @Prop({ type: [RatingsSchema] })
    ratings: Ratings[];


    @Prop({ default: 0 })
    totalRating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);