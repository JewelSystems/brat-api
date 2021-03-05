import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
export default class Permission {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ length: 64, nullable: false })
	permission: string;
}
