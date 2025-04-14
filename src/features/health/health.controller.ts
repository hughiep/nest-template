import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check application health' })
  check() {
    return this.health.check([
      // Memory heap check
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
      // Memory RSS check
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024), // 150MB
      // Disk storage check
      () =>
        this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.75 }),
      // External API check example (uncomment and modify as needed)
      // () => this.http.pingCheck('external_api', 'https://api.example.com'),
    ]);
  }
}
