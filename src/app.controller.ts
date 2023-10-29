import { Controller, Get } from '@nestjs/common';

/**
 * Root controller
 */
@Controller()
export class AppController {
  @Get('/version')
  getAppVersion() {
    return process.env.API_VERSION;
  }
}
