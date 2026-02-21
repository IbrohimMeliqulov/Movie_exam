import { Module } from '@nestjs/common';
import { WatchHistoryController } from './watch_history.controller';
import { WatchHistoryService } from './watch_history.service';

@Module({
  controllers: [WatchHistoryController],
  providers: [WatchHistoryService]
})
export class WatchHistoryModule {}
