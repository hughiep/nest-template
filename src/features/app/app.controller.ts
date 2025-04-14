import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { CreateAppDto, UpdateAppDto } from './dto/app.dto';

@ApiTags('General')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({
    status: 200,
    description: 'Returns a hello message',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  @ApiOperation({ summary: 'Get health status' })
  @ApiResponse({
    status: 200,
    description: 'Returns a health status',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
      },
    },
  })
  getHealth(): object {
    return { status: 'ok' };
  }

  @Post()
  async create(@Body() createAppDto: CreateAppDto) {
    return this.appService.create(createAppDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateAppDto: UpdateAppDto) {
    return this.appService.update(id, updateAppDto);
  }
}
