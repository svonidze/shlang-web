import { ConsoleLoggerService as LoggerService } from './ConsoleLogger';
import { LocalStorageWrapper } from './LocalStorageWrapper';
import { IUserConfiguration } from 'src/models/UserConfiguration';

export default class UserConfigurationLocalStorage {
    private storage = new LocalStorageWrapper('user');
    private log: LoggerService
    constructor() {
        this.log = new LoggerService();
    }

    get(): IUserConfiguration {
        const config = this.storage.getItem('config');
        return config ? JSON.parse(config) : undefined;
    }

    set(config: IUserConfiguration) {
        this.log.info('set', config);
        this.storage.setItem('config', JSON.stringify(config));
    }
}