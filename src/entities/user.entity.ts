import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity()
export class UserEntity extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, nullable: true })
    firstName: string;

    @Column({ length: 50, nullable: true })
    lastName: string;

    @Column({ length: 50 })
    nickName: string;

    @Column({ length: 20, nullable: true })
    phoneNumber: string

    // 1:n one user many messages
    @OneToMany(
        type => MessageEntity,
        message => message.chat,
    )
    messages: MessageEntity[];
}
