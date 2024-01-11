import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './configs/mongoose.config';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  MongooseModule.forRootAsync({
    useClass: MongooseConfigService,
  }),
  UsersModule,
  AddressesModule,
  ProductsModule,
  AuthModule,
  MailModule,
  CaslModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
