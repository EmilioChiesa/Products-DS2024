import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { crearProductDTO } from 'src/dto/crearProduct.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductTypeEntity } from 'src/entities/productType.entity';
import { ProductsTypeService } from 'src/products-type/products-type.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
    
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly productsTypeService: ProductsTypeService, // Inyecta el servicio ProductsTypeService
    ) {}

    async create(crearProductDTO: crearProductDTO):Promise<ProductEntity>{
        try{
            const { name, price, productTypeName } = crearProductDTO;

            let productType = await this.productsTypeService.productTypeRepository.findOne({ where: { name: productTypeName } });

            if (!productType) {
                throw new HttpException('Mensaje de error personalizado', HttpStatus.BAD_REQUEST);
            }
            
            const newProduct = new ProductEntity();
            newProduct.name = name;
            newProduct.price = price;
            newProduct.productType = productType;

            return await this.productRepository.save(newProduct);
        } catch (error){
            throw new HttpException('Create Product error',500)
        }    
    }

    async findAll() {
        try{
            return await this.productRepository.find({
                relations: { // si esta relacionado te trae el productType, sino no te lo trae, en este caso como no tenemos creado el productType, trae null
                    productType: true,
                },
            });
        } catch (error){
            throw new Error('Method not implemented.');
        }
    }

    async update(id: number, updateProductDto: crearProductDTO): Promise<ProductEntity> {
        const product = await this.productRepository.findOne({ where: { id: id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Actualizar las propiedades del producto
        product.name = updateProductDto.name;
        product.price = updateProductDto.price;

        // Buscar el objeto ProductTypeEntity correspondiente al nombre proporcionado en el DTO de actualización
        let productType = await this.productsTypeService.productTypeRepository.findOne({ where: { name: updateProductDto.productTypeName } });
        if (!productType) {
            throw new HttpException('Product type not found', HttpStatus.BAD_REQUEST);
        }

        // Asignar el nuevo objeto ProductTypeEntity al producto
        product.productType = productType;

        // Guardar y devolver el producto actualizado
        return await this.productRepository.save(product);
    }

    async buscarPorID(id:number): Promise<ProductEntity> {
        const product = this.productRepository.findOne({where: {id: id},relations:{productType: true} })
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async searchByName(name: string): Promise<ProductEntity[]> {
        const products = await this.productRepository
          .createQueryBuilder('product')
          .leftJoinAndSelect('product.productType', 'productType')
          .where('LOWER(product.name) LIKE LOWER(:name)', { name: `%${name}%` })
          .getMany();
    
        if (!products.length) {
          throw new NotFoundException('No products found');
        }
    
        return products;
      }
    
}
