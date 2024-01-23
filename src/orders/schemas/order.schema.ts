import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { STATUS } from 'src/configs/define.interface';
import { Coupon } from 'src/coupons/schemas/coupon.schema';
import { Cart, CartSchema, User } from 'src/users/schemas/user.schema';
export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {

    @Prop({ type: [CartSchema] })
    products: Cart[];

    @Prop({ default: STATUS.Progressing })
    status: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    orderBy: User;
    @Prop()
    totalPrice: number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Coupon.name })
    coupon: Coupon
}

export const OrderSchema = SchemaFactory.createForClass(Order);