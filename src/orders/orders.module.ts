import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { UsersModule } from 'src/users/users.module';
import { CouponsModule } from 'src/coupons/coupons.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [UsersModule, CouponsModule, CaslModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
