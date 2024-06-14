import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {entities} from './entities';
import { ProductsTypeModule } from './products-type/products-type.module';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database:'products.db',
      entities,
      synchronize:true,
    }),
    ProductsTypeModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
