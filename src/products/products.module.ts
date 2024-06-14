import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from 'src/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeEntity } from 'src/entities/productType.entity';
import { ProductsTypeService } from 'src/products-type/products-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity,ProductTypeEntity]),],
  controllers: [ProductsController],
  providers: [ProductsService,ProductsTypeService]
})
export class ProductsModule {}
