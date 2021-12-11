import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth/auth.module';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { CodesModule } from './codes/codes.module';
import { AwardsModule } from './awards/awards.module';
import { OrdersModule } from './orders/orders.module';
import { BeveragesModule } from './beverages/beverages.module';
import { MapsModule } from './maps/maps.module';
import { CreatorModule } from './creator/creator.module';
import { RobotsModule } from './robots/robots.module';
import { ActionsModule } from './actions/actions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    SessionsModule,
    CodesModule,
    AwardsModule,
    OrdersModule,
    BeveragesModule,
    MapsModule,
    CreatorModule,
    RobotsModule,
    ActionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
