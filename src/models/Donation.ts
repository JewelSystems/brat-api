import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('donations')
export default class Donation {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ length: 80, nullable: false })
	first_name: string;

	@Column({ length: 80, nullable: false })
	last_name: string;

	@Column({ length: 80, nullable: false })
	email: string;

	@Column({ type: 'bigint', nullable: false })
	incentive_id: number;

	@Column({ type: 'bigint', nullable: true })
	option_id: number;

	@Column({ type: 'float', nullable: false })
	value: number;
}
