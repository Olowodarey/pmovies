import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddWatchedDto } from './dto/add-watched.dto';
import { UpdateWatchedDto } from './dto/update-watched.dto';

// TMDB genre id → name mapping (the 20 most common genres)
const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

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
          genreIds: dto.genreIds ?? [],
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

  async getStats(userId: string) {
    const [watched, watchlist] = await Promise.all([
      this.prisma.watchedEntry.findMany({ where: { userId } }),
      this.prisma.watchlistEntry.count({ where: { userId } }),
    ]);

    const now = new Date();
    const thisMonth = watched.filter((w) => {
      const d = new Date(w.watchedAt);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }).length;

    const thisYear = watched.filter(
      (w) => new Date(w.watchedAt).getFullYear() === now.getFullYear(),
    ).length;

    const moviesCount = watched.filter((w) => w.mediaType === 'MOVIE').length;
    const tvCount = watched.filter((w) => w.mediaType === 'TV').length;

    const rated = watched.filter((w) => w.rating !== null);
    const avgRating =
      rated.length > 0
        ? Math.round(
            (rated.reduce((sum, w) => sum + (w.rating ?? 0), 0) / rated.length) * 10,
          ) / 10
        : null;

    // tally genre ids across all watched entries
    const genreCounts: Record<number, number> = {};
    for (const entry of watched) {
      for (const gid of entry.genreIds) {
        genreCounts[gid] = (genreCounts[gid] ?? 0) + 1;
      }
    }
    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({
        id: Number(id),
        name: GENRE_MAP[Number(id)] ?? `Genre ${id}`,
        count,
      }));

    return {
      totalWatched: watched.length,
      totalWatchlist: watchlist,
      thisMonth,
      thisYear,
      moviesCount,
      tvCount,
      avgRating,
      topGenres,
    };
  }
}
