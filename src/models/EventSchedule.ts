import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import Event from './Event';
import EventRun from './EventRun';

@Entity('event_schedule')
export default class EventSchedule {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ type: 'bigint', nullable: false })
	order: number;

	@Column({ length: 10, nullable: false })
	type: string;
  
	@ManyToOne(() => Event)
	@JoinColumn({ name: "event_id" })
	@Column({ type: 'bigint', nullable: false })
	event_id: number;
  
	@OneToOne(() => EventRun)
	@JoinColumn({ name: "event_run_id" })
	@Column({ type: 'bigint', nullable: true })
	event_run_id: number;
  
	@Column({ type: 'bigint', nullable: true })
	event_extra_id: number;

	@Column({ type: 'bigint', nullable: true })
	setup_time: number;

	@Column({ type: 'bigint', nullable: true })
	extra_time: number;

	@Column({ nullable: false })
	active: boolean;

	@Column({ nullable: false })
	done: boolean;

	@Column({ type: 'bigint', nullable: true })
	final_time: number;

}
