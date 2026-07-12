import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddWatchedDto } from './dto/add-watched.dto';
import { UpdateWatchedDto } from './dto/update-watched.dto';

@Injectable()
export class WatchedService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.watchedEntry.findMany({
      where: { userId },
      orderBy: { watchedAt: 'desc' },
    });
  }

  async add(userId: string, dto: AddWatchedDto) {
    return this.prisma.$transaction(async (tx) => {
      await tx.watchlistEntry.deleteMany({
        where: { userId, tmdbId: dto.tmdbId, mediaType: dto.mediaType },
      });

      return tx.watchedEntry.upsert({
        where: {
          userId_tmdbId_mediaType: {
            userId,
            tmdbId: dto.tmdbId,
            mediaType: dto.mediaType,
          },
        },
        update: { rating: dto.rating },
        create: {
          userId,
          tmdbId: dto.tmdbId,
          mediaType: dto.mediaType,
          title: dto.title,
          posterPath: dto.posterPath,
          rating: dto.rating,
        },
      });
    });
  }

  async updateRating(userId: string, id: string, dto: UpdateWatchedDto) {
    const entry = await this.prisma.watchedEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new NotFoundException('Watched entry not found');
    }
    if (entry.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.watchedEntry.update({
      where: { id },
      data: { rating: dto.rating },
    });
  }

  async remove(userId: string, id: string) {
    const entry = await this.prisma.watchedEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new NotFoundException('Watched entry not found');
    }
    if (entry.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.watchedEntry.delete({ where: { id } });
    return { success: true };
  }
}
