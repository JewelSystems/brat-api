import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_log')
export default class UserLog {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ type: 'bigint', nullable: false })
	updated_user_id: number;

	@Column({ type: 'bigint', nullable: false })
	updater_user_id: number;

  @Column({ length: 50, nullable: false })
	type: string;

  @Column({ type: 'bigint', nullable: false })
	epoch: number;
}
