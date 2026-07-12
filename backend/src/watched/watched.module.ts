import { Module } from '@nestjs/common';
import { WatchedService } from './watched.service';
import { WatchedController } from './watched.controller';

@Module({
  controllers: [WatchedController],
  providers: [WatchedService],
})
export class WatchedModule {}
