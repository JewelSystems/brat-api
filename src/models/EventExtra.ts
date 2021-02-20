import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Event from '../models/Event';

@Entity('event_extras')
export default class EventExtra {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@ManyToOne(() => Event)
	@JoinColumn({ name: "event_id" })
	@Column({ type: 'bigint', nullable: false })
	event_id: number;

	@Column({ length: 30, nullable: false })
	type: string;

	@Column({ type: 'bigint', nullable: false })
	time: number;

}
