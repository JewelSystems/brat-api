import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import Event from './Event';
import Run from './Run';

@Entity('submit_runs')
export default class SubmitRun {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@ManyToOne(() => Event)
	@JoinColumn({ name: "event_id" })
	@Column({ type: 'bigint', nullable: false })
	event_id: number;

	@OneToOne(() => Run)
	@JoinColumn({ name: "run_id" })
	@Column({ type: 'bigint', nullable: false })
	run_id: number;

	@Column({ nullable: false })
	reviewed: boolean;

	@Column({ nullable: false })
	approved: boolean;

	@Column({ nullable: false })
	waiting: boolean;
}
