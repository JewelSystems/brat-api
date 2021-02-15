import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_permissions')
export default class UserPermission {
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ type: 'bigint', nullable: false })
	user_id: number;

	@Column({ type: 'bigint', nullable: false })
	permission_id: number;

}
