import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { DatabaseModule, RmqModule, AuthModule } from '@app/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { BILLING_SERVICE } from './constants/services';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { OrdersResolver } from './orders.resolvers';
import { Connection } from 'mongoose';
import { Order, OrderSchema2 } from './dto/create-order.request';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/orders/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema2 }]),
    RmqModule.register({
      name: BILLING_SERVICE,
    }),
    AuthModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      debug: false,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, OrdersResolver, Connection],
})
export class OrdersModule {}
