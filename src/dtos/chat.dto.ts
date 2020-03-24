export class CreateChatDto {
    readonly name: string;
    readonly type: string;
    readonly description: string;
    readonly messageIds: number[];
    readonly userIds: number[];
}
