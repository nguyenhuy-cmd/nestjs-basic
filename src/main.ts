import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));// sử dụng guard jwt để xác thực token

  app.useStaticAssets(join(__dirname, '..', 'public'));// js, css, img
  app.setBaseViewsDir(join(__dirname, '..', 'views'));// view ejs
  app.setViewEngine('ejs');
  const port = configService.get<number>("PORT");
  app.useGlobalPipes(new ValidationPipe());// sử dụng pipe để validate dữ liệu
  await app.listen(port);
  console.log(`>>> Server is running at: http://localhost:${port}`);
}
bootstrap();
