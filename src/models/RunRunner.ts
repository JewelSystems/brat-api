import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import Run from './Run';
import User from './User';

@Entity('run_runners')
export default class RunRunner {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@OneToOne(() => User)
	@JoinColumn({ name: "runner_id" })
	@Column({ type: 'bigint', nullable: false })
	runner_id: number;

	@OneToOne(() => Run)
	@JoinColumn({ name: "run_id" })
	@Column({ type: 'bigint', nullable: false })
	run_id: number;
}
