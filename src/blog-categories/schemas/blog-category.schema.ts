import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogCategoryDocument = HydratedDocument<BlogCategory>;

@Schema({ timestamps: true })
export class BlogCategory {
    @Prop({ required: true, unique: true })
    title: string;
    @Prop()
    slug: string;
}

export const BlogCategorySchema = SchemaFactory.createForClass(BlogCategory);