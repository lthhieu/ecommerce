import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './configs/transform.interceptor';
import cookieParser from 'cookie-parser';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PoliciesGuard } from './configs/policies.guard';
import { CaslAbilityFactory } from './casl/casl-ability.factory/casl-ability.factory';

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
  //cors
  app.enableCors({
    origin: [configService.get<string>('FRONTEND_URI'), "http://localhost:3000"],
    credentials: true
  });
  //global cookies
  app.use(cookieParser());
  //global jwt guard
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  const caslAbilityFactory = app.get(CaslAbilityFactory)
  app.useGlobalGuards(new PoliciesGuard(reflector, caslAbilityFactory))
  await app.listen(port);
}
bootstrap();
