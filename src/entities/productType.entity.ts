import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('productTypes')

export class ProductTypeEntity extends BaseEntity{

@PrimaryGeneratedColumn() //indica que id es clave primaria e incremental

id:number;

@Column()

name:string;
@OneToMany(()=>ProductEntity, (product) => product.productType)
products:ProductEntity[];

}