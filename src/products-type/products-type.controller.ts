import { Body, Controller,Get,NotFoundException,Param,ParseIntPipe,Post, Put } from '@nestjs/common';
import { ProductsTypeService } from './products-type.service';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductTypeEntity } from 'src/entities/productType.entity';
import { crearProductTypeDTO } from 'src/dto/crearProductType.dto';

@Controller('products-type')
export class ProductsTypeController {
    constructor(private service:ProductsTypeService){}

    @Post()
    async create(@Body()product:{name: string},
    ):Promise<ProductTypeEntity>{
        return await this.service.create(product);
    }

    @Get(':id')
    async buscarPorID(@Param('id') id:number): Promise<ProductTypeEntity> {
        try {
            const productType = this.service.buscarPorID(id);
            return productType;
        } catch(error) {
            throw new NotFoundException(error.message);
        }
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id:number, @Body() updateProductTypeDTO: crearProductTypeDTO,): Promise<ProductTypeEntity> {
        try {
            const updatedProductType = await this.service.update(id, updateProductTypeDTO);
            return updatedProductType;
        } catch(error) {
            throw new NotFoundException(error.message);
        }
    }
}
