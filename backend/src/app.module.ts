import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';

import { WeatherSchema } from './weather/interfaces/weather.schema';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? ''),
    MongooseModule.forFeature([{ name: 'Weather', schema: WeatherSchema }]),
    UsersModule,
    WeatherModule,
  ],
  controllers: [],
})
export class AppModule {}
