import { ChatEntity } from '../entities/chat.entity'
import { CreateMessageDto } from '../dtos/message.dto';
import { Injectable } from '@nestjs/common';
import { IResponse } from '../interfaces/response.interface';
import { MessageEntity } from '../entities/message.entity';
import { Moment } from 'moment';
import { UserEntity } from '../entities/user.entity'
import * as moment from 'moment';

import { Logger } from 'pino';
import * as pino from 'pino';

@Injectable()
export class MessageService {
    private readonly l: Logger = pino();

    /**
     * Create a new message.
     * @param messageDetails New message.
     */
    public async insert(messageDetails: CreateMessageDto): Promise<IResponse> {
        this.l.info(`Message service - Create message:`);
        this.l.info(messageDetails);
        const creationDateTime: Moment = moment();
        const newMessage: MessageEntity = new MessageEntity();

        newMessage.content = messageDetails.content;
        newMessage.sentDateTime = creationDateTime.toDate().getTime();
        newMessage.sender = await UserEntity.findOne(messageDetails.userId);
        newMessage.chat = await ChatEntity.findOne(messageDetails.chatId);

        return { state: true, object: await newMessage.save() };
    }

    /**
     * Delete a message.
     * @param messageId The ID of the message to be deleted.
     */
    public async remove(messageId: number): Promise<IResponse> {
        this.l.info(`Message service - Remove message: ${messageId}`);
        const message: MessageEntity | undefined = await MessageEntity.findOne(messageId);

        if (message === undefined) { return { state: false, object: message }; }

        return { state: true, object: await message.remove() };
    }
}
