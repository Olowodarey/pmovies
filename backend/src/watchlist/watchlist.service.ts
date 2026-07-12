import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddWatchlistDto } from './dto/add-watchlist.dto';
import { MediaType } from '../../generated/prisma/enums';

@Injectable()
export class WatchlistService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.watchlistEntry.findMany({
      where: { userId },
      orderBy: { addedAt: 'desc' },
    });
  }

  add(userId: string, dto: AddWatchlistDto) {
    return this.prisma.watchlistEntry.upsert({
      where: {
        userId_tmdbId_mediaType: {
          userId,
          tmdbId: dto.tmdbId,
          mediaType: dto.mediaType,
        },
      },
      update: {},
      create: {
        userId,
        tmdbId: dto.tmdbId,
        mediaType: dto.mediaType,
        title: dto.title,
        posterPath: dto.posterPath,
      },
    });
  }

  async remove(userId: string, tmdbId: number, mediaType: MediaType) {
    await this.prisma.watchlistEntry.deleteMany({
      where: { userId, tmdbId, mediaType },
    });
    return { success: true };
  }
}
