import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Req, UseGuards } from '@nestjs/common';
import { Order } from './dto/create-order.request';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '@app/common';
import { OrderInput } from './input/create-order.request.input';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Order, { description: 'Create Group Object' })
  async createOrders(
    @Args('createOrders') request: OrderInput,
    @Context() context: { req: Request },
  ): Promise<Order> {
    const group = await this.ordersService.createOrder(
      request,
      context.req.headers.toString(),
    );
    return group;
  }

  @Query(() => [Order])
  async getOrders(): Promise<Order[]> {
    return await this.ordersService.getOrders();
  }
}
