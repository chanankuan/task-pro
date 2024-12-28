import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from '../interfaces';

@Entity('backgrounds')
export class Background {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  background_url: string;

  @Column({ type: 'enum', enum: Type })
  type: Type;

  @Column({ type: 'smallint' })
  upscale: 1 | 2;
}
