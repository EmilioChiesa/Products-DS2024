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
    TypeOrmModule.forRoot({  //Indico las entidades que voy a utilizar
      type: 'sqlite', //Indico que voy a usar una base de datos sqlite
      database:'products.db', //Nombre de la base de datos
      entities, //Entidades que voy a utilizar
      synchronize:true, //Sincronizar la base de datos
    }),
    ProductsTypeModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
