import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Connection, Model, SaveOptions, Types } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from './constants/services';
import { Order } from './dto/create-order.request';
import { OrderInput } from './input/create-order.request.input';
import { OrdersRepository } from './orders.repository';
import { OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly connection: Connection,
  ) {}

  // async startTransaction() {
  //   const session = await this.connection.startSession();
  //   session.startTransaction();
  //   return session;
  // }

  // async create(
  //   document: Omit<OrderInput, '_id'>,
  //   options?: SaveOptions,
  // ): Promise<Order> {
  //   const createdDocument = new this.orderModel({
  //     ...document,
  //     _id: new Types.ObjectId(),
  //   });
  //   return (await createdDocument.save(options)).toJSON() as unknown as Order;
  // }

  async createOrder(
    request: OrderInput,
    authentication: string,
  ): Promise<Order> {
    console.log(authentication);

    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
          Authentication: authentication,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  async getOrders(): Promise<Order[]> {
    return this.orderModel.find({});
  }
}
