import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CourseModule } from './modules/courses/course.module';
import { EnrollmentModule } from './modules/enrollments/enrollment.module';
import { PaymentModule } from './modules/payments/payment.module';
import { SearchModule } from './modules/search/search.module';
import { ProgressModule } from './modules/progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
      logging: true,
      dropSchema: false, // Don't drop existing schema
      migrationsRun: false, // We'll handle migrations manually if needed
    }),
    UserModule,
    AuthModule,
    CourseModule,
    EnrollmentModule,
    PaymentModule,
    ProgressModule,
    SearchModule,
  ],
})
export class AppModule {}
