//Importo las dependencias necesarias
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from 'src/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeEntity } from 'src/entities/productType.entity';
import { ProductsTypeService } from 'src/products-type/products-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity,ProductTypeEntity]),], // Importo las entidades que voy a utilizar
  controllers: [ProductsController],
  providers: [ProductsService,ProductsTypeService] // Indico los servicios que voy a utilizar
})
export class ProductsModule {}
