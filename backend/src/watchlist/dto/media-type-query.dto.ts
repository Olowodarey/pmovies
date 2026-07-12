import { IsEnum } from 'class-validator';
import { MediaType } from '../../../generated/prisma/enums';

export class MediaTypeQueryDto {
  @IsEnum(MediaType)
  mediaType: MediaType;
}
