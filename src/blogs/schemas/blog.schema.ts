import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BlogCategory } from 'src/blog-categories/schemas/blog-category.schema';
import { User } from 'src/users/schemas/user.schema';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ timestamps: true })
export class Blog {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true, unique: true, lowercase: true })
    slug: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: BlogCategory.name })
    category: BlogCategory;

    @Prop({ default: 0 })
    views: number;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
    likes: User[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
    dislikes: User[];

    @Prop()
    image: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    author: User

    @Prop({ default: 0 })
    totalRating: number;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);