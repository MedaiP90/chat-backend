import { ChatEntity } from '../entities/chat.entity';
import { CreateUserDto } from '../dtos/user.dto';
import { Injectable } from '@nestjs/common';
import { IResponse } from '../interfaces/response.interface';
import { Moment } from 'moment';
import { UserEntity } from '../entities/user.entity';
import * as moment from 'moment';
import { MessageEntity } from 'src/entities/message.entity';

import { Logger } from 'pino';
import * as pino from 'pino';

@Injectable()
export class UserService {
    private readonly l: Logger = pino();

    /**
     * Add a friend to an user.
     * @param userId The user where to add a friend.
     * @param friendId The friend to add.
     */
    public async addFriend(userId: number, friendId: number): Promise<IResponse> {
        this.l.info(`User service - Add friend: ${friendId} to user ${userId}`);
        const user: UserEntity | undefined = await UserEntity.findOne(userId);

        if (user === undefined) { return { state: false, object: user }; }

        const userDetails: CreateUserDto = {
            firstName: user.firstName,
            lastName: user.lastName,
            nickName: user.nickName,
            phoneNumber: user.phoneNumber,
            password: user.password,
            messageIds: user.messages.map((message: MessageEntity) => message.id),
            userIds: user.friends.map((friend: UserEntity) => friend.id),
        };

        userDetails.userIds.push(friendId);

        return await this.update(userId, userDetails);
    }

    /**
     * Find all the existing users.
     */
    public async findAll(): Promise<UserEntity[]> {
        this.l.info(`User service - Find all users`);
        return await UserEntity.find();
    }

    /**
     * Find an existing user by its ID.
     * @param userId ID of the user.
     */
    public async findOne(userId: number): Promise<UserEntity | undefined> {
        this.l.info(`User service - Find a user with id: ${userId}`);
        return await UserEntity.findOne(userId);
    }

    /**
     * Get all messages of a chat.
     * @param userId The chat that contains messages.
     */
    public async getChatsOfUser(userId: number): Promise<ChatEntity[]> {
        this.l.info(`User service - Get all chats of user: ${userId}`);
        const chats: ChatEntity[] = await ChatEntity.find();

        return chats.filter((chat: ChatEntity) =>
            chat.members.findIndex((member: UserEntity) => member.id === userId) !== -1
        );
    }

    /**
     * Insert a new user in the database if not exists.
     * @param userDetails Info of the user to be inserted in the database.
     */
    public async insert(userDetails: CreateUserDto): Promise<IResponse> {
        this.l.info(`User service - Create user:`);
        this.l.info(userDetails);
        const creationDateTime: Moment = moment();
        const newUser = new UserEntity();

        // Find if the user already exists
        const allUsers: UserEntity[] = await this.findAll();
        const existingUser: number = allUsers
            .findIndex((user: UserEntity) => user.nickName === userDetails.nickName);

        if (existingUser !== -1) { return { state: true, object: allUsers[existingUser] }; }

        // The user does not exist
        newUser.firstName = userDetails.firstName;
        newUser.lastName = userDetails.lastName;
        newUser.nickName = userDetails.nickName;
        newUser.phoneNumber = userDetails.phoneNumber;
        newUser.createdDateTime = creationDateTime.toDate().getTime();
        newUser.password = userDetails.password;
        newUser.friends = [];

        return { state: false, object: await newUser.save() };
    }

    /**
     * Delete an user from the database.
     * @param userId ID of the user to be removed.
     */
    public async remove(userId: number): Promise<IResponse> {
        this.l.info(`User service - Remove user: ${userId}`);
        const user: UserEntity | undefined = await this.findOne(userId);

        if (user === undefined) { return { state: false, object: user }; }

        return { state: true, object: await user.remove() };
    }

    /**
     * Remove a friend from an user.
     * @param userId The user where to remove a friend.
     * @param friendId The friend to remove.
     */
    public async removeFriend(userId: number, friendId: number): Promise<IResponse> {
        this.l.info(`User service - Remove friend: ${friendId} from user: ${userId}`);
        const user: UserEntity | undefined = await UserEntity.findOne(userId);

        if (user === undefined) { return { state: false, object: user }; }

        const userDetails: CreateUserDto = {
            firstName: user.firstName,
            lastName: user.lastName,
            nickName: user.nickName,
            phoneNumber: user.phoneNumber,
            password: user.password,
            messageIds: user.messages.map((message: MessageEntity) => message.id),
            userIds: user.friends
                .map((friend: UserEntity) => friend.id)
                .filter((id: number) => id !== friendId),
        };

        return await this.update(userId, userDetails);
    }

    /**
     * Update an existing user's data.
     * @param userId The ID of the user to be updated.
     * @param userDetails Updates for the given ID's user.
     */
    public async update(userId: number, userDetails: CreateUserDto): Promise<IResponse> {
        this.l.info(`User service - Update user: ${userId}`);
        this.l.info(userDetails);
        const user: UserEntity | undefined = await this.findOne(userId);

        if (user === undefined) { return { state: false, object: user }; }

        user.firstName = userDetails.firstName;
        user.lastName = userDetails.lastName;
        user.nickName = userDetails.nickName;
        user.phoneNumber = userDetails.phoneNumber;
        user.friends = [];

        userDetails.userIds.forEach(async (id: number) => {
            const friend: UserEntity = await UserEntity.findOne(id);
            if (friend !== undefined) { user.friends.push(friend); }
        });

        return { state: true, object: await user.save() };
    }
}
