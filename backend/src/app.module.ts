import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbService } from './db/db.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        authSource: 'admin',
        dbName: 'dashweather',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [DbService],
})
export class AppModule {}
