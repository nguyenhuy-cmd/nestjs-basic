import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

// Dùng require cho các thư viện không có type để tránh lỗi đỏ ở dòng import
const softDeletePlugin = require('soft-delete-plugin-mongoose');// xóa mềm 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory: (connection: any) => {
          // Gắn cả 2 plugin vào đây nhé
          connection.plugin(softDeletePlugin); 
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
