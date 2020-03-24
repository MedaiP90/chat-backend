import { AppController } from './app.controller';
import { ChatEntity } from './entities/chat.entity';
import { ChatModule, MessageModule, UserModule } from './modules';
import { MessageEntity } from './entities/message.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    ChatModule,
    MessageModule,
    UserModule,

    TypeOrmModule.forFeature([ ChatEntity, MessageEntity, UserEntity ]),

    TypeOrmModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
