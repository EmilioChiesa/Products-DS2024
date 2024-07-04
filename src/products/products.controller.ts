//Importo las dependencias necesarias
import { Controller, Post, Body, Get, Param, ParseIntPipe, Put, NotFoundException, HttpStatus, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from 'src/entities/product.entity';
import { crearProductDTO } from 'src/dto/crearProduct.dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';
 
//Defino el controlador de productos y su ruta
@Controller('products')
export class ProductsController {
    //Inyecto el servicio ProductsService
    constructor(private service: ProductsService) {}

    //Uso el middleware AuthGuard para proteger la ruta  y permitir el acceso solo a los usuarios con el permiso
    @UseGuards(new AuthGuard(1))
    @Post() //Defino la petición POST para crear un producto
    async create(@Body() createProductDto: crearProductDTO): Promise<ProductEntity> { //Recibe los datos a través del DTO de createProduct mediante Body y devuelve un objeto de tipo ProductEntity
        return await this.service.create(createProductDto); //Llamo al método create del servicio y le paso el DTO
    }

    @UseGuards(new AuthGuard(2))
    @Get('/show') //Defino la petición GET para obtener todos los productos
    async findAll(): Promise<ProductEntity[]> { //Devuelve un array de objetos de tipo ProductEntity
        return await this.service.findAll(); //Llamo al método findAll del servicio
    }

    @UseGuards(new AuthGuard(2))
    @Get(':id') //Defino la petición GET para obtener un producto por ID
    async buscarPorID(@Param('id') id:number): Promise<ProductEntity> { //Recibe el ID del producto a buscar como Param y devuelve un objeto de tipo ProductEntity
        try {
            const product = this.service.buscarPorID(id); //Llamo al método buscarPorID del servicio y le paso el ID
            return product; //Devuelvo el producto encontrado
        } catch(error) { //Si ocurre un error, lanzo un error de tipo NotFoundException
            throw new NotFoundException(error.message);
        }
    }

    @UseGuards(new AuthGuard(2))
    @Get('/search/:name') //Defino la petición GET para buscar un producto por nombre
    async searchByName(@Param('name') name: string): Promise<ProductEntity[]> { //Recibe el nombre del producto a buscar como Param y devuelve un array de objetos de tipo ProductEntity
        return await this.service.searchByName(name); //Llamo al método searchByName del servicio y le paso el nombre
    }

    @UseGuards(new AuthGuard(1))
    @Put(':id') //Defino la petición PUT para actualizar un producto
    async updateProduct( //Recibe el ID del producto a actualizar como Param y los nuevos datos a través del DTO de crearProduct mediante Body
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: crearProductDTO,
    ): Promise<ProductEntity> {
        try { //Intento actualizar el producto
            const updatedProduct = await this.service.update(id, updateProductDto); //Llamo al método update del servicio y le paso el ID y el DTO
            return updatedProduct; //Devuelvo el producto actualizado
        } catch (error) { //Si ocurre un error, lanzo un error de tipo NotFoundException
            throw new NotFoundException(error.message);
        }
    }
}
