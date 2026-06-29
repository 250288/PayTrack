import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  phoneNumber!: string; // primary identifier -- matches how Payme/Click users log in

  @Column({ nullable: true, unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ default: false })
  phoneVerified!: boolean;

  // Tracks whether this device has registered a biometric key with us.
  // The actual FaceID/fingerprint never touches the backend -- see mobile/services/biometrics.ts
  @Column({ default: false })
  biometricEnabled!: boolean;

  @Column({ nullable: true })
  fullName!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
