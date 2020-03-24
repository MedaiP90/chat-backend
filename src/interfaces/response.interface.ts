import { ChatEntity } from '../entities/chat.entity';
import { MessageEntity } from '../entities/message.entity';
import { UserEntity } from '../entities/user.entity';

export interface IResponse {
    state: boolean;
    object: ChatEntity | MessageEntity | UserEntity | undefined;
}
