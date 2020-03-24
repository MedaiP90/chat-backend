import {
    Entity, PrimaryGeneratedColumn,
    Column, BaseEntity, ManyToOne,
} from 'typeorm';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';

@Entity()
export class MessageEntity extends BaseEntity {
    // Primary key
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    // n:1 many messages for one user
    @ManyToOne(
        type => UserEntity,
        sender => sender.id,
    )
    sender: UserEntity;

    // n:1 many messages for one chat
    @ManyToOne(
        type => ChatEntity,
        chat => chat.messages,
    )
    chat: ChatEntity;
}