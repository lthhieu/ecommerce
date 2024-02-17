import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true, unique: true })
    title: string;
    @Prop()
    slug: string;
    @Prop({ default: '' })
    image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);