import { Module } from '@nestjs/common';
import { ChatService } from '../services/chat.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ ChatService ],
})
export class ChatModule {}
