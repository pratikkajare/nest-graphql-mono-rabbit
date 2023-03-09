import { AbstractDocument } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';

@Schema({ versionKey: false })
@ObjectType()
export class Order extends AbstractDocument {
  @Field({ nullable: true })
  @Prop()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @Prop()
  @IsPositive()
  price: number;

  @Field({ nullable: true })
  @Prop()
  @IsPhoneNumber()
  phoneNumber: string;
}

export const OrderSchema2 = SchemaFactory.createForClass(Order);
