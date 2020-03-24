import { ChatEntity } from '../entities/chat.entity'
import { CreateChatDto } from 'src/dtos/chat.dto';
import { Injectable } from '@nestjs/common';
import { IResponse } from '../interfaces/response.interface';
import { MessageEntity } from 'src/entities/message.entity';
import { Moment } from 'moment';
import { UserEntity } from '../entities/user.entity'
import * as moment from 'moment';

import { Logger } from 'pino';
import * as pino from 'pino';

@Injectable()
export class ChatService {
    private readonly l: Logger = pino();

    /**
     * Add an user to a chat.
     * @param chatId The chat where to add a user.
     * @param userId The user to add.
     */
    public async addUser(chatId: number, userId: number): Promise<IResponse> {
        this.l.info(`Chat service - Add user: ${userId} to chat: ${chatId}`);
        const chat: ChatEntity | undefined = await ChatEntity.findOne(chatId);

        if (chat === undefined) { return { state: false, object: chat }; }

        const chatDetails: CreateChatDto = {
            name: chat.name,
            type: chat.type,
            description: chat.description,
            messageIds: chat.messages.map((message: MessageEntity) => message.id),
            userIds: chat.members.map((member: UserEntity) => member.id),
        };

        chatDetails.userIds.push(userId);

        return await this.update(chatId, chatDetails);
    }

    /**
     * Get all messages of a chat.
     * @param chatId The chat that contains messages.
     */
    public async getMessagesOfChat(chatId: number): Promise<MessageEntity[]> {
        this.l.info(`Chat service - Get messages from chat: ${chatId}`);
        const chat: ChatEntity = await ChatEntity.findOne({
            where: { id: chatId },
            relations: ['messages'],
        });

        return chat.messages;
    }

    /**
     * Create a new chat.
     * @param chatDetails Information of the new chat.
     */
    public async insert(chatDetails: CreateChatDto): Promise<IResponse> {
        this.l.info(`Chat service - Create a chat:`);
        this.l.info(chatDetails);
        const creationDateTime: Moment = moment();
        const newChat: ChatEntity = new ChatEntity();

        newChat.name = chatDetails.name;
        newChat.type = chatDetails.type;
        newChat.description = chatDetails.description;
        newChat.createdDateTime = creationDateTime.toDate().getTime();
        newChat.members = [];

        chatDetails.userIds.forEach(async (userId: number) => {
            const user: UserEntity = await UserEntity.findOne(userId);
            if (user !== undefined) { newChat.members.push(user); }
        });

        return { state: true, object: await newChat.save() };
    }

    /**
     * Delete a chat.
     * @param chatId The ID of the chat to be removed.
     */
    public async remove(chatId: number): Promise<IResponse> {
        this.l.info(`Chat service - Remove chat: ${chatId}`);
        const chat: ChatEntity | undefined = await ChatEntity.findOne(chatId);

        if (chat === undefined) { return { state: false, object: chat }; }

        return { state: true, object: await chat.remove() }
    }

    /**
     * Remove an user from a chat.
     * @param chatId The chat where to remove a user.
     * @param userId The user to remove.
     */
    public async removeUser(chatId: number, userId: number): Promise<IResponse> {
        this.l.info(`Chat service - Remove user: ${userId} from chat: ${chatId}`);
        const chat: ChatEntity | undefined = await ChatEntity.findOne(chatId);

        if (chat === undefined) { return { state: false, object: chat }; }

        const chatDetails: CreateChatDto = {
            name: chat.name,
            type: chat.type,
            description: chat.description,
            messageIds: chat.messages.map((message: MessageEntity) => message.id),
            userIds: chat.members
                .map((member: UserEntity) => member.id)
                .filter((id: number) => id !== userId),
        };

        return await this.update(chatId, chatDetails);
    }

    /**
     * Update an existing chat's data.
     * @param chatId The ID of the chat to be updated.
     * @param chatDetails Updates for the given ID's chat.
     */
    public async update(chatId: number, chatDetails: CreateChatDto): Promise<IResponse> {
        this.l.info(`Chat service - Update chat: ${chatId}`);
        this.l.info(chatDetails);
        const chat: ChatEntity | undefined = await ChatEntity.findOne(chatId);

        if (chat === undefined) { return { state: false, object: chat }; }

        chat.name = chatDetails.name;
        chat.description = chatDetails.description;
        chat.members = [];

        chatDetails.userIds.forEach(async (userId: number) => {
            const user: UserEntity = await UserEntity.findOne(userId);
            if (user !== undefined) { chat.members.push(user); }
        });

        // Remove the chat if no member left
        if (chat.members.length === 0) { return await this.remove(chatId); }

        return { state: true, object: await chat.save() };
    }
}
