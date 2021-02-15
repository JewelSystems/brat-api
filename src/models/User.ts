import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToOne, JoinColumn } from 'typeorm';
import moment from 'moment';
import crypto from 'crypto';
import RunRunner from './RunRunner';

@Entity('users')
export default class User {
	@OneToOne(() => RunRunner)
	@JoinColumn({ name: "id" })
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ length: 50, nullable: false })
	first_name: string;

	@Column({ length: 50, nullable: false })
	last_name: string;

	@Column({ length: 80, nullable: false })
	username: string;
	
	@Column({ length: 80, nullable: false })
	nickname: string;
	
	@Column({ length: 80, nullable: false })
	email: string;
	
	@Column({ length: 64, nullable: false })
	password: string;
	
	@Column({ length: 64, nullable: false })
	salt: string;

	@Column({ length: 10, nullable: false })
	gender: string;
	
	@Column({ type: "date", nullable: false })
	birthday: string;
	
	@Column({ length: 20, nullable: false })
	status: string;

	@Column({ length: 25, nullable: false })
	phone_number: string;
	
	@Column({ length: 100 })
	stream_link: string;
	
	@Column({ length: 100 })
	twitch: string;
	
	@Column({ length: 100 })
	twitter: string;
	
	@Column({ length: 100 })
	facebook: string;
	
	@Column({ length: 100 })
	instagram: string;
	
	@Column({ length: 100 })
	youtube: string;
	
	@Column({ length: 64 })
	reset_token: string;    

	@Column({ type: 'bigint', nullable: false })
	created: number;  

	@Column({ type: 'bigint', nullable: false })
	updated: number;

	@BeforeInsert()
  beforeInsert = async () =>{
    let passwordData = await this.saltGen(this.password);
    this.password = passwordData.passwordHash;
    this.salt = passwordData.salt;
    this.status = 'PendingEmail';
    this.created = moment().unix();
    this.updated = moment().unix();
  }

  saltGen = async function(password: string) {
    let salt =  crypto.randomBytes(Math.ceil(64/2))
      .toString('hex')
      .slice(0,64);
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');
    return {
      salt,
      passwordHash: value
    };
  };
}
