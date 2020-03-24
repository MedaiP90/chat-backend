import { Controller, Get } from '@nestjs/common';

// tslint:disable-next-line: no-var-requires
const packageJson: {description: string; name: string; version: string } = require('../package.json');

@Controller('app')
export class AppController {
    @Get()
    public appInfo(): {description: string; name: string; version: string } {
        return {
            description: packageJson.description,
            name: packageJson.name,
            version: packageJson.version,
        };
    }
}
