import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'weather_datta', timestamps: true })
export class WeatherData extends Document {
  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  humidity: number;

  @Prop({ required: true })
  cloudDescription: string;

  @Prop({ required: true, type: Date, index: true })
  collectedAt: Date;
}
