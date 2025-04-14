import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppEntity } from './app.entity';
import { CreateAppDto, UpdateAppDto } from './dto/app.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AppEntity)
    private readonly appRepository: Repository<AppEntity>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async create(createAppDto: CreateAppDto): Promise<AppEntity> {
    const newApp = this.appRepository.create(createAppDto);
    return this.appRepository.save(newApp);
  }

  async update(id: number, updateAppDto: UpdateAppDto): Promise<AppEntity> {
    await this.appRepository.update(id, updateAppDto);
    return this.appRepository.findOneBy({ id });
  }
}
