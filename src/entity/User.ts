import { Entity, PrimaryColumn, Column } from 'typeorm';
import BaseRecord from './BaseRecord';

@Entity()
export default class User extends BaseRecord {
  @PrimaryColumn()
  id: string;

  @Column('text', { nullable: false })
  firstName: string;

  @Column('text', { nullable: true })
  lastName: string;

  @Column('text', { nullable: false })
  profileImageUrl: string;
}
