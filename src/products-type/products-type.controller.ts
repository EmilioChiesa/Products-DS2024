
import { Body, Controller,Get,NotFoundException,Param,ParseIntPipe,Post, Put, UseGuards } from '@nestjs/common';
import { ProductsTypeService } from './products-type.service';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductTypeEntity } from 'src/entities/productType.entity';
import { crearProductTypeDTO } from 'src/dto/crearProductType.dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';

@Controller('products-type')
export class ProductsTypeController {
    constructor(private service:ProductsTypeService){} 

    @UseGuards(new AuthGuard(1))
    @Post()
    async create(@Body()product:{name: string},
    ):Promise<ProductTypeEntity>{
        return await this.service.create(product);
    }

    @UseGuards(new AuthGuard(2))
    @Get(':id')
    async buscarPorID(@Param('id') id:number): Promise<ProductTypeEntity> {
        try {
            const productType = this.service.buscarPorID(id);
            return productType;
        } catch(error) {
            throw new NotFoundException(error.message);
        }
    }

    @UseGuards(new AuthGuard(1))
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
