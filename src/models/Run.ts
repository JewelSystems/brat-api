import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import Game from './Game';
import RunRunner from './RunRunner';

@Entity('runs')
export default class Run {
	@OneToOne(() => RunRunner)
	@JoinColumn({ name: "id" })
	@PrimaryGeneratedColumn('increment')
	id: number;

	@OneToOne(() => Game)
	@JoinColumn({ name: "game_id" })
	@Column({ type: 'bigint', nullable: false })
	game_id: number;

	@Column({ length: 30, nullable: false })
	category: string;

  @Column({ type: 'bigint', nullable: false })
	estimated_time: number;

  @Column({ length: 10, nullable: false })
	preferred_time_slot: string;
  
  @Column({ length: 20, nullable: false })
	platform: string;
}
