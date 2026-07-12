import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../auth/current-user.decorator';
import { WatchedService } from './watched.service';
import { AddWatchedDto } from './dto/add-watched.dto';
import { UpdateWatchedDto } from './dto/update-watched.dto';

@UseGuards(JwtAuthGuard)
@Controller('watched')
export class WatchedController {
  constructor(private readonly watchedService: WatchedService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.watchedService.findAll(user.userId);
  }

  @Post()
  add(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddWatchedDto) {
    return this.watchedService.add(user.userId, dto);
  }

  @Patch(':id')
  updateRating(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateWatchedDto,
  ) {
    return this.watchedService.updateRating(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.watchedService.remove(user.userId, id);
  }
}
