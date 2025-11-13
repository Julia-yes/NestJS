import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';

export enum CartStatus {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  user_id: string;

  @Column({ type: 'enum', enum: CartStatus, default: CartStatus.OPEN })
  status: CartStatus;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];
}
