import {
    Entity, PrimaryGeneratedColumn, Column,
    BaseEntity, ManyToMany, JoinTable, OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { MessageEntity } from './message.entity';

@Entity()
export class ChatEntity extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 10 })
    type: string;

    @Column({ length: 500, nullable: true })
    description: string;

    // 1:n one chat many messages
    @OneToMany(
        type => MessageEntity,
        message => message.chat,
    )
    messages: MessageEntity[];

    // n:n many chats can have many users
    @ManyToMany(type => UserEntity)
    @JoinTable()
    members: UserEntity[];
}
