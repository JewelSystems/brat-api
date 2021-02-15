import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('games')
export default class Game {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ length: 64, nullable: false })
	name: string;

	@Column({ length: 4, nullable: false })
	year: string;

}
