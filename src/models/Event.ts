import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export default class Event {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ length: 50, nullable: false })
	name: string;

	@Column({ length: 100, nullable: false })
	donation_link: string;

	@Column({ length: 1, nullable: false })
	active: string;

	@Column({ nullable: false })
	start: string;

	@Column({ nullable: false })
	end: string;
}
