import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Address } from 'src/addresses/schemas/address.schema';
import { Product } from 'src/products/schemas/product.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    mobile: string;

    @Prop({ default: 'USER' })
    role: string;

    @Prop({ type: mongoose.Schema.Types.Array })
    cart: mongoose.Schema.Types.ObjectId[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Address.name })
    address: Address[];

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Product.name })
    wishlist: Product[];

    @Prop({ default: false })
    isBlocked: boolean;

    @Prop()
    refreshToken: string;

    @Prop()
    passwordChangeAt: string;

    @Prop()
    passwordResetToken: string;

    @Prop()
    passwordResetExpire: string;
}

export const UserSchema = SchemaFactory.createForClass(User);