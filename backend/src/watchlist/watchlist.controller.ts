import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../auth/current-user.decorator';
import { WatchlistService } from './watchlist.service';
import { AddWatchlistDto } from './dto/add-watchlist.dto';
import { MediaTypeQueryDto } from './dto/media-type-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.watchlistService.findAll(user.userId);
  }

  @Post()
  add(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddWatchlistDto) {
    return this.watchlistService.add(user.userId, dto);
  }

  @Delete(':tmdbId')
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tmdbId', ParseIntPipe) tmdbId: number,
    @Query() query: MediaTypeQueryDto,
  ) {
    return this.watchlistService.remove(user.userId, tmdbId, query.mediaType);
  }
}
