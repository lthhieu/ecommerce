import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/categories/schemas/category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true, unique: true, lowercase: true })
    slug: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    brand: string;

    @Prop({ required: true })
    price: Number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
    category: Category;

    @Prop({ default: 0 })
    quantity: Number;

    @Prop({ default: 0 })
    sold: Number;

    @Prop({ type: mongoose.Schema.Types.Array })
    images: string[]

    @Prop({ enum: ['gold', 'silver', 'gray'] })
    color: string;

    @Prop({ type: mongoose.Schema.Types.Array })
    ratings: {
        star: Number,
        comment: string,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        postedAt: Date
    }[]

    @Prop({ default: 0 })
    totalRating: Number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);