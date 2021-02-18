import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event_run_bidwar_options')
export default class EventRun {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ type: 'bigint', nullable: false })
	event_run_incentive_id: number;

	@Column({ type: 'float', nullable: false })
	cur_value: number;

	@Column({ type: 'bigint', nullable: false })
	bidwar_option_id: number;
}
