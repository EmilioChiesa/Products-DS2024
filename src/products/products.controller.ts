import { Controller, Post, Body, Get, Param, ParseIntPipe, Put, NotFoundException, HttpStatus, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from 'src/entities/product.entity';
import { crearProductDTO } from 'src/dto/crearProduct.dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';

@Controller('products')
export class ProductsController {
    constructor(private service: ProductsService) {}

    @UseGuards(new AuthGuard(1))
    @Post()
    async create(@Body() createProductDto: crearProductDTO): Promise<ProductEntity> {
        return await this.service.create(createProductDto);
    }

    @UseGuards(new AuthGuard(2))
    @Get()
    async findAll(): Promise<ProductEntity[]> {
        return await this.service.findAll();
    }

    @UseGuards(new AuthGuard(2))
    @Get(':id')
    async buscarPorID(@Param('id') id:number): Promise<ProductEntity> {
        try {
            const product = this.service.buscarPorID(id);
            return product;
        } catch(error) {
            throw new NotFoundException(error.message);
        }
    }

    @UseGuards(new AuthGuard(1))
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
