import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { WeatherModule } from "./weather/weather.module";
import { AuthModule } from "./auth/auth.module";
import { GeminiModule } from "./gemini/gemini.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI ?? ""),
    UsersModule,
    WeatherModule,
    AuthModule,
    GeminiModule,
  ],
  controllers: [],
})
export class AppModule {}
