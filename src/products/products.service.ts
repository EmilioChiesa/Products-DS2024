//Importa los módulos necesarios
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { crearProductDTO } from 'src/dto/crearProduct.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductTypeEntity } from 'src/entities/productType.entity';
import { ProductsTypeService } from 'src/products-type/products-type.service';
import { Repository } from 'typeorm';

//Indico que es un injectable
@Injectable()
export class ProductsService {
    //Inyecto el servicio ProductsTypeService y el repositorio de ProductEntity
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>, // Inyecta el repositorio de ProductEntity
        private readonly productsTypeService: ProductsTypeService, // Inyecta el servicio ProductsTypeService
    ) {}

    //Metodo para crear un producto
    async create(crearProductDTO: crearProductDTO):Promise<ProductEntity>{ //Recibe los datos a través de un DTO y devuelve un objeto de tipo ProductEntity
        try{
            const { name, price, productTypeName } = crearProductDTO; // Extrae los datos del DTO

            let productType = await this.productsTypeService.productTypeRepository.findOne({ where: { name: productTypeName } }); // Busca el objeto ProductTypeEntity correspondiente al nombre proporcionado en el DTO

            if (!productType) { // Si no se encuentra el objeto ProductTypeEntity, lanza un error
                throw new HttpException('Mensaje de error personalizado', HttpStatus.BAD_REQUEST);
            }
            
            // Crea un nuevo objeto ProductEntity y le asigna los valores proporcionados en el DTO
            const newProduct = new ProductEntity();
            newProduct.name = name;
            newProduct.price = price;
            newProduct.productType = productType;

            return await this.productRepository.save(newProduct); // Guarda el nuevo producto en la base de datos y lo devuelve
        } catch (error){ // Si ocurre un error, lanza un error de tipo HttpException
            throw new HttpException('Create Product error',500)
        }    
    }

    //Metodo para obtener todos los productos
    async findAll() {
        try{
            return await this.productRepository.find({ 
                relations: { // Si esta relacionado te trae el productType, sino no te lo trae, en este caso como no tenemos creado el productType, trae null
                    productType: true,
                },
            });
        } catch (error){ // Si ocurre un error, lanza un error de tipo HttpException
            throw new Error('Method not implemented.');
        }
    }

    //Metodo para actualizar un producto
    async update(id: number, updateProductDto: crearProductDTO): Promise<ProductEntity> { //Recibe el ID del producto a actualizar y los nuevos datos a través de un DTO
        const product = await this.productRepository.findOne({ where: { id: id } }); // Buscar el producto con la ID recibida dentro de la base de datos
        if (!product) { // Si no se encuentra el producto, lanza un error
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Actualizar las propiedades del producto
        product.name = updateProductDto.name; // Cambia la propiedad name del producto por la proporcionada en el DTO
        product.price = updateProductDto.price; // Cambia la propiedad price del producto por la proporcionada en el DTO

        // Buscar el objeto ProductTypeEntity correspondiente al nombre proporcionado en el DTO de actualización
        let productType = await this.productsTypeService.productTypeRepository.findOne({ where: { name: updateProductDto.productTypeName } });
        if (!productType) { // Si no se encuentra el objeto ProductTypeEntity, lanza un error
            throw new HttpException('Product type not found', HttpStatus.BAD_REQUEST);
        }

        // Asignar el nuevo objeto ProductTypeEntity al producto
        product.productType = productType;

        // Guardar y devolver el producto actualizado
        return await this.productRepository.save(product);
    }

    //Metodo para borrar un producto por ID
    async buscarPorID(id:number): Promise<ProductEntity> { //Recibe el ID del producto a buscar
        const product = this.productRepository.findOne({where: {id: id},relations:{productType: true} }) // Buscar el producto con la ID recibida dentro de la base de datos y lo devuelve en conjunto con su tipo de producto
        if (!product) { // Si no se encuentra el producto, lanza un error
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product; // Devuelve el producto encontrado con su tipo de producto
    }

    //Metodo para buscar un producto por nombre
    async searchByName(name: string): Promise<ProductEntity[]> { //Recibe el nombre del producto a buscar
        const products = await this.productRepository //Busca el producto por nombre en la base de datos y lo almacena en la constante products
          .createQueryBuilder('product') //Crea una consulta de tipo QueryBuilder
          .leftJoinAndSelect('product.productType', 'productType') //Realiza una consulta de tipo JOIN para traer el tipo de producto
          .where('LOWER(product.name) LIKE LOWER(:name)', { name: `%${name}%` }) //Busca el producto por nombre, ignorando mayúsculas y minúsculas
          .getMany(); //Devuelve un array con los productos encontrados
    
        if (!products.length) { //Si no se encuentra ningún producto, lanza un error
          throw new NotFoundException('No products found'); //Lanza un error de tipo NotFoundException
        }
    
        return products; //Devuelve los productos encontrados
      }
    
}
