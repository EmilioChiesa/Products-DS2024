import { Controller, Post, Body, Get, Param, ParseIntPipe, Put, NotFoundException, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from 'src/entities/product.entity';
import { crearProductDTO } from 'src/dto/crearProduct.dto';

@Controller('products')
export class ProductsController {
    constructor(private service: ProductsService) {}

    @Post()
    async create(@Body() createProductDto: crearProductDTO): Promise<ProductEntity> {
        return await this.service.create(createProductDto);
    }

    @Get()
    async findAll(): Promise<ProductEntity[]> {
        return await this.service.findAll();
    }

    @Get(':id')
    async buscarPorID(@Param('id') id:number): Promise<ProductEntity> {
        try {
            const product = this.service.buscarPorID(id);
            return product;
        } catch(error) {
            throw new NotFoundException(error.message);
        }
    }

    @Put(':id')
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: crearProductDTO,
    ): Promise<ProductEntity> {
        try {
            const updatedProduct = await this.service.update(id, updateProductDto);
            return updatedProduct;
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
}
