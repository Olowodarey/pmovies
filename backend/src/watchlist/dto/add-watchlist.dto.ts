import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { MediaType } from '../../../generated/prisma/enums';

export class AddWatchlistDto {
  @IsInt()
  tmdbId: number;

  @IsEnum(MediaType)
  mediaType: MediaType;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  posterPath?: string;
}
