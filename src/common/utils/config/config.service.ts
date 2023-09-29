import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: any };

  constructor(@Inject('CONFIG') private config: any) {
    this.envConfig = config;
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
