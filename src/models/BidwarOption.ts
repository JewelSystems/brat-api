import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bidwar_options')
export default class BidwarOption {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ type: 'bigint', nullable: false })
	incentive_id: number;

	@Column({ length: 100, nullable: false })
	option: string;
}
