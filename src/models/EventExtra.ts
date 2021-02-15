import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event_extras')
export default class EventExtra {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ type: 'bigint', nullable: false })
	event_id: number;

	@Column({ length: 30, nullable: false })
	type: string;

	@Column({ type: 'bigint', nullable: false })
	time: number;

}
