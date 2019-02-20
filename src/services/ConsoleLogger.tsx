import { environment } from '../enviroment/enviroment';

import { Logger } from './Logger';

const noop = (): any => undefined;

export class ConsoleLoggerService implements Logger {

    isDebugMode: boolean;

    constructor(isDebugMode = !environment.production){
        this.isDebugMode = isDebugMode;
    }

    get info() {
        if (this.isDebugMode) {
            return console.info.bind(console);
        }

        return noop;
    }

    get warn() {
        if (this.isDebugMode) {
            return console.warn.bind(console);
        }

        return noop;
    }

    get error() {
        if (this.isDebugMode) {
            return console.error.bind(console);
        }

        return noop;
    }

    invokeConsoleMethod(type: string, ...args: any[]): void {
        const logFn: Function = (console)[type] || console.log || noop;
        logFn.apply(console, args);
    }
}
