import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { ProductTypeEntity } from './productType.entity';


@Entity('products')

export class ProductEntity extends BaseEntity{ //hacemos el extend para poder acceder a la informacion de la BD

@PrimaryGeneratedColumn() //indica que id es clave primaria e incremental

id:number;

@Column()

name:string;

@Column()

price: number;
@ManyToOne(()=>ProductTypeEntity,(productType)=>productType.products)

productType: ProductTypeEntity
}

//cosas que podemos hacer con las clases y los objetos cuando extendemos a BaseEntity
//ProductEntity.find()
//ProductEntity.create
//new ProductEntity().save()
//new ProductEntity().reload()