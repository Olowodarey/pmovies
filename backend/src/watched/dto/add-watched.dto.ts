import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { MediaType } from '../../../generated/prisma/enums';

export class AddWatchedDto {
  @IsInt()
  tmdbId: number;

  @IsEnum(MediaType)
  mediaType: MediaType;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  posterPath?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
