import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));// sử dụng guard jwt để xác thực token
  app.useGlobalInterceptors(new TransformInterceptor(reflector ));// sử dụng interceptor để transform response: Tức là để bọc data trả về với cấu trúc đồng nhất
  app.use(cookieParser());
app.useStaticAssets(join(__dirname, '..', 'public'));// js, css, img
  app.setBaseViewsDir(join(__dirname, '..', 'views'));// view ejs
  app.setViewEngine('ejs');
  const port = configService.get<number>("PORT");
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,// Loại bỏ các trường không có trong DTO
    forbidNonWhitelisted: true,// Bị lỗi nếu có trường không có trong DTO
    transform: true// Tự động ép kiểu dữ liệu (ví dụ: string -> number)
  }));// sử dụng pipe để validate dữ liệu và tự động convert kiểu dữ liệu (transform: true)
  
   // Cấu hình cors 
  app.enableCors({
  "origin": true,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  credentials: true,// cho phép truy cập cookie
});

// Versioning: dùng để quản lý các phiên bản api. Ở đây là version 1 @Version('1')
app.setGlobalPrefix('api');// tiền tố version, ví dụ: /api/v1/companies
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: ['1', '2']
});



  await app.listen(port);
  console.log(`>>> Server is running at: http://localhost:${port}`);
}
bootstrap();
