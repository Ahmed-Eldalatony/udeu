import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../../entities/user.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @GetUser() user: User) {
    return this.paymentService.create(createPaymentDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/process')
  processPayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.processPayment(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/refund')
  refundPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason?: string,
  ) {
    return this.paymentService.refundPayment(id, reason);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findByUser(@GetUser() user: User) {
    return this.paymentService.findByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('course/:courseId')
  findByCourse(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return this.paymentService.findByCourse(courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats/summary')
  getPaymentStats() {
    return this.paymentService.getPaymentStats();
  }

  // Webhook endpoint for payment processors (Stripe, PayPal, etc.)
  @Post('webhook/:provider')
  handleWebhook(
    @Param('provider') provider: string,
    @Body() payload: any,
    @Query() query: any,
  ) {
    // TODO: Implement webhook handlers for different payment providers
    return {
      message: `Webhook received for ${provider}`,
      received: true,
    };
  }
}