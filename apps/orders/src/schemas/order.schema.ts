import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Order extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  phoneNumber: string;
}
export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
