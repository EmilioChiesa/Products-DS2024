import { Module } from '@nestjs/common';
import { ProductsTypeController } from './products-type.controller';
import { ProductsTypeService } from './products-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeEntity } from 'src/entities/productType.entity';
import { ProductEntity } from 'src/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity,ProductTypeEntity]),],
  controllers: [ProductsTypeController],
  providers: [ProductsTypeService]
})
export class ProductsTypeModule {}
