import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
    @Prop({ required: true, unique: true })
    name: string;
    @Prop()
    discount: number;
    @Prop()
    expire: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);