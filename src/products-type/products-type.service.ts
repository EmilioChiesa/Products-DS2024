//Importa las dependencias necesarias
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { crearProductTypeDTO } from 'src/dto/crearProductType.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductTypeEntity } from 'src/entities/productType.entity';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';

//Define el servicio de tipos de productos
@Injectable()
export class ProductsTypeService {
    //Inyecta el repositorio de ProductTypeEntity
    @InjectRepository(ProductTypeEntity)
    public readonly productTypeRepository: Repository<ProductTypeEntity> 

    //Metodo para crear un tipo de producto
    async create(productType:DeepPartial<ProductTypeEntity>):Promise<ProductTypeEntity>{ //Recibe los datos y devuelve un objeto de tipo ProductTypeEntity
        try{
            return await this.productTypeRepository.save(productType); // Guarda el nuevo tipo de producto en la base de datos y lo devuelve
        } catch (error){ // Si ocurre un error, lanza un error de tipo HttpException
            throw new HttpException('Create Product error',500)
        }
    }

    //Metodo para actualizar un tipo de producto
    async update(id: number, updateProductTypeDTO: crearProductTypeDTO): Promise<ProductTypeEntity> { //Recibe el ID del tipo de producto a actualizar y los nuevos datos a través de un DTO
        const productType = await this.productTypeRepository.findOne({where: {id: id} }); // Buscar el tipo de producto con la ID recibida dentro de la base de datos con el metodo findOne
        if (!productType) { // Si no se encuentra el tipo de producto, lanza un error
            throw new NotFoundException(`ProductType with ID ${id} not found`);
        }

        // Actualiza el nombre del tipo de producto con el nombre recibido en el DTO
        productType.name = updateProductTypeDTO.name;

        return await this.productTypeRepository.save(productType); // Guarda el tipo de producto actualizado en la base de datos y lo devuelve
    }

    //Metodo para buscar un tipo de producto por ID
    async buscarPorID(id:number): Promise<ProductTypeEntity> { //Recibe el ID del tipo de producto a buscar y devuelve un objeto de tipo ProductTypeEntity
        const productType = this.productTypeRepository.findOne({where: {id: id},relations:{products:true} }) // Buscar el tipo de producto con la ID recibida dentro de la base de datos con el metodo findOne en conjuto con los productos asociados
        if (!productType) { // Si no se encuentra el tipo de producto, lanza un error
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return productType; // Devuelve el tipo de producto encontrado
    }
}
