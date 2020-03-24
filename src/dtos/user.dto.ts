export class CreateUserDto {
    readonly firstName: string;
    readonly lastName: string;
    readonly nickName: string;
    readonly phoneNumber: string;
    readonly password: string;
    readonly messageIds: number[];
    readonly userIds: number[];
}
