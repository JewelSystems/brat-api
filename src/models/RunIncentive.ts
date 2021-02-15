import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('run_incentives')
export default class RunIncentive {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ type: 'bigint', nullable: false })
	run_id: number;

	@Column({ length: 50, nullable: false })
	type: string;

	@Column({ length: 300, nullable: false })
	comment: string;

	@Column({ length: 50, nullable: false })
	name: string;
}
