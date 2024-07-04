import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity} from 'typeorm';
import { ProductEntity } from './product.entity';

//Definimos la entidad de la tabla productTypes
@Entity('productTypes')

export class ProductTypeEntity extends BaseEntity{ //extendemos de BaseEntity para poder hacer uso de sus métodos
////Definimos la columna id como clave primaria y autoincremental
@PrimaryGeneratedColumn() 
id:number;
//Definimos la columna name como tipo string
@Column()
name:string;
//Definimos la relación de uno a muchos con la tabla products
@OneToMany(()=>ProductEntity, (product) => product.productType)
products:ProductEntity[];
}