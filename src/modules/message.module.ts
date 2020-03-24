import { Module } from '@nestjs/common';
import { MessageService } from '../services/message.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ MessageService ],
})
export class MessageModule {}
