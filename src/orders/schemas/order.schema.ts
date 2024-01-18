import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: mongoose.Schema.Types.Array })
    products: {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        count: number;
        color: string
    }[];
    @Prop({ enum: ['progressing', 'cancelled', 'succeeded'], default: 'progressing' })
    status: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    orderBy: User;
    @Prop({ type: Object })
    paymentIntent: {}

}

export const OrderSchema = SchemaFactory.createForClass(Order);