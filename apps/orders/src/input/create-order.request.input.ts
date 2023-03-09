import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class OrderInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsPositive()
  price: number;

  @Field()
  @IsPhoneNumber()
  phoneNumber: string;
}
