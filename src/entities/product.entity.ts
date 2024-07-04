import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { ProductTypeEntity } from './productType.entity';

//Definimos la entidad de la tabla products
@Entity('products') 

export class ProductEntity extends BaseEntity{ //extendemos de BaseEntity para poder hacer uso de sus métodos
//Definimos la columna id como clave primaria y autoincremental
@PrimaryGeneratedColumn() 
id:number;
//Definimos la columna name como tipo string
@Column()
name:string;
//Definimos la columna price como tipo number
@Column()
price: number;
//Definimos la relación de muchos a uno con la tabla productType
@ManyToOne(()=>ProductTypeEntity,(productType)=>productType.products)
productType: ProductTypeEntity
}
