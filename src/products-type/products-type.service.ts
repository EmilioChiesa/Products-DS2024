import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { crearProductTypeDTO } from 'src/dto/crearProductType.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductTypeEntity } from 'src/entities/productType.entity';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';

@Injectable()
export class ProductsTypeService {
    @InjectRepository(ProductTypeEntity)
    public readonly productTypeRepository: Repository<ProductTypeEntity> 

    async create(productType:DeepPartial<ProductTypeEntity>):Promise<ProductTypeEntity>{
        try{
            return await this.productTypeRepository.save(productType);
        } catch (error){
            throw new HttpException('Create Product error',500)
        }
    }

    async update(id: number, updateProductTypeDTO: crearProductTypeDTO): Promise<ProductTypeEntity> {
        const productType = await this.productTypeRepository.findOne({where: {id: id} });
        if (!productType) {
            throw new NotFoundException(`ProductType with ID ${id} not found`);
        }

        productType.name = updateProductTypeDTO.name;

        return await this.productTypeRepository.save(productType);
    }

    async buscarPorID(id:number): Promise<ProductTypeEntity> {
        const productType = this.productTypeRepository.findOne({where: {id: id},relations:{products:true} })
        if (!productType) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return productType;
    }
}
