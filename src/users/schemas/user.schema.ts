import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';

export type UserDocument = HydratedDocument<User>;
@Schema({ _id: false })
export class Cart {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Product.name })
    product: Product;
    @Prop()
    quantity: number;
    @Prop()
    color: string
}
export const CartSchema = SchemaFactory.createForClass(Cart);
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

    @Prop({ type: [CartSchema] })
    cart: Cart[];

    @Prop({ type: Object })
    address: {
        noHome: string,
        street: string,
        ward: string,
        district: string,
        city: string
    };

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