import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './configs/transform.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //get port in .env
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  //versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1"
  });
  //global pipe
  app.useGlobalPipes(new ValidationPipe());
  //global response interceptor
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  //global cookies
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
