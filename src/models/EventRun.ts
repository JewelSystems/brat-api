import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import Run from './Run';

@Entity('event_runs')
export default class EventRun {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ type: 'bigint', nullable: false })
	event_id: number;

	@OneToOne(() => Run)
	@JoinColumn({ name: "run_id" })
	@Column({ type: 'bigint', nullable: false })
	run_id: number;

	@Column({ nullable: false })
	date: string;
}
