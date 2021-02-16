import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event_run_incentives')
export default class EventRunIncentive {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ type: 'bigint', nullable: false })
	event_run_id: number;

	@Column({ type: 'bigint', nullable: false })
	incentive_id: number;

	@Column({ type: 'float', nullable: false })
	cur_value: number;

	@Column({ type: 'float', nullable: false })
	goal: number;
}
